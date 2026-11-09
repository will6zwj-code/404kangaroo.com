(() => {
  let language = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en';
  window.siteText = (zh, en) => language === 'en' ? en : zh;
  window.siteLanguage = () => language;
  function apply(updateUrl = false) {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = '404 Kangaroo Lab';
    document.querySelectorAll('[data-zh][data-en]').forEach(el => { el.textContent = el.dataset[language]; });
    document.querySelectorAll('[data-placeholder-zh]').forEach(el => { el.placeholder = el.getAttribute(`data-placeholder-${language}`); });
    document.querySelectorAll('[data-aria-zh]').forEach(el => { el.setAttribute('aria-label', el.getAttribute(`data-aria-${language}`)); });
    const toggle = document.querySelector('.language-toggle');
    if (toggle) {
      toggle.textContent = language === 'zh' ? 'EN' : '中文';
      toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
      toggle.setAttribute('lang', language === 'zh' ? 'en' : 'zh-CN');
    }
    if (updateUrl) {
      const url = new URL(location.href);
      if (language === 'zh') url.searchParams.set('lang', 'zh'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    document.dispatchEvent(new Event('site-language-change'));
  }
  document.querySelector('.language-toggle')?.addEventListener('click', () => { language = language === 'zh' ? 'en' : 'zh'; apply(true); });
  apply();
})();

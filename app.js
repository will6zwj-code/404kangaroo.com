(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const tr = (zh, en) => window.siteText ? window.siteText(zh, en) : zh;
  const header = $('#site-header');
  const menu = $('#mobile-nav');
  const toggle = $('.menu-toggle');
  const config = window.SITE_CONFIG || {};
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail || '') ? config.contactEmail : '';
  let applicationUrl = '';
  try {
    const candidate = new URL(config.applicationUrl);
    if (candidate.protocol === 'https:') applicationUrl = candidate.href;
  } catch (_) { /* Contact is intentionally optional until confirmed. */ }

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  const closeMenu = () => { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', tr('打开导航', 'Open navigation')); };
  toggle.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? tr('关闭导航', 'Close navigation') : tr('打开导航', 'Open navigation'));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const aboutMenu = $('#about-menu');
  if (aboutMenu) {
    aboutMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { aboutMenu.open = false; }));
    document.addEventListener('click', event => { if (!aboutMenu.contains(event.target)) aboutMenu.open = false; });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && aboutMenu.open) {
        aboutMenu.open = false;
        aboutMenu.querySelector('summary').focus();
      }
    });
  }

  const joinDialog = $('#join-dialog');
  const form = $('#join-form');
  const status = $('#form-status');
  const interestLabels = () => ({ idea: tr('带着想法加入', 'Bring an idea'), builder: tr('参与项目', 'Join a project'), partner: tr('提供支持', 'Offer support') });
  let lastFocus;
  function showDialog(dialog) {
    lastFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); lastFocus?.focus(); });
  });
  document.querySelectorAll('.join-path').forEach(button => button.addEventListener('click', () => {
    if (applicationUrl) { window.open(applicationUrl, '_blank', 'noopener,noreferrer'); return; }
    form.elements.interest.value = button.dataset.interest;
    if (button.dataset.interest === 'partner') form.elements.support.value = '为其他团队提供支持';
    else if (form.elements.support.value === '为其他团队提供支持') form.elements.support.selectedIndex = 0;
    status.textContent = '';
    showDialog(joinDialog);
  }));
  $('.privacy-trigger').addEventListener('click', () => showDialog($('#privacy-dialog')));

  function refreshCopy() {
  if (email || applicationUrl) {
    const container = $('#join-contact');
    container.hidden = false;
    const link = document.createElement('a');
    link.href = email ? `mailto:${email}` : applicationUrl;
    link.textContent = email ? `${tr('直接写信给我们', 'Write to us')} — ${email} ↗` : tr('打开加入申请页面 ↗', 'Open the application page ↗');
    if (!email) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    container.replaceChildren(link);
  }
  if (email) {
    $('#contact-description').textContent = tr('介绍一下你和你想做的事。填写后会打开邮件草稿，由你确认发送。', 'Tell us about yourself and what you want to work on. We will prepare an email draft for you to review and send.');
    $('#submit-label').textContent = tr('生成邮件，联系 404', 'Prepare an email to 404');
    $('#form-privacy').textContent = tr('网站不会存储表单。邮件由你在邮件应用中确认发送。', 'This website does not store your form. Review and send the message in your email app.');
  }
  toggle.setAttribute('aria-label', menu.hidden ? tr('打开导航', 'Open navigation') : tr('关闭导航', 'Close navigation'));
  status.textContent = '';
  }
  document.addEventListener('site-language-change', refreshCopy);
  refreshCopy();
  form.addEventListener('input', () => { status.textContent = ''; });
  function createBrief() {
    if (!form.reportValidity()) return null;
    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const idea = String(data.get('idea')).trim();
    if (!name || !idea) { status.textContent = tr('请填写名字和一段具体的介绍。', 'Please enter your name and a short introduction.'); return null; }
    const support = form.elements.support.selectedOptions[0]?.textContent || data.get('support');
    const body = [tr('404 Kangaroo Lab · 合作简介', '404 Kangaroo Lab · Collaboration brief'), '', `${tr('参与方式', 'How I would like to join')}: ${interestLabels()[data.get('interest')]}`, `${tr('姓名', 'Name')}: ${name}`, `${tr('联系邮箱', 'Email')}: ${data.get('email')}`, `${tr('需要的支持', 'Support needed')}: ${support}`, '', tr('想法 / 可以带来的能力：', 'My idea / what I can contribute:'), idea].join('\n');
    return { body, subject: `${tr('加入 404', 'Join 404')} · ${interestLabels()[data.get('interest')]} · ${name}` };
  }
  function downloadBrief(body) {
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = tr('404-合作简介.txt', '404-collaboration-brief.txt');
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $('.brief-download').addEventListener('click', () => {
    const brief = createBrief();
    if (!brief) return;
    downloadBrief(brief.body);
    status.textContent = tr(`简介已开始下载，尚未提交。${email ? `你可以将它发送至 ${email}。` : '文件仅保存在你的设备上。'}`, `Your brief is downloading. Nothing has been submitted.${email ? ` You can send it to ${email}.` : ' The file stays on your device.'}`);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const brief = createBrief();
    if (!brief) return;
    if (email) {
      const url = `mailto:${email}?subject=${encodeURIComponent(brief.subject)}&body=${encodeURIComponent(brief.body)}`;
      if (url.length > 1800) {
        downloadBrief(brief.body);
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(brief.subject)}&body=${encodeURIComponent(tr('你好，我想加入 404 Kangaroo Lab。请见我附上的合作简介。', 'Hello, I would like to join 404 Kangaroo Lab. Please find my collaboration brief attached.'))}`;
        status.textContent = tr(`简介较长，已下载为文件。请将它附在邮件中，确认后发送至 ${email}；目前尚未发送。`, `Your brief is long, so we downloaded it as a file. Attach it to your email before sending it to ${email}. Nothing has been sent yet.`);
      } else {
        window.location.href = url;
        status.textContent = tr(`已尝试打开邮件应用，尚未发送。如未打开，可下载简介后发送至 ${email}。`, `We tried to open your email app. Nothing has been sent. If it did not open, download your brief and send it to ${email}.`);
      }
    } else {
      downloadBrief(brief.body);
      status.textContent = tr('简介已开始下载，仅保存在你的设备上，尚未提交给实验室。', 'Your brief is downloading to your device. Nothing has been submitted.');
    }
  });
})();

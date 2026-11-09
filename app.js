(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
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
  const closeMenu = () => { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', '打开导航'); };
  toggle.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? '关闭导航' : '打开导航');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const joinDialog = $('#join-dialog');
  const form = $('#join-form');
  const status = $('#form-status');
  const interestLabels = { idea: '带着想法加入', builder: '参与项目', partner: '提供支持' };
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

  if (email || applicationUrl) {
    const container = $('#join-contact');
    container.hidden = false;
    const link = document.createElement('a');
    link.href = email ? `mailto:${email}` : applicationUrl;
    link.textContent = email ? `也可以直接写信给我们：${email} ↗` : '打开加入申请页面 ↗';
    if (!email) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    container.append(link);
  }
  if (email) {
    $('#contact-description').textContent = '介绍一下你和你想做的事。填写后会打开邮件草稿，由你确认发送。';
    $('#submit-label').textContent = '生成邮件，联系 404';
    $('#form-privacy').textContent = '网站不会存储表单。点击后打开邮件应用，只有你确认发送，收件方才会收到。';
  }
  form.addEventListener('input', () => { status.textContent = ''; });
  function createBrief() {
    if (!form.reportValidity()) return null;
    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const idea = String(data.get('idea')).trim();
    if (!name || !idea) { status.textContent = '请填写名字和一段具体的介绍。'; return null; }
    const body = ['404 Kangaroo Lab · 合作简介', '', `参与方式：${interestLabels[data.get('interest')]}`, `姓名：${name}`, `联系邮箱：${data.get('email')}`, `需要的支持：${data.get('support')}`, '', '想法 / 可以带来的能力：', idea].join('\n');
    return { body, subject: `加入 404 · ${interestLabels[data.get('interest')]} · ${name}` };
  }
  function downloadBrief(body) {
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '404-合作简介.txt';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $('.brief-download').addEventListener('click', () => {
    const brief = createBrief();
    if (!brief) return;
    downloadBrief(brief.body);
    status.textContent = `简介已开始下载，尚未提交。${email ? `你可以将它发送至 ${email}。` : '文件仅保存在你的设备上。'}`;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const brief = createBrief();
    if (!brief) return;
    if (email) {
      const url = `mailto:${email}?subject=${encodeURIComponent(brief.subject)}&body=${encodeURIComponent(brief.body)}`;
      if (url.length > 1800) {
        downloadBrief(brief.body);
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(brief.subject)}&body=${encodeURIComponent('你好，我想加入 404 Kangaroo Lab。请见我附上的合作简介。')}`;
        status.textContent = `简介较长，已下载为文件。请将它附在邮件中，确认后发送至 ${email}；目前尚未发送。`;
      } else {
        window.location.href = url;
        status.textContent = `已尝试打开邮件应用，尚未发送。如未打开，可下载简介后发送至 ${email}。`;
      }
    } else {
      downloadBrief(brief.body);
      status.textContent = '简介已开始下载，仅保存在你的设备上，尚未提交给实验室。';
    }
  });
})();

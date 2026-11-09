# 404 Kangaroo Lab

`404kangaroo.com` 的中英双语响应式官网。原生 HTML、CSS、JavaScript，无构建步骤，无需安装依赖。

## 设计与内容

黑白版以简洁文字、细灰线与留白组织内容，使用用户提供的新袋鼠标志 `assets/logo11.png`。首页不再引用雨林主视觉或绿色主题。

首屏两侧使用镜像方块阵列，向中心逐渐降低密度与不透明度，并为品牌标题、Logo 和加入按钮保留完全空白的安全区域。图案为静态 SVG；`pixels.css` 控制响应式宽度和镜像。导航支持 About 下拉入口，支持内容以两列白底模块展示，协作周期采用深色区块，三类加入入口采用独立卡片；窄屏改为单列。Join us 使用 18px 粗体白字与 56px 最小高度，提高可读性。

内容包括实验室介绍、聚集人／促成合作／推进实践／连接机会、默认 4 周与累计 4 个月的协作节奏，以及合作原则与加入入口。文案依据用户介绍和《404 Charter 01》，保留复杂项目另定里程碑的例外；不宣称融资保证、投资业绩或未经证实的项目案例。

## 语言与字体

- **英文为默认语言**；导航中的 `EN` / `中文` 按钮切换页面、弹窗与表单文字。
- `?lang=zh` 可直接打开中文版本；不带语言参数时显示英文。语言切换保留当前页面路径与锚点。
- `index.html` 的 `data-zh` / `data-en` 提供文字映射，`i18n.js` 负责切换；占位符使用 `data-placeholder-zh` / `data-placeholder-en`，辅助标签使用 `data-aria-zh` / `data-aria-en`。
- 英文当前采用**打字机字体**：`Courier New` → `Courier` → `monospace`。使用本机字体，无需 Adobe Fonts kit，也不再等待 Adobe 接入。
- 中文改用**无衬线字体**：`PingFang SC` → `Noto Sans CJK SC` → `Microsoft YaHei` → `sans-serif`。此前的华文楷体 / STKaiti 方案已取消。正文使用常规字重，标题与行动按钮使用较粗字重，并针对无衬线字形调整字号与行距；**未内嵌中文字体**，实际显示取决于访客设备可用的字体。
- 自定义 `404.html` 同样为黑白双语页面，默认英文，可用 `?lang=zh` 选择中文并保留返回首页时的语言。


## 加入与联系

公开邮箱为 **start@404kangaroo.com**。

三类加入入口分别面向带着想法的人、希望参与项目的人、能够提供支持的人。填写后生成发往该邮箱的邮件草稿，由访客在邮件应用中确认发送；也可下载合作简介后自行联系。网站不代表访客自动发送邮件，也不会把生成草稿显示为已经提交成功。

网站不使用广告追踪或分析 Cookie，无服务器表单，不存储表单内容。域名邮件的实际收发能力由邮箱服务配置决定，前端邮箱链接不代表已验证邮箱投递。

联系信息位于 `site.config.js`：

```js
window.SITE_CONFIG = Object.freeze({
  contactEmail: "start@404kangaroo.com",
  applicationUrl: ""
});
```

如需使用已有报名服务，可将 `applicationUrl` 设置为真实 HTTPS 地址。三个加入入口届时会打开该外部页面。两个字段都为空时，仅提供本地简介下载。

## 本地浏览与维护

可直接用浏览器打开 `index.html`，或在此目录运行：

```sh
python3 -m http.server 4040 --bind 127.0.0.1
```

随后访问 `http://127.0.0.1:4040`（默认英文）；中文版本为 `http://127.0.0.1:4040/?lang=zh`。

| 文件 | 用途 |
| --- | --- |
| `index.html` | 首页结构与中英文字 |
| `styles.css` | 黑白排版、字体族与响应式样式 |
| `pixels.css` | 镜像方块背景与中央留白 |
| `i18n.js` | 语言切换与文档语言 |
| `app.js` | 导航、弹窗、邮件草稿与简介下载 |
| `site.config.js` | 公开邮箱与外部报名页 |
| `404.html` | 双语页面未找到提示 |
| `CNAME` | GitHub Pages 分支部署的自定义域名 |

## GitHub Pages 与 Cloudflare

本项目使用 GitHub Pages 的**分支部署**。将站点文件提交到仓库的 `main` 分支，在 **Settings → Pages → Build and deployment** 选择 **Deploy from a branch**，分支为 **main**，目录为 **/(root)**。`.nojekyll` 用于直接发布静态文件。

在 Pages 设置中将 **Custom domain** 设为 `404kangaroo.com`。`CNAME` 文件不能代替 Pages 设置与 DNS 配置。

Cloudflare 中，根域名 `@` 的 A 记录指向 GitHub Pages 的官方地址：

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

`www` 的 CNAME 指向 `will6zwj-code.github.io`。初次签发 GitHub HTTPS 证书时使用 **DNS only**。保留现有邮箱相关的 MX、SPF、DKIM、DMARC 记录。GitHub 证书可用后启用 **Enforce HTTPS**；用实际域名验证首页、英文切换、静态资源和不存在路径的 404 页面。

此文档说明部署方式，不代表 DNS 已生效或 GitHub 已部署最新文件；以实际服务状态和浏览结果为准。

官方说明：[发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。

## 素材

`assets/logo11.png` 由用户提供。首页通过 CSS 控制显示范围，未修改原图。旧版森林与旧袋鼠文件即使保留在素材目录，也不再用于本版首页。原始章程与参考截图不包含在公开网页内容中。

# 404 Kangaroo Lab

404kangaroo.com 的中文响应式官网。原生 HTML、CSS、JavaScript，无需安装依赖或运行构建。

## 内容与功能

- 原创雨林主视觉，以及用户提供的袋鼠品牌形象。
- 实验室介绍、四类支持、默认 4 周 / 累计 4 个月协作节奏、合作原则。
- 移动导航、可键盘操作的弹窗和折叠内容。
- 三类加入入口，生成发往 `start@404kangaroo.com` 的邮件草稿，由访客确认发送。
- 无服务器表单、无分析追踪。浏览器不会自动提交或存储访客填写的信息。
- 未配置联系邮箱时，表单只生成本地下载简介，并明确说明没有提交。

## 本地浏览

直接用浏览器打开 `index.html`，或在本目录运行：

```sh
python3 -m http.server 4040 --bind 127.0.0.1
```

然后访问 `http://127.0.0.1:4040`。

## 更新内容

- 首页文字：`index.html`
- 视觉样式：`styles.css`
- 交互逻辑：`app.js`
- 公开联系邮箱 / 外部报名页：`site.config.js`

如需使用已有报名服务，在 `applicationUrl` 中填入真实 HTTPS 地址。此时三个加入入口会打开该报名页。只填 `contactEmail` 时使用邮件草稿方式。

## GitHub Pages

将站点文件提交至 `main`。仓库 Settings → Pages → Build and deployment 选择 **Deploy from a branch**，分支 **main**，目录 **/(root)**。`.nojekyll` 使静态资源直接发布。

在 Pages 中设置 Custom domain 为 `404kangaroo.com`。仓库中的 `CNAME` 文件用于分支部署；实际域名仍需在 Pages 设置和 DNS 中完成配置。

Cloudflare 中根域名 `@` 的 A 记录使用 GitHub Pages 官方地址：

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

`www` 的 CNAME 指向 `will6zwj-code.github.io`。初次签发 GitHub HTTPS 证书时使用 DNS only；保留邮箱的 MX、SPF、DKIM、DMARC 记录。证书可用后启用 GitHub Pages Enforce HTTPS。

官方说明：[发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。

## 内容依据与素材

实验室定位来自用户给出的介绍与《404 Charter 01》；章程中的复杂项目节奏例外已保留。网站不宣称融资保证、已有投资业绩、客户名单或未经确认的成员信息。

设计参考：[Y Combinator](https://www.ycombinator.com/) 的清楚定位与参与入口，以及 [Will](https://www.wq-will.com/) 的自然摄影和克制布局。未使用两者的标识、项目业绩或网页素材。

`assets/kangaroo.png` 由用户提供。`assets/hero-forest.jpg` 由内置 imagegen 生成，是原创意象图，不表示实验室的实际场地。原图为 `assets/hero-forest.png`，线上只需 JPG。

生成提示词见 `ASSET-NOTES.md`。原始章程和参考截图不包含在网站的公开文件中。

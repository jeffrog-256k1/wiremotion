# Wiremotion

[English](README.md) · [한국어](README.ko.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [Español](README.es.md)

**将简单的 JSON 图表转换为 README 中的动态示意图 GIF。**

[打开编辑器](https://jeffrog-256k1.github.io/wiremotion/?lang=zh-CN) · [配置参考（英语）](docs/configuration.md) · [示例](examples)

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/pipeline.png">
  <img src="assets/pipeline.gif" alt="信号沿着 Capture、Transform 和 Ship 节点之间的线路移动" width="1280">
</picture>

[查看静态图片](assets/pipeline.png)

用半色调背景、精确连线、流动信号和一种强调色展示工作流程。在编辑器中修改 JSON，然后保存 GIF 和静态 PNG。图表在浏览器内处理，无需上传、账号或 API 密钥。

## 制作第一张图

1. 打开在线编辑器。
2. 选择**流水线**、**分支**或**中心**模板，编辑 JSON 中的标签。
3. 选择主题，然后点击**导出 GIF**和**保存 PNG**。
4. 复制 README 代码，将两张图片放入仓库的 `assets/` 文件夹。

JSON 无效时，保留上一次有效的预览并禁用导出。GIF 在 Worker 中生成，可随时取消。图表内容不会自动保存，离开页面前请下载 JSON。仅语言偏好保存在本地。

## 五种语言

界面和 README 提供英语、韩语、简体中文、日语和西班牙语。可使用顶部语言菜单，或分享带 `?lang=zh-CN` 的链接。支持 `en`、`ko`、`zh-CN`、`ja`、`es`。切换语言不会更改 JSON、主题或图表。按钮、输入错误、无障碍标签及导出状态均已翻译。示例内容、图片内的技术标注、JSON 键、CLI 输出及详细配置参考保留英语。你可以使用系统字体支持的语言编写图表标签。

## 三种模板

| 模板                               | 适用场景             | 结构                      |
| ---------------------------------- | -------------------- | ------------------------- |
| [Pipeline](examples/pipeline.json) | 构建、发布、数据处理 | 按顺序连接 2–5 个节点     |
| [Branch](examples/branch.json)     | 单个输入，多个输出   | 1 个根节点 + 2–4 个叶节点 |
| [Hub](examples/hub.json)           | 工作空间、服务连接   | 1 个中心 + 2–5 个外围节点 |

<details>
<summary>查看分支和中心动画</summary>

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/branch.png">
  <img src="assets/branch.gif" alt="虚构的内容流程分支为文章、视频和演示" width="1280">
</picture>

[查看静态图片](assets/branch.png)

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/hub.png">
  <img src="assets/hub.gif" alt="浅色工作空间连接笔记、文件、任务和人员" width="1280">
</picture>

[查看静态图片](assets/hub.png)

</details>

## 本地运行

需要 **Node.js 22.12 或更新版本**和 npm。无需 Python、FFmpeg、外部字体或付费服务。

```sh
git clone https://github.com/jeffrog-256k1/wiremotion.git
cd wiremotion
npm ci
npm run dev
```

打开 **http://127.0.0.1:4317**。开发服务器仅监听回环地址。需要支持 Canvas、Web Workers 和 OffscreenCanvas 的现代浏览器；主要在 Chromium 中测试。初次加载网站和资源需要网络，但图表处理和导出在本地完成。

### 从文件渲染

```sh
npx playwright install chromium
npm run render -- examples/pipeline.json --out renders/my-flow
```

命令会构建应用，通过临时回环服务器渲染，并生成 `my-flow.gif`、`my-flow.png` 和 `my-flow.md`。除非传入 `--force`，否则不会覆盖现有文件。Markdown 中的路径相对于导出的图片，移入 README 时请调整。Linux 可能需要 `npx playwright install --with-deps chromium` 安装系统依赖。也可设置环境变量 `WIREMOTION_BROWSER_CHANNEL=chrome` 使用已安装的 Chrome。尚未发布 npm 包；请在克隆的仓库内运行命令。

## 输入就是 JSON

```json
{
  "version": 1,
  "title": "从小想法到作品。",
  "layout": "pipeline",
  "nodes": [
    {
      "id": "idea",
      "label": "想法"
    },
    {
      "id": "ship",
      "label": "发布"
    }
  ],
  "edges": [
    {
      "from": "idea",
      "to": "ship"
    }
  ]
}
```

可选字段包括 `theme`、`accent`、`subtitle`、`duration`、`width`、`seed` 和 `sequence`。`sequence` 中每个节点 ID 必须且只能出现一次。连接数必须等于节点数减一；流水线按顺序连接，分支和中心布局连接第一个节点与其余节点。输入不超过 16 KiB；标题最多 52 字符、副标题 96、节点标签 26、节点说明 42、连接标签 16。完整规则见[配置参考](docs/configuration.md)（英语）。

## 功能范围

- 三种固定布局、深浅两种主题及可配置的六位十六进制强调色。
- 4 秒或 6 秒循环，15 fps；输出尺寸为 960×540 或 1280×720。
- 导出 GIF、PNG、JSON 和 README 代码。图片中没有 JavaScript、标志或强制水印。
- 启用减少动态效果时，预览默认暂停。README 代码提供静态图片替代。
- 相同输入、seed、浏览器和字体产生相同帧。系统字体可能不同，不保证跨平台逐像素一致。
- 长标签会缩小，必要时显示省略号。建议使用简短标签，便于手机阅读。

不提供任意图布局、Mermaid 语法或自由绘图编辑器。Wiremotion 专注于可导出、可提交到仓库的简洁风格化动画。

## 开发与验证

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

测试涵盖输入限制、连接拓扑、布局边界、可复现帧、GIF 帧数与时长、导出、取消、减少动态效果、移动端溢出和多语言。还会验证本地应用没有外部请求，测试仅使用虚构示例。

预览和导出共用 `src/renderer.ts`。使用 gifenc 编码 GIF，Vite 构建静态应用，Playwright 驱动本地 CLI 和浏览器测试。

[贡献指南](CONTRIBUTING.md)和[安全说明](SECURITY.md)目前为英语。欢迎附上小型 JSON 示例提交问题或翻译改进。

## 许可证

MIT。参见 [LICENSE](LICENSE) 和[第三方声明](THIRD_PARTY_NOTICES.md)。导出图片可用于个人或商业项目；不要在准备公开的图表中放入私密信息。

[jeffrog-256k1](https://github.com/jeffrog-256k1) · [leejungjae.app](https://leejungjae.app)

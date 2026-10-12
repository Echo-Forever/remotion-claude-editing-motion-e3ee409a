# Claude 剪视频过程 · Remotion 复刻

使用 React、TypeScript 和 Remotion 重建的手绘视频剪辑动效。画面中的编辑器、手机预览、素材缩略图、时间轴、红色方块角色、文字和转场均由组件与 SVG 绘制，未嵌入或播放参考视频。

输出规格：**1280 × 720、30 fps、900 帧、30 秒**。参考片段约为 30.058 秒；本工程将结尾对齐到完整的 30 秒。Composition ID 为 `ClaudeEditingMotion`。

![Remotion 渲染的收尾画面](docs/preview.png)

## 安装与运行

需要 Node.js、npm，以及用于输出核验的 `ffprobe`（随 FFmpeg 提供）。首次渲染时 Remotion 可能需要下载浏览器。项目的预览和完整视频渲染均不需要登录账号、API key 或其他凭证。

```bash
npm ci
npm run start
```

在 Remotion Studio 中选择 `ClaudeEditingMotion` 即可预览，并拖动时间轴查看任意一帧。

## 检查与渲染

```bash
npm run check
npm run render
node scripts/verify-output.mjs
```

成片输出到 `out/claude-editing-motion.mp4`。核验脚本通过 `ffprobe` 读取文件，检查尺寸、帧率、帧数和时长；任何规格不符都会以非零状态退出，不会修改视频。

视频轨道时长精确为 30 秒，H.264 / AAC 双声道编码。AAC 尾部填充可能让 MP4 容器略长（本次为 30.016 秒）；核验脚本限定这部分尾差在一帧之内，视频仍须精确解码出 900 帧。

## 复刻说明

- 米白色画布、深色细描边和略有倾斜的面板构成手绘编辑器。
- 手机预览包含月夜城市、拉面、柴犬和霓虹舞台四组 SVG 场景。
- 红色方块角色通过拖拽素材、伸长手臂、切片、调整滑杆和点击导出，串联整个剪辑过程。
- 所有运动根据当前帧计算，支持逐帧预览与离线渲染。
- 使用开源手写字体 **Long Cang**，随项目提供字体文件及 SIL Open Font License（OFL）。
- 配乐是随项目提供的原创合成节奏，生成脚本为 `scripts/generate-audio.py`；没有使用参考视频的原音轨。手绘插画与细节为组件近似重建，非逐像素拷贝。

构图、配色与分段节奏见 [复刻笔记](docs/recreation-notes.md)。原始视频及本地分析帧不属于公开源码内容。

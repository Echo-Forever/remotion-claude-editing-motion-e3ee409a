# Claude 剪视频过程 · Remotion 复刻

使用 React、TypeScript 和 Remotion 重建的手绘视频剪辑动效。画面中的编辑器、手机预览、素材缩略图、时间轴、红色方块角色、文字和转场均由组件与 SVG 绘制，未嵌入或播放参考视频。

适合学习按帧计算的 React 动画、SVG 场景组合、镜头移动和可重复的视频渲染。这里的剪辑界面是动画演示，按钮与时间轴不提供实际视频编辑功能。

输出规格：**1280 × 720、30 fps、900 帧、30 秒**。参考片段约为 30.058 秒；本工程将结尾对齐到完整的 30 秒。Composition ID 为 `ClaudeEditingMotion`。

![Remotion 渲染的收尾画面](docs/preview.png)

## 安装与运行

需要 Node.js、npm，以及用于输出核验的 `ffprobe`（随 FFmpeg 提供）。历史完整渲染使用 Node.js 25.7.0 / npm 11.10.1；其他版本尚未建立测试矩阵。首次安装需要网络，常规渲染可能下载 Remotion 使用的浏览器。项目的预览和视频渲染不需要账号、API key 或其他凭证。

```bash
npm ci
npm run start
```

在 Remotion Studio 中选择 `ClaudeEditingMotion` 即可预览，并拖动时间轴查看任意一帧。

`package.json` 的 `private: true` 用来避免误发布 npm 包，不影响 GitHub 源码仓库的公开状态。

## 检查与渲染

```bash
npm run check
npm run smoke
npm run still
npm run render
npm run verify
```

成片输出到 `out/claude-editing-motion.mp4`。核验脚本通过 `ffprobe` 读取文件，检查尺寸、帧率、帧数和时长；任何规格不符都会以非零状态退出，不会修改视频。

视频轨道时长精确为 30 秒，H.264 / AAC 双声道编码。AAC 尾部填充可能让 MP4 容器略长（本次为 30.016 秒）；核验脚本限定这部分尾差在一帧之内，视频仍须精确解码出 900 帧。

各命令的检查范围：

| 命令 | 实际作用 |
| --- | --- |
| `npm run check` | TypeScript 静态检查，不能证明浏览器渲染成功 |
| `npm run smoke` | 用当前源码渲染五个代表帧并检查 PNG 尺寸；需要已安装的浏览器，不自动下载 |
| `npm run still` | 渲染第 885 帧到 `out/still.png`，便于人工看收尾构图 |
| `npm run render` | 从当前源码生成完整 MP4 |
| `npm run verify` | 解码已有 MP4 并检查规格；不会重新渲染，也不判断视觉相似度 |

完整渲染和单帧渲染可追加 `-- --browser-executable=/path/to/chrome`。smoke 可用 `REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run smoke` 指定已有浏览器。2026-10-13 的完整渲染记录见[核验记录](docs/verification.md)；不要把核验旧 MP4 误写成重新渲染成功。

## 结构与复用

- `src/Root.tsx`：画幅、帧率、时长和 Composition 注册。
- `src/ClaudeEditingMotion.tsx`：编辑器、时间轴、镜头及按时间分段的动作。
- `src/components/SceneArt.tsx`：四组独立 SVG 场景，以及角色组件。
- `scripts/generate-audio.py`：用 Python 标准库重建当前节奏音轨。
- `scripts/verify-output.mjs`：完整成片的只读技术核验。

当前完整影片固定为 30 秒 / 30 fps，部分动画使用 `frame / 30`；修改帧率时需同步修改时间计算。它还没有通用剪辑项目格式、可配置脚本或 npm 组件包。技术复用示例和边界见[复用说明](docs/reuse.md)。

## 复刻说明

- 米白色画布、深色细描边和略有倾斜的面板构成手绘编辑器。
- 手机预览包含月夜城市、拉面、柴犬和霓虹舞台四组 SVG 场景。
- 红色方块角色通过拖拽素材、伸长手臂、切片、调整滑杆和点击导出，串联整个剪辑过程。
- 所有运动根据当前帧计算，支持逐帧预览与离线渲染。
- 使用开源手写字体 **Long Cang**，随项目提供字体文件及 SIL Open Font License（OFL）。
- 配乐由 `scripts/generate-audio.py` 合成，没有使用参考视频原音轨或外部采样。手绘插画与细节为组件近似重建，非逐像素拷贝。

构图、配色与分段节奏见 [复刻笔记](docs/recreation-notes.md)。原始视频及本地分析帧不属于公开源码内容。

## 许可与来源

[MIT 许可证](LICENSE)适用于维护者有权许可的软件实现和脚本合成音轨。参考作品的角色、美术、文字、构图及其相关权利不由本项目授予；当前材料尚未确认这些参考内容的再许可范围。预览图和渲染成片也包含参考表达，不能据此宣称整部作品完全原创或全部权利已清理。

Long Cang 字体继续采用 OFL 1.1；Remotion 核心与 CLI 使用其自身的 Remotion License，其他依赖按各自条款使用。使用本项目的 MIT 代码不替代 Remotion 使用资格。详细范围、来源和待确认事项见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 协作

问题复现和改进建议请使用仓库的 issue 模板。提交代码、截图或资产前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，提供可复现步骤、验证结果和新增素材的来源及许可。

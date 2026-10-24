# 许可范围与第三方来源

核对日期：2026-10-24。项目级 [MIT 许可](LICENSE)仅授予维护者有权许可的软件实现和脚本合成音轨的相关权利；下列第三方权利及参考表达不包含在该授权中。

## 参考作品与演示画面

参考来源：[Motionface 片段页面](https://motionface.cc/?recording=e3ee409a-50f7-4b4a-af27-288226e47a57)，标题 `claude_剪视频过程motion`，片段 ID `e3ee409a-50f7-4b4a-af27-288226e47a57`。

编辑器构图、红色方块角色、四组场景、动作编排及部分文案参照该视频，通过 React/SVG 重新实现。源码没有嵌入原视频，也没有使用原音轨；这两项事实不证明原作相关权利已经获得授权。

现有材料未确认原视频和角色设计的权利人、允许复刻及公开分发的具体许可、所需署名，或成片与预览图的再许可范围。这些属于仍待确认的事项，项目 MIT 许可不能代替权利人的授权。`docs/preview.png` 及由本项目渲染的成片也包含上述参考表达。复用软件结构时，可替换为权利清晰的角色、美术、文案和编排。

画面保留的“@小克”“Opus 5.5”等文字来自参考内容，不能据此认定原作者身份，也不表示相关个人、产品或平台参与、授权或背书。

原视频、分析关键帧、签名下载地址及绑定凭证不属于本仓库分发内容。不要将这些临时资料加入提交。

## Long Cang 字体

- 文件：`public/fonts/LongCang-Regular.ttf`，内部版本 2.001。
- 上游：[Long Cang](https://github.com/googlefonts/longcang)，[Google Fonts 字体目录](https://github.com/google/fonts/tree/main/ofl/longcang)。本项目最初从 Google Fonts 的镜像取得该文件。
- Copyright 2018 The Long Cang Project Authors。
- 许可：SIL Open Font License 1.1，完整文本保留于 [`public/fonts/OFL.txt`](public/fonts/OFL.txt)。字体本身不改用 MIT；分发时应保留其许可和声明。
- SHA-256：`e5bf2c3f24ef2327c6f136d8f73e2f9dfdf44896fdbeb35a9515f44777bb91bc`。

本次核对了字体内部许可声明与随附文本的一致性，没有对上游当前文件作逐字节认证。

## 脚本合成音轨

`public/audio/score.wav` 由 [`scripts/generate-audio.py`](scripts/generate-audio.py) 的正弦波、固定种子噪声和音符序列生成；脚本只使用 Python 标准库，没有读取外部采样或参考原声。

2026-10-24 在内存重新生成的结果与现有文件逐字节一致：30 秒、100 BPM、44,100 Hz、双声道 PCM16，5,292,044 字节，SHA-256 为 `36f7ef7d772c6731dad76b1399f63ebc88b22566f407d20958a05af2bbeaab65`。该证据说明生成来源，不代表已调查与所有既有旋律的相似性。维护者有权许可的脚本和该合成音轨部分按项目 MIT 许可提供。

## 软件依赖

以下为当前直接依赖，版本以 `package-lock.json` 为准。项目 MIT 许可不替代它们的许可。

| 依赖 | 固定版本 | 已核对的许可信息 |
| --- | --- | --- |
| `remotion`、`@remotion/cli` | 4.0.534 | 安装包中的 Remotion License |
| `@remotion/fonts` | 4.0.534 | 包元数据声明 MIT |
| `react`、`react-dom` | 19.2.0 | MIT |
| `typescript` | 5.9.3 | Apache-2.0，另有第三方声明 |
| `@types/react`、`@types/react-dom` | 19.2.2 | MIT |

Remotion 核心和 CLI 使用专门的 Remotion License，包含按使用主体区分的资格与条件，不能一概归为 MIT 或推定所有场景免费。请核对所用版本附带文本与[官方许可说明](https://www.remotion.dev/docs/license)。

间接依赖也保留各自条款，例如 mediabunny 系列的 MPL-2.0 和 caniuse-lite 的 CC-BY-4.0。部分运行时包未声明 `license` 元数据，不能因此推定没有使用条件。本地 Remotion compositor 所附 FFmpeg n7.1 自述 GPL v2-or-later；浏览器、编解码器和其他运行时须按实际版本及构建核对。

`node_modules/`、浏览器及渲染运行时没有加入本仓库。若今后分发安装包、容器、依赖或二进制副本，应重新核对实际包含的许可、声明及分发义务。这里是来源和范围记录，不是全部依赖许可文本的替代品。

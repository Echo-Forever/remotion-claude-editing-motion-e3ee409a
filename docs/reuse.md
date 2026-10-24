# 场景与渲染流程复用

先阅读 [许可范围](../THIRD_PARTY_NOTICES.md)。以下是技术接口说明；参考角色、美术与文案的权利不因导入组件而获得授权。制作新内容时可保留按帧动画与渲染结构，替换为权利清晰的视觉表达。

## 独立 SVG 场景

`src/components/SceneArt.tsx` 提供：

```tsx
import {SceneArt, MascotArt} from './components/SceneArt';

<SceneArt kind="city" frame={120} />
<SceneArt kind="dance" frame={600} final={false} flashy={0.2} zoom={1} />
<MascotArt frame={600} raised={false} happy />
```

在同一项目的 React/TSX 文件中使用这些元素，并给父容器明确的尺寸。`SceneArt` 的 `viewBox` 为 `0 0 240 400`，`kind` 可取 `city`、`ramen`、`dog`、`dance`；`MascotArt` 的 `viewBox` 为 `0 0 180 150`。两者接收显式 `frame`，便于同一帧重现相同运动；省略时为 0。

`SceneArt.final` 控制舞台场景中的收尾文字和社交图标，`flashy` 控制色彩变化，`zoom` 控制缩放。`MascotArt` 还支持 `sunglasses`、`happy`、`cheeks`、`raised`。这些是源码组件接口，当前未作为独立 npm 包发布。

## 完整影片与时间轴

Composition ID 为 `ClaudeEditingMotion`，入口为 `src/index.ts`。`src/Root.tsx` 固定注册 1280×720、30 fps、900 帧；`ClaudeEditingMotion` 中的动作、镜头和场景切换使用帧时间计算，部分逻辑含 `frame / 30`。

调整影片时长或帧率时需同时检查：Root 参数、秒与帧的换算、场景切换、镜头节点、音轨长度及核验脚本期望值。仅修改 Composition 的 fps 不会自动保持原来的动作节奏。

```bash
npm run check
npm run smoke
npm run still
npm run render
npm run verify
```

修改 `SceneArt.tsx` 的一组画面时，smoke 会覆盖四组场景和收尾；完整影片仍需人工查看转场、文字、裁切和节奏。若使用外部浏览器，渲染命令可追加 `-- --browser-executable=/path/to/chrome`，smoke 使用 `REMOTION_BROWSER_EXECUTABLE`。

## 合成音轨

```bash
python3 scripts/generate-audio.py
```

该命令会覆盖 `public/audio/score.wav`。脚本只使用标准库，其 BPM、和弦与合成参数可在脚本中修改；输出是否与旧文件相同取决于代码和参数。修改后应重新渲染 MP4 并核验音轨和时长。

## 当前边界

- 完整影片不接收通用剪辑工程或故事脚本参数。
- 演示中的素材导入、滑杆和导出按钮是绘制的动画元素。
- 技术规格核验不评价画面相似度、音乐适配或素材权利。
- 字体通过本地文件加载；安装依赖与首次常规浏览器准备可能需要网络，渲染不需要 OpenAI API 或 Motionface 绑定凭证。

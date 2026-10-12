import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const outputPath = fileURLToPath(
  new URL('../out/claude-editing-motion.mp4', import.meta.url),
);

const fail = (message) => {
  console.error(`输出核验失败：${message}`);
  process.exit(1);
};

if (!existsSync(outputPath)) {
  fail('未找到 out/claude-editing-motion.mp4，请先运行 npm run render。');
}

const probe = spawnSync(
  'ffprobe',
  [
    '-v',
    'error',
    '-count_frames',
    '-show_entries',
    'stream=codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,nb_frames,nb_read_frames,duration,channels,sample_rate:format=duration',
    '-of',
    'json',
    outputPath,
  ],
  { encoding: 'utf8' },
);

if (probe.error) {
  fail(
    probe.error.code === 'ENOENT'
      ? '未找到 ffprobe，请安装 FFmpeg 后重试。'
      : `无法运行 ffprobe：${probe.error.message}`,
  );
}

if (probe.status !== 0) {
  fail(`ffprobe 无法读取视频：${probe.stderr.trim() || '未知错误'}`);
}

let metadata;
try {
  metadata = JSON.parse(probe.stdout);
} catch {
  fail('ffprobe 返回了无效的 JSON。');
}

const stream = metadata.streams?.find((item) => item.codec_type === 'video');
const audio = metadata.streams?.find((item) => item.codec_type === 'audio');
if (!stream) {
  fail('文件中没有视频轨道。');
}

const parseRate = (value) => {
  const [numerator, denominator] = String(value).split('/').map(Number);
  return denominator ? numerator / denominator : Number.NaN;
};

const fps = parseRate(stream.r_frame_rate);
const averageFps = parseRate(stream.avg_frame_rate);
const duration = Number(metadata.format?.duration);
const videoDuration = Number(stream.duration);
const frames = Number(stream.nb_read_frames);
const errors = [];

if (stream.width !== 1280 || stream.height !== 720) {
  errors.push(`尺寸为 ${stream.width} × ${stream.height}，应为 1280 × 720`);
}
if (fps !== 30 || averageFps !== 30) {
  errors.push(
    `帧率为 ${stream.r_frame_rate}（平均 ${stream.avg_frame_rate}），应为 30 fps`,
  );
}
// AAC packets can extend the container by a fraction of one video frame.
// Keep the video track / decoded frame count exact, and bound container padding.
if (!Number.isFinite(duration) || duration < 29.999 || duration > 30 + 1 / 30) {
  errors.push(`文件时长为 ${metadata.format?.duration ?? '未知'} 秒，允许最多一帧音频封装尾差`);
}
if (!Number.isFinite(videoDuration) || Math.abs(videoDuration - 30) > 0.001) {
  errors.push(`视频轨道时长为 ${stream.duration ?? '未知'} 秒，应为 30 秒`);
}
if (frames !== 900) {
  errors.push(`实际解码帧数为 ${stream.nb_read_frames ?? '未知'}，应为 900 帧`);
}
if (stream.codec_name !== 'h264') errors.push('视频应使用 H.264 编码');
if (!audio || audio.codec_name !== 'aac' || audio.channels !== 2) {
  errors.push('应包含 AAC 双声道音轨');
}

if (errors.length) {
  fail(errors.join('；'));
}

console.log('输出核验通过（只读）：out/claude-editing-motion.mp4');
console.log(`尺寸：${stream.width} × ${stream.height}`);
console.log(`帧率：${fps} fps；帧数：${frames}`);
console.log(`视频轨道：${videoDuration.toFixed(3)} 秒；容器：${duration.toFixed(3)} 秒`);
console.log(`音轨：${audio.codec_name}，${audio.channels} 声道，${audio.sample_rate} Hz`);

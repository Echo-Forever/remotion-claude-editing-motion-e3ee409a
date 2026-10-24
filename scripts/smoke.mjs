import {spawnSync} from 'node:child_process';
import {accessSync, closeSync, constants, existsSync, mkdtempSync, openSync, readSync, rmSync} from 'node:fs';
import {homedir, tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cli = join(root, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
const frames = [120, 270, 390, 600, 885];
const started = Date.now();
let temporary;

const executable = (path) => {
  if (!path) return false;
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
};

const findBrowser = () => {
  const override = process.env.REMOTION_BROWSER_EXECUTABLE;
  if (override) {
    if (!executable(override)) {
      throw new Error('REMOTION_BROWSER_EXECUTABLE 指向的文件不存在或不可执行。');
    }
    return override;
  }
  const candidates = process.platform === 'darwin'
    ? [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        join(homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
      ]
    : process.platform === 'win32'
      ? [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]
          .filter(Boolean)
          .flatMap((directory) => [join(directory, 'Google/Chrome/Application/chrome.exe'), join(directory, 'Chromium/Application/chrome.exe')])
      : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/opt/google/chrome/chrome', '/snap/bin/chromium'];
  const browser = candidates.find(executable);
  if (!browser) {
    throw new Error('未找到已安装的 Chrome/Chromium。请设置 REMOTION_BROWSER_EXECUTABLE；smoke 不会下载浏览器。');
  }
  return browser;
};

const run = (args) => {
  const result = spawnSync(process.execPath, [cli, ...args, '--log=error'], {
    cwd: root,
    encoding: 'utf8',
    timeout: 120_000,
    maxBuffer: 4 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.error || result.status !== 0) {
    const detail = result.error?.message || result.stderr.trim() || result.stdout.trim() || `退出码 ${result.status}`;
    throw new Error(`${args[0]} 失败：${detail}`);
  }
};

const assertPng = (path, frame) => {
  const header = Buffer.alloc(24);
  const descriptor = openSync(path, 'r');
  let length;
  try {
    length = readSync(descriptor, header, 0, header.length, 0);
  } finally {
    closeSync(descriptor);
  }
  if (length !== 24 || !header.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) || header.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error(`第 ${frame} 帧未生成有效 PNG。`);
  }
  if (header.readUInt32BE(16) !== 1280 || header.readUInt32BE(20) !== 720) {
    throw new Error(`第 ${frame} 帧尺寸错误，应为 1280×720。`);
  }
};

try {
  if (!existsSync(cli)) throw new Error('缺少本地 Remotion CLI，请先运行 npm ci。');
  const browser = findBrowser();
  temporary = mkdtempSync(join(tmpdir(), 'claude-motion-smoke-'));
  const bundle = join(temporary, 'bundle');
  console.log('开始渲染 smoke：使用本地 CLI 和已安装浏览器，打包当前源码一次。');
  run(['bundle', 'src/index.ts', `--out-dir=${bundle}`, '--disable-git-source']);
  for (const frame of frames) {
    const output = join(temporary, `${frame}.png`);
    run(['still', bundle, 'ClaudeEditingMotion', output, `--frame=${frame}`, `--browser-executable=${browser}`]);
    assertPng(output, frame);
    console.log(`第 ${frame} 帧：PNG 1280×720，通过`);
  }
  console.log(`渲染 smoke 通过：5 帧，耗时 ${((Date.now() - started) / 1000).toFixed(1)} 秒。`);
  console.log('本次检查当前源码的关键帧渲染；完整 MP4 的编码、时长和音轨请另运行 npm run render 与 npm run verify。');
} catch (error) {
  console.error(`渲染 smoke 失败：${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) rmSync(temporary, {recursive: true, force: true});
}

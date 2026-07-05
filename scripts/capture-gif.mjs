import puppeteer from 'puppeteer'
import { mkdir, rm } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const framesDir = path.join(root, 'scripts', '.frames')
const outGif = path.join(root, 'motion-demo.gif')

const WIDTH = 900
const HEIGHT = 900
const FPS = 12
const DURATION_SEC = 8
const FRAME_COUNT = FPS * DURATION_SEC
const FRAME_DELAY_MS = 1000 / FPS
const URL = 'http://localhost:5173'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function startDevServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let output = ''
    const onData = (chunk) => {
      output += chunk.toString()
      if (output.includes('Local:') || output.includes('5173')) {
        proc.stdout.off('data', onData)
        proc.stderr.off('data', onData)
        resolve(proc)
      }
    }

    proc.stdout.on('data', onData)
    proc.stderr.on('data', onData)
    proc.on('error', reject)

    setTimeout(() => reject(new Error('Dev server timeout')), 20000)
  })
}

async function captureFrames() {
  await rm(framesDir, { recursive: true, force: true })
  await mkdir(framesDir, { recursive: true })

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 })
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })
    await wait(400)

    for (let i = 0; i < FRAME_COUNT; i++) {
      const framePath = path.join(framesDir, `frame-${String(i).padStart(3, '0')}.png`)
      await page.screenshot({ path: framePath, type: 'png' })
      await wait(FRAME_DELAY_MS)
      process.stdout.write(`\rCaptured ${i + 1}/${FRAME_COUNT}`)
    }
    process.stdout.write('\n')
  } finally {
    await browser.close()
  }
}

function buildGif() {
  return new Promise((resolve, reject) => {
    const py = spawn(
      'python3',
      [
        '-c',
        `
from pathlib import Path
from PIL import Image

frames_dir = Path(${JSON.stringify(framesDir)})
out = Path(${JSON.stringify(outGif)})
frames = sorted(frames_dir.glob('frame-*.png'))
images = [Image.open(f).convert('P', palette=Image.Palette.ADAPTIVE, colors=256) for f in frames]
images[0].save(
    out,
    save_all=True,
    append_images=images[1:],
    duration=${Math.round(1000 / FPS)},
    loop=0,
    optimize=True,
)
print(f'GIF saved: {out} ({len(images)} frames)')
`,
      ],
      { stdio: 'inherit' },
    )
    py.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`python exit ${code}`))))
  })
}

let server
try {
  console.log('Starting dev server...')
  server = await startDevServer()
  await wait(800)
  console.log('Capturing frames...')
  await captureFrames()
  console.log('Building GIF...')
  await buildGif()
} finally {
  if (server) server.kill('SIGTERM')
  await rm(framesDir, { recursive: true, force: true })
}

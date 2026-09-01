import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const [inputPath, outputPath, mode = "transparent"] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error("Usage: node process-product-image.mjs <input> <output> [transparent|edge-white]");
}

async function removeConnectedWhiteBackground(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = new Uint32Array(width * height);
  let head = 0;
  let tail = 0;

  const isBackground = (pixelIndex) => {
    const offset = pixelIndex * channels;
    return data[offset] >= 242 && data[offset + 1] >= 242 && data[offset + 2] >= 242;
  };

  const enqueue = (pixelIndex) => {
    if (!visited[pixelIndex] && isBackground(pixelIndex)) {
      visited[pixelIndex] = 1;
      queue[tail++] = pixelIndex;
    }
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const pixelIndex = queue[head++];
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    if (x > 0) enqueue(pixelIndex - 1);
    if (x + 1 < width) enqueue(pixelIndex + 1);
    if (y > 0) enqueue(pixelIndex - width);
    if (y + 1 < height) enqueue(pixelIndex + width);
  }

  for (let pixelIndex = 0; pixelIndex < visited.length; pixelIndex += 1) {
    if (visited[pixelIndex]) {
      data[pixelIndex * channels + 3] = 0;
    }
  }

  return sharp(data, { raw: info }).png().toBuffer();
}

const source = mode === "edge-white" ? await removeConnectedWhiteBackground(inputPath) : inputPath;
const { data, info } = await sharp(source)
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
  .resize({ width: 900, height: 900, fit: "inside", kernel: sharp.kernel.lanczos3 })
  .modulate({ brightness: 1.01, saturation: 1.02 })
  .sharpen({ sigma: 0.7 })
  .png()
  .toBuffer({ resolveWithObject: true });

const horizontal = 1200 - info.width;
const vertical = 1200 - info.height;

await sharp(data)
  .extend({
    left: Math.floor(horizontal / 2),
    right: Math.ceil(horizontal / 2),
    top: Math.floor(vertical / 2),
    bottom: Math.ceil(vertical / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
  .toFile(outputPath);

console.log(`${outputPath}: ${info.width}x${info.height} on 1200x1200`);

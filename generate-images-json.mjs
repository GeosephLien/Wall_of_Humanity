import fs from "node:fs";
import path from "node:path";

const IMAGES_DIR = path.resolve("images");
const OUT_FILE = path.resolve("images.json");

const SORT_BY = "mtime"; // "mtime" | "birthtime"
const ORDER = "asc";     // "asc" | "desc"

const EXT_OK = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

if (!fs.existsSync(IMAGES_DIR)) {
  console.error(`找不到資料夾：${IMAGES_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
  .filter(d => d.isFile())
  .map(d => d.name)
  .filter(name => EXT_OK.has(path.extname(name).toLowerCase()));

const items = files.map((name) => {
  const full = path.join(IMAGES_DIR, name);
  const st = fs.statSync(full);

  const time =
    SORT_BY === "birthtime"
      ? st.birthtimeMs || st.ctimeMs
      : st.mtimeMs;

  return {
    name,
    timeMs: time,
    iso: new Date(time).toISOString()
  };
});

items.sort((a, b) => ORDER === "asc" ? a.timeMs - b.timeMs : b.timeMs - a.timeMs);

const output = {
  sortBy: SORT_BY,
  order: ORDER,
  generatedAt: new Date().toISOString(),
  images: items.map(x => ({
    src: `images/${encodeURIComponent(x.name)}`,
    name: x.name,
    iso: x.iso
  }))
};

fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), "utf-8");
console.log(`✅ 已產生 ${OUT_FILE}（共 ${output.images.length} 張）`);

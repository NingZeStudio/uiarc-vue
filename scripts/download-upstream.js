import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const UPSTREAM_DIR = path.join(ROOT_DIR, "upstream-tsx");

if (!fs.existsSync(UPSTREAM_DIR)) {
  fs.mkdirSync(UPSTREAM_DIR, { recursive: true });
}

const ALL_COMPONENTS = [
  "accordion","action-button","activity-heatmap","alert","animated-counter",
  "announcement-bar","avatar-group","avatar","badge","bar-chart",
  "billing-toggle","bottom-sheet","breadcrumb","brush-chart","button",
  "calendar","card","carousel","chat-thread","checkbox",
  "chip-group","code-block","color-picker","combobox","command-palette",
  "comment-thread","confirm-morph","context-menu","copy-button","date-picker",
  "date-range-picker","dialog","donut-chart","drawer","dropdown-menu",
  "empty-state","expandable-card","file-dropzone","file-upload","filter-toolbar",
  "gauge","hold-to-confirm","hover-card","image-compare","in-view-title",
  "inline-edit","input","line-chart","mention-input","metric-card",
  "multi-select","notification-center","number-field","otp-input","pagination",
  "password-field","password-strength","phone-input","popover","progress",
  "radio-cards","radio-group","resizable-panels","rich-text-editor","ridgeline",
  "scroll-area","search-field","segmented-control","select","shortcut-recorder",
  "signature-pad","skeleton","slider","slope-chart","slot-text",
  "sortable-data-table","sparkline","split-button","stepper","streamgraph",
  "swipe-actions","switch","tabs","tag-input","text-morph",
  "text-reveal","text-shimmer","textarea","theme-switch","time-picker",
  "timeline","toast-stack","toast","tooltip","tree-view",
  "treemap","usage-meter","user-menu","waffle-chart"
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function downloadComponent(name) {
  const compDir = path.join(UPSTREAM_DIR, name);
  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });

  const url = `https://raw.githubusercontent.com/kuratlielia/arc-library/main/public/r/${name}.json`;
  try {
    const data = await fetchJson(url);
    for (const file of data.files || []) {
      const fileName = path.basename(file.path);
      fs.writeFileSync(path.join(compDir, fileName), file.content || "", "utf-8");
    }
    console.log(`✅ [Downloaded]: ${name}`);
  } catch (err) {
    console.error(`❌ [Failed ${name}]:`, err.message);
  }
}

async function run() {
  console.log(`📥 开始并发下载 upstream 组件源码（共 ${ALL_COMPONENTS.length} 个）...`);
  const BATCH_SIZE = 8;
  for (let i = 0; i < ALL_COMPONENTS.length; i += BATCH_SIZE) {
    const batch = ALL_COMPONENTS.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(downloadComponent));
  }
  console.log("🎉 全部 upstream 源码下载完成！");
}

run();

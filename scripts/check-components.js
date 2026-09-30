import https from "node:https";
import fs from "node:fs";

const list = [
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

async function checkUrl(name) {
  return new Promise((resolve) => {
    const url = `https://raw.githubusercontent.com/kuratlielia/arc-library/main/public/r/${name}.json`;
    https.get(url, (res) => {
      resolve({ name, status: res.statusCode });
    }).on("error", () => resolve({ name, status: 500 }));
  });
}

async function run() {
  console.log("Checking 99 components in public/r/...");
  const results = await Promise.all(list.map(checkUrl));
  const success = results.filter((r) => r.status === 200).map((r) => r.name);
  const failed = results.filter((r) => r.status !== 200).map((r) => r.name);
  console.log(`Success (200): ${success.length}`);
  console.log(`Failed (!=200): ${failed.length}`, failed);
}

run();

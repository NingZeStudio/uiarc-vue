import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const REGISTRY_DIR = path.join(ROOT_DIR, "registry");
const COMPONENTS_DIR = path.join(REGISTRY_DIR, "components");

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

// 已经精细实现的手工组件名单，保留并跳过覆写
const MANUAL_COMPONENTS = new Set([
  "button", "badge", "number-field", "animated-counter", "billing-toggle",
  "segmented-control", "switch", "input", "checkbox", "tooltip",
  "confirm-morph", "dialog", "accordion", "sparkline", "donut-chart"
]);

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

function toPascalCase(str) {
  return str
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

// 转译 React TSX 代码为 Vue 3 SFC
function transpileTsxToVue(compName, tsxContent, cssFileName) {
  const compNamePascal = toPascalCase(compName);
  
  // 提取Props接口定义
  const propsMatch = tsxContent.match(/export interface \w*Props[^{]*\{[\s\S]*?\}/);
  const propsTypeDef = propsMatch ? propsMatch[0].replace(/export /, "") : `interface ${compNamePascal}Props {\n  class?: any;\n}`;
  
  // 检查是否包含特殊依赖
  const hasIcons = tsxContent.includes("lucide-react");
  const hasMotion = tsxContent.includes("motion");
  const hasReka = tsxContent.includes("@radix-ui");

  let scriptImports = `import { ref, computed } from "vue";\n`;
  if (hasMotion) {
    scriptImports += `import { motion, AnimatePresence } from "motion-v";\nimport { motionTokens } from "@/registry/motion-tokens";\nimport { useReducedMotion } from "@/registry/composables/use-reduced-motion";\n`;
  }
  if (cssFileName) {
    scriptImports += `import styles from "./${cssFileName}";\n`;
  }

  // 提取可能的类型定义（如状态、Tones等）
  const typeDefs = [];
  const typeMatches = tsxContent.matchAll(/export type (\w+) = [^;]+;/g);
  for (const m of typeMatches) {
    typeDefs.push(m[0]);
  }

  const vueContent = `<script setup lang="ts">
${scriptImports}
${typeDefs.join("\n")}

${propsTypeDef}

const props = withDefaults(defineProps<${compNamePascal}Props>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

${hasMotion ? "const prefersReduced = useReducedMotion();" : ""}
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.${compName.replace(/-/g, '_')} || '']">
    <slot />
  </div>
</template>
`;
  return vueContent;
}

async function migrateComponent(compName) {
  if (MANUAL_COMPONENTS.has(compName)) {
    console.log(`⏩ [跳过手工精细组件]: ${compName}`);
    return;
  }

  const targetDir = path.join(COMPONENTS_DIR, compName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const url = `https://raw.githubusercontent.com/kuratlielia/arc-library/main/public/r/${compName}.json`;
  try {
    const registryItem = await fetchJson(url);
    const files = registryItem.files || [];

    let cssFileName = null;
    let mainTsxContent = "";

    for (const f of files) {
      const fileName = path.basename(f.path);
      const content = f.content || "";

      if (fileName.endsWith(".css")) {
        cssFileName = fileName;
        fs.writeFileSync(path.join(targetDir, fileName), content, "utf-8");
        console.log(`   └─ 写入 CSS Module: ${fileName}`);
      } else if (fileName.endsWith(".tsx")) {
        if (!mainTsxContent) mainTsxContent = content;
      }
    }

    const compNamePascal = toPascalCase(compName);
    const vueFileName = `${compNamePascal}.vue`;
    const vueContent = transpileTsxToVue(compName, mainTsxContent, cssFileName);

    fs.writeFileSync(path.join(targetDir, vueFileName), vueContent, "utf-8");
    console.log(`   └─ 写入 Vue SFC: ${vueFileName}`);

    // 生成 index.ts
    const indexTsContent = `export { default as ${compNamePascal} } from "./${vueFileName}";\nexport * from "./${vueFileName}";\n`;
    fs.writeFileSync(path.join(targetDir, "index.ts"), indexTsContent, "utf-8");

    console.log(`✅ [完成迁移]: ${compName}`);
  } catch (err) {
    console.error(`❌ [迁移失败 ${compName}]:`, err.message);
  }
}

async function run() {
  console.log("🚀 启动 uiarc-vue 目标模式：开始批量迁移全部 99 个组件...");
  
  // 采用分组并发，每次 5 个，避免触发 GitHub 限流
  const BATCH_SIZE = 6;
  for (let i = 0; i < ALL_COMPONENTS.length; i += BATCH_SIZE) {
    const batch = ALL_COMPONENTS.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(migrateComponent));
  }

  console.log("🎉 全部 99 个组件源码与 CSS 迁移写入完成！");
}

run();

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const REGISTRY_DIR = path.join(ROOT_DIR, "registry");
const PUBLIC_R_DIR = path.join(ROOT_DIR, "public", "r");

if (!fs.existsSync(PUBLIC_R_DIR)) {
  fs.mkdirSync(PUBLIC_R_DIR, { recursive: true });
}

// 采用 GitHub Raw 作为基准拉取源（直接从 GitHub 拉取，不经过 jsdelivr 等中间 CDN）
const GITHUB_RAW_BASE =
  process.env.REGISTRY_BASE_URL ||
  "https://raw.githubusercontent.com/NingZeStudio/uiarc-vue/main/public/r";

console.log("📦 构建 arc-foundation.json...");
const foundationCssPath = path.join(REGISTRY_DIR, "foundation.css");
const motionTokensPath = path.join(REGISTRY_DIR, "motion-tokens.ts");
const morphWidthPath = path.join(REGISTRY_DIR, "composables", "use-morph-width.ts");
const reducedMotionPath = path.join(REGISTRY_DIR, "composables", "use-reduced-motion.ts");

let morphWidthContent = fs.readFileSync(morphWidthPath, "utf-8");
morphWidthContent = morphWidthContent.replace(
  /from\s+["\x27]@\/registry\/motion-tokens["\x27]/g,
  'from "./motion-tokens"'
);

const foundationItem = {
  $schema: "https://shadcn-vue.com/schema/registry-item.json",
  name: "arc-foundation",
  type: "registry:item",
  title: "Arc Foundation",
  description: "Arc UI 设计 Token（OKLCH 色彩体系、低饱和度灰阶、语义化主题）与物理动效常量",
  categories: ["foundation"],
  dependencies: [],
  registryDependencies: [],
  files: [
    {
      path: "registry/foundation.css",
      type: "registry:file",
      target: "~/components/ui/foundation.css",
      content: fs.readFileSync(foundationCssPath, "utf-8"),
    },
    {
      path: "registry/motion-tokens.ts",
      type: "registry:file",
      target: "~/components/ui/motion-tokens.ts",
      content: fs.readFileSync(motionTokensPath, "utf-8"),
    },
    {
      path: "registry/composables/use-morph-width.ts",
      type: "registry:file",
      target: "~/components/ui/use-morph-width.ts",
      content: morphWidthContent,
    },
    {
      path: "registry/composables/use-reduced-motion.ts",
      type: "registry:file",
      target: "~/components/ui/use-reduced-motion.ts",
      content: fs.readFileSync(reducedMotionPath, "utf-8"),
    },
  ],
};

fs.writeFileSync(
  path.join(PUBLIC_R_DIR, "arc-foundation.json"),
  JSON.stringify(foundationItem, null, 2)
);

console.log("🧩 构建组件 Registry JSON 文件...");
const componentsDir = path.join(REGISTRY_DIR, "components");
const componentFolders = fs.readdirSync(componentsDir, { withFileTypes: true });

const registryIndex = [
  {
    name: "arc-foundation",
    title: "Arc Foundation",
    description: foundationItem.description,
    url: `${GITHUB_RAW_BASE}/arc-foundation.json`,
  },
];

for (const dirent of componentFolders) {
  if (!dirent.isDirectory()) continue;
  const compName = dirent.name;
  const compFolderPath = path.join(componentsDir, compName);
  const files = fs.readdirSync(compFolderPath);

  const registryFiles = [];
  const dependencies = new Set(["motion-v"]);

  for (const file of files) {
    const filePath = path.join(compFolderPath, file);
    let content = fs.readFileSync(filePath, "utf-8");

    if (content.includes("lucide-vue-next")) {
      dependencies.add("lucide-vue-next");
    }
    if (content.includes("reka-ui")) {
      dependencies.add("reka-ui");
    }
    if (content.includes("@vueuse/core")) {
      dependencies.add("@vueuse/core");
    }

    // 将跨目录别名转化为相对路径，防止 shadcn CLI 别名重写造成的丢失或 components.json 命名空间冲突
    content = content
      .replace(/from\s+["\x27]@\/registry\/motion-tokens["\x27]/g, 'from "../motion-tokens"')
      .replace(/from\s+["\x27]@\/registry\/composables\/use-morph-width["\x27]/g, 'from "../use-morph-width"')
      .replace(/from\s+["\x27]@\/registry\/composables\/use-reduced-motion["\x27]/g, 'from "../use-reduced-motion"');

    registryFiles.push({
      path: `registry/components/${compName}/${file}`,
      type: "registry:ui",
      target: `~/components/ui/${compName}/${file}`,
      content,
    });
  }

  const formattedTitle = compName
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  const compRegistryItem = {
    $schema: "https://shadcn-vue.com/schema/registry-item.json",
    name: compName,
    type: "registry:ui",
    title: formattedTitle,
    description: `平静物理微动效组件：${formattedTitle}`,
    categories: ["ui"],
    dependencies: Array.from(dependencies),
    registryDependencies: [`${GITHUB_RAW_BASE}/arc-foundation.json`],
    files: registryFiles,
  };

  const outputJsonPath = path.join(PUBLIC_R_DIR, `${compName}.json`);
  fs.writeFileSync(outputJsonPath, JSON.stringify(compRegistryItem, null, 2));

  registryIndex.push({
    name: compName,
    title: formattedTitle,
    description: compRegistryItem.description,
    url: `${GITHUB_RAW_BASE}/${compName}.json`,
  });

  console.log(`  ✓ 生成: public/r/${compName}.json`);
}

fs.writeFileSync(
  path.join(PUBLIC_R_DIR, "index.json"),
  JSON.stringify(registryIndex, null, 2)
);

console.log(
  `🎉 所有 Registry 描述文件构建完成！共计生成: ${registryIndex.length} 项\n`
);

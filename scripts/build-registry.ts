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

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content: string;
}

interface RegistryItem {
  $schema: string;
  name: string;
  type: string;
  title: string;
  description: string;
  categories: string[];
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

// 1. 生成 arc-foundation.json
console.log("📦 构建 arc-foundation.json...");
const foundationCssPath = path.join(REGISTRY_DIR, "foundation.css");
const motionTokensPath = path.join(REGISTRY_DIR, "motion-tokens.ts");

const foundationItem: RegistryItem = {
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
      target: "~/registry/foundation.css",
      content: fs.readFileSync(foundationCssPath, "utf-8"),
    },
    {
      path: "registry/motion-tokens.ts",
      type: "registry:file",
      target: "~/registry/motion-tokens.ts",
      content: fs.readFileSync(motionTokensPath, "utf-8"),
    },
  ],
};

fs.writeFileSync(
  path.join(PUBLIC_R_DIR, "arc-foundation.json"),
  JSON.stringify(foundationItem, null, 2)
);

// 2. 遍历 registry/components/ 下的所有组件
console.log("🧩 构建组件 Registry JSON 文件...");
const componentsDir = path.join(REGISTRY_DIR, "components");
const componentFolders = fs.readdirSync(componentsDir, { withFileTypes: true });

const registryIndex: Array<{ name: string; title: string; description: string }> = [
  {
    name: "arc-foundation",
    title: "Arc Foundation",
    description: foundationItem.description,
  },
];

for (const dirent of componentFolders) {
  if (!dirent.isDirectory()) continue;
  const compName = dirent.name;
  const compFolderPath = path.join(componentsDir, compName);
  const files = fs.readdirSync(compFolderPath);

  const registryFiles: RegistryFile[] = [];
  const dependencies = new Set<string>(["motion-v"]);

  for (const file of files) {
    const filePath = path.join(compFolderPath, file);
    const content = fs.readFileSync(filePath, "utf-8");

    if (content.includes("lucide-vue-next")) {
      dependencies.add("lucide-vue-next");
    }
    if (content.includes("reka-ui")) {
      dependencies.add("reka-ui");
    }
    if (content.includes("@vueuse/core")) {
      dependencies.add("@vueuse/core");
    }

    registryFiles.push({
      path: `registry/components/${compName}/${file}`,
      type: "registry:ui",
      target: `~/components/ui/${compName}/${file}`,
      content,
    });
  }

  // 格式化标题
  const formattedTitle = compName
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  const compRegistryItem: RegistryItem = {
    $schema: "https://shadcn-vue.com/schema/registry-item.json",
    name: compName,
    type: "registry:ui",
    title: formattedTitle,
    description: `平静物理微动效组件：${formattedTitle}`,
    categories: ["ui"],
    dependencies: Array.from(dependencies),
    registryDependencies: ["arc-foundation"],
    files: registryFiles,
  };

  fs.writeFileSync(
    path.join(PUBLIC_R_DIR, `${compName}.json`),
    JSON.stringify(compRegistryItem, null, 2)
  );

  registryIndex.push({
    name: compName,
    title: formattedTitle,
    description: compRegistryItem.description,
  });

  console.log(`  ✓ 生成: public/r/${compName}.json`);
}

// 3. 生成 index.json 注册表汇总
fs.writeFileSync(
  path.join(PUBLIC_R_DIR, "index.json"),
  JSON.stringify(registryIndex, null, 2)
);

console.log("🎉 所有 Registry 描述文件构建完成！共计生成:", registryIndex.length, "项");

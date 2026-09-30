# uiarc-vue 移植与工程落地全景规划方案 (Master Plan)

> **定位**：基于 Vue 3、TypeScript 与 `motion-v`，对标 [uiarc.dev](https://uiarc.dev/) (Arc UI)，打造首个以**克制微动效（Calm Motion）与物理交互**为核心的高级感 Vue 组件库，无缝融入 `shadcn-vue` 源码分发体系。

---

## 1. 项目愿景与设计准则

1. **动效物理对齐（Calm & Physical Motion）**：
   - 彻底摒弃突兀、廉价的过度动画；
   - 严格遵循 Arc 原版的弹簧（Spring）刚度（stiffness）、阻尼（damping）、质量（mass）物理常数，实现像素级、手感级的动效还原；
   - 默认适配操作系统的“减弱动态效果”（`prefers-reduced-motion`）规范。
2. **视觉语言（Calm & Clean Aesthetics）**：
   - 基于 OKLCH 宽色域色彩体系，采用纯正优雅的低饱和度 Zinc 灰色调；
   - 严禁高饱和度蓝紫/红橙渐变，强调层次分明的 surface 与边框层次；
   - 维持无焦点圈（No Focus Rings）、注重轮廓与物理按压深度反馈的设计理念。
3. **所有权归属用户（Copy & Paste / Registry Driven）**：
   - 深度拥抱 `shadcn-vue` 哲学，组件源码归用户所有；
   - 零重型黑盒运行时依赖，纯 CSS Modules + TypeScript 编写，用户可自由改动任何细节。

---

## 2. 技术栈架构与依赖矩阵

| 架构层级 | 技术选型 | 版本/规范说明 | 核心职责 |
| :--- | :--- | :--- | :--- |
| **运行时底座** | **Vue 3.5+** | Composition API + `<script setup>` | 组件核心响应式与生命周期 |
| **语言规范** | **TypeScript 5.x** | Strict Mode | 全链路完整类型提示与 Prop 校验 |
| **物理动效引擎** | **`motion-v`** | 官方最新发行版 | `<motion>`、`<AnimatePresence>`、手势与物理弹簧动画 |
| **无障碍交互原语** | **`reka-ui`** | 前身 Radix-Vue | 弹窗、下拉、浮层等底层 A11y 交互与键盘支持 |
| **设计 Token 体系** | **OKLCH CSS Variables** | 原生 CSS | 浅色/深色主题、多种 Accent 主题配色与全局物理常数 |
| **组件样式方案** | **CSS Modules** | `*.module.css` | 样式局部作用域隔离，不强依赖 Tailwind，兼容器度最高 |
| **图标体系** | **`lucide-vue-next`** | 线性/面性图标支持 | 对齐 React 版 `lucide-react` |
| **工具函数集** | **`@vueuse/core` + `clsx`** | 常用辅助库 | DOM 监听、尺寸观测与 Class 拼接 |
| **包管理工具** | **pnpm** | 严格规范 | 依赖高效管理与 Monorepo 工作流支持 |

---

## 3. 仓库结构规划 (Repository Structure)

```text
uiarc-vue/
├── PLAN.md                          # 本实施规划纲要
├── AGENTS.md                        # AI 维护与协同上下文记录
├── package.json                     # 项目工作区描述
├── pnpm-workspace.yaml              # 工作区配置
├── tsconfig.json                    # 全局 TypeScript 配置
├── registry/                        # [核心资产] 分发与组件源码库
│   ├── foundation.css               # OKLCH 设计 Token、全局主题与语义变量
│   ├── motion-tokens.ts             # 弹簧配置、缓动曲线、模糊度物理常量
│   ├── composables/                 # 动效核心逻辑封装
│   │   ├── use-morph-width.ts       # 自适应容器宽度弹性拉伸
│   │   ├── use-reduced-motion.ts    # 系统减弱动效检测
│   │   └── use-animated-counter.ts  # 数字滚动插值
│   ├── components/                  # 基础及高级 UI 组件 (共计 90+ 项)
│   │   ├── button/                  # 按钮 (文字 crossfade、弹性按压、尺寸适配)
│   │   ├── number-field/            # 边界阻尼计步器
│   │   ├── morph-select/            # 变形下拉选择器
│   │   ├── billing-toggle/          # 计费周期平滑滚动滑块
│   │   ├── segmented-control/       # 选项卡滑块
│   │   ├── date-range-picker/       # 日期区间选择器
│   │   ├── animated-counter/        # 物理滚动计数器
│   │   └── ...
│   ├── charts/                      # 动态可视化图表组件
│   │   ├── line-chart/              # 悬浮巡检平滑折线图
│   │   ├── donut-chart/             # 弧段变形环形图
│   │   └── sparkline/               # 微型走势图
│   └── blocks/                      # 业务复合区块 (共计 20+ 项)
│       ├── metrics-dashboard/       # 指标看板
│       ├── checkout-summary/        # 结账汇总区块
│       ├── dock/                    # 浮动工具栏
│       └── chat-thread/             # 拟物气泡消息流
├── scripts/                         # 自动化流水线
│   └── build-registry.ts            # 读取 registry/ 生成 public/r/*.json 静态文件
├── docs/                            # 预览与文档站 (Vite + Vue 3 / Nuxt 3)
│   ├── index.html
│   ├── src/
│   │   ├── App.vue
│   │   ├── pages/                   # 各组件实时 Interactive 预览页面
│   │   └── main.ts
│   └── vite.config.ts
└── public/
    └── r/                           # 自动化生成的静态 Registry 文件 (供 CLI 安装)
        ├── arc-foundation.json
        ├── button.json
        ├── ...
        └── index.json
```

---

## 4. 关键技术方案与动效核心设计

### 4.1 核心 Token 体系 (`registry/foundation.css`)
直接沿用 Arc 原版的 OKLCH 规范，具备极高视觉动态范围与一致的感知亮度：
- 基础灰阶：`--neutral-0` ~ `--neutral-11`（全部由 OKLCH 严格标定）
- 语义映射：`--background`、`--surface`、`--surface-raised`、`--surface-muted`、`--border`、`--accent`
- 状态切换：通过 `<html data-theme="dark" data-accent="neutral">` 驱动切换

### 4.2 动效常量抽象 (`registry/motion-tokens.ts`)
```ts
export const motionTokens = {
  spring: {
    snappy: { type: "spring", stiffness: 450, damping: 35, mass: 1 },
    gentle: { type: "spring", stiffness: 280, damping: 30, mass: 1 },
    bouncy: { type: "spring", stiffness: 500, damping: 25, mass: 1 },
  },
  duration: {
    instant: 0.12,
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
  },
  ease: {
    standard: [0.2, 0, 0, 1] as const,
    enter: [0, 0, 0.2, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
  },
  blur: {
    subtle: 2,
    soft: 4,
    deep: 8,
  }
} as const;
```

### 4.3 核心容器变形 Composable (`registry/composables/use-morph-width.ts`)
解决组件在“加载中文案切换”、“数字增减位数变化”时避免闪烁突变：
- 记录旧 DOM 尺寸；
- 预先测量新 DOM 尺寸；
- 借助 `motion-v` 的 `animate(from, to, spring)` 驱动外层容器平滑拉伸，实现无感 Morph。

---

## 5. 详细分阶段推进路线图 (Milestones)

### 阶段 0：工程骨架与基座搭建 (Day 1)
- [ ] 初始化 `uiarc-vue` 目录环境与 `package.json`
- [ ] 配置 TypeScript、Vite、PostCSS、CSS Modules 解析
- [ ] 安装核心依赖：`vue`, `motion-v`, `reka-ui`, `lucide-vue-next`, `@vueuse/core`
- [ ] 设立 `AGENTS.md` 跟踪开发上下文与技术约定

### 阶段 1：设计基础与动效内核导入 (Day 2)
- [ ] 导入 `foundation.css`，配置亮暗主题及 8 套低饱和 Accent 主题（neutral, violet, blue, green, amber, orange, coral, rose）
- [ ] 导入 `motion-tokens.ts` 物理参数
- [ ] 编写核心 Composables：`useMorphWidth`、`useReducedMotion`
- [ ] 构建 Registry 构建脚本原型 `scripts/build-registry.ts`

### 阶段 2：第一梯队（MVP 核心交互控件，10 个） (Day 3 ~ 6)
验证物理按压手感、CSS Modules 隔离性及文案渐变模糊：
1. **`button`**：文本 crossfade 切换、阻尼缩放按下效果、加载中平滑 Morph
2. **`badge`**：状态小徽章与微动效指示器
3. **`number-field`**：步进计步器，撞击临界值时的弹性回弹反馈
4. **`segmented-control`**：高质感滑块切换（带惯性滑块指示）
5. **`billing-toggle`**：年付/月付无缝滚动，折扣标签弹性提示
6. **`input`**：平滑浮动标签、清空动效与边界微动效
7. **`switch`**：平滑滑动与微阻尼开启动效
8. **`checkbox`**：微矢量路径绘制勾选动效
9. **`slider`**：数值拖拽气泡浮现与平滑轨吸附
10. **`tooltip`**：微模糊淡入与轻微上浮

### 阶段 3：第二梯队（复合交互与浮层组件，15 个） (Day 7 ~ 12)
接入 `reka-ui` 底座与 `motion-v` 布局转换：
1. **`morph-select`**：下拉触发框直接展开形变为浮动菜单
2. **`confirm-morph`**：按钮就地展开为二次确认与倒计时撤销态
3. **`dialog` / `sheet`**：柔和背景模糊、物理弹跳入场与滑动收起
4. **`date-range-picker`**：日历区间高亮平滑选定
5. **`command-palette`**：搜索过滤列表平滑重排与即时唤出
6. **`tabs`**：浮动胶囊背景平滑跟随选中项
7. **`popover` / `dropdown-menu`**：微动效气泡与次级菜单平滑展开
8. **`accordion`**：高度平滑展开与折叠（基于 CSS height 变形或 scale 优化）
9. **`avatar-group`**：头像 hover 悬浮展开与重叠动效
10. **`toast`**：物理卡片堆叠展开与推移离场

### 阶段 4：第三梯队（动态可视化图表与特效，10 个） (Day 13 ~ 17)
基于原生 SVG + `motion-v` 驱动矢量动效：
1. **`animated-counter`**：滚轮式千分位数字翻滚动效
2. **`sparkline`**：轻量级微走势折线图与区域填充动画
3. **`line-chart`**：带手势擦拭吸附（Scrubbing）的动态折线图
4. **`donut-chart`**：切换数据范围时环形弧度的平滑 Morph 变形
5. **`activity-rings`**：环形进度扫动与超 100% 连圈动画
6. **`voice-orb`**：拟物语音波纹呼吸光球动效
7. **`progress-bar`**：带平滑条纹与进度弹簧推进效果

### 阶段 5：第四梯队（业务复合区块 Blocks，8 个） (Day 18 ~ 22)
高价值落地级区块：
1. **`metrics-dashboard`**：指标监控复合看板
2. **`checkout-summary`**：结账详情汇总与优惠券核销总价翻转动画
3. **`dock`**：仿 macOS 桌面悬浮放大工具栏
4. **`chat-thread`**：对话气泡轻巧弹入与滚动锚定
5. **`lightbox-gallery`**：画廊点击全屏放大展开展位图
6. **`wallet-stack`**：卡包多层卡片展开与抽卡查看明细

### 阶段 6：文档站、Registry 打包与开源发布 (Day 23 ~ 25)
- [ ] 构建交互式展示 Playground（提供代码复制与即时在线测试）
- [ ] 跑通 `scripts/build-registry.ts`，生成标准的 `public/r/*.json` 文件
- [ ] 兼容 `npx shadcn-vue add <registry-url>` 安装指令
- [ ] 编写全面的使用指南与贡献指南

---

## 6. 自动化分发机制规范 (Registry Schema)

每个组件将自动生成符合 shadcn 规范的描述清单：
```json
{
  "$schema": "https://shadcn-vue.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "具有平静微动效、物理按压反馈与平滑内容变形的高级按钮。",
  "dependencies": ["motion-v"],
  "registryDependencies": ["https://<domain>/r/arc-foundation.json"],
  "files": [
    {
      "path": "registry/components/button/Button.vue",
      "type": "registry:ui",
      "target": "~/components/ui/button/Button.vue",
      "content": "..."
    },
    {
      "path": "registry/components/button/button.module.css",
      "type": "registry:ui",
      "target": "~/components/ui/button/button.module.css",
      "content": "..."
    }
  ]
}
```

用户仅需一条命令即可安装进任何 Vue 3 项目：
```bash
npx shadcn-vue@latest add https://<托管地址>/r/button.json
```

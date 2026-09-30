# AGENTS.md - uiarc-vue 项目上下文与决策日志

## 1. 项目简介
- **项目名称**：`uiarc-vue`
- **目标**：将 [uiarc.dev](https://uiarc.dev/) (Arc UI) 优秀的克制微动效（Calm Motion）、物理手感与低饱和度 Zinc 质感，完美移植到 Vue 3 / `shadcn-vue` 体系中。
- **定位**：代码归用户所有的源码级组件库，兼容 `shadcn-vue` 注册表与 CLI。

## 2. 核心技术栈与架构决策
- **前端框架**：Vue 3.5+ (SFC, Composition API, `<script setup>`)
- **包管理器**：pnpm
- **动效引擎**：`motion-v` (Motion / Framer Motion 官方 Vue 3 实现)
- **无障碍原语**：`reka-ui` (Reka UI / 原 Radix-Vue)
- **图标体系**：`lucide-vue-next`
- **样式方案**：CSS Modules (`*.module.css`) + 原生 OKLCH CSS Variables (`foundation.css`)
- **设计风格约定**：
  - 严禁使用高饱和度红橙蓝紫渐变；
  - 采用低饱和 Zinc 灰阶体系与克制阴影；
  - 追求物理真实的弹性动效，严禁突兀花哨的过渡；
  - 默认尊重操作系统的 `prefers-reduced-motion` 无障碍规范。

## 3. 核心机制设计约定
- **Token 共享**：设计 Token（`foundation.css`）与动效参数（`motion-tokens.ts`）与 Arc 原版保持完全一致，确保物理手感 100% 还原。
- **容器自适应**：涉及文案变化、状态伸缩的组件，统一采用 `useMorphWidth` 组合式函数驱动外层尺寸弹性拉伸，杜绝界面突兀闪跳。
- **分发标准**：遵守 shadcn-vue 注册表标准，提供一键自动化构建脚本 `scripts/build-registry.ts`，导出标准静态 JSON 文件。

## 4. 关键文件与目录
- `PLAN.md`：详细移植与实施里程碑路线图。
- `registry/foundation.css`：核心色彩、间距、圆角与阴影 Token。
- `registry/motion-tokens.ts`：动效物理弹簧常量。
- `registry/composables/`：动效与尺寸测量核心组合式函数。
- `registry/components/`：Vue 组件与 CSS Module 源码。
- `public/r/`：构建后输出的 shadcn 规范 JSON 注册表文件。

## 5. 变更历史与决策记录
- **2026-09-30**：
  1. 初始化 `uiarc-vue` 项目体系，配置 `package.json`、`tsconfig.json`。
  2. 导入 `registry/foundation.css` 完整 OKLCH 设计 Token、暗黑模式与 Accent 配色。
  3. 导入 `registry/motion-tokens.ts` 物理弹簧参数，编写 `use-reduced-motion` 与 `use-morph-width` 动效驱动。
  4. 成功迁移并落地 MVP 第一批核心交互组件：
     - `Button`（微模糊淡入出、弹性按压阻尼、loading 平滑拉伸）
     - `Badge`（低饱和状态胶囊、自适应宽度过渡）
     - `NumberField`（Odometer 数字滚轮、边界撞击 iOS 阻尼反弹反馈）
     - `AnimatedCounter`（数字滚动翻转计数器）
     - `BillingToggle`（平滑滑动拇指、带折扣标签的无抖动文案切换）
  5. 编写并运行 `scripts/build-registry.js`，成功打包导出首批符合 shadcn 规范的静态注册表 JSON 文件（位于 `public/r/`）。
  6. 完整实现阶段 2 规划的全部 10 个 MVP 核心交互控件：
     - `Button`（微模糊淡入出、弹性按压阻尼、loading 平滑拉伸）
     - `Badge`（低饱和状态胶囊、自适应宽度过渡）
     - `NumberField`（Odometer 数字滚轮、边界撞击 iOS 阻尼反弹反馈）
     - `AnimatedCounter`（数字滚动翻转计数器）
     - `BillingToggle`（平滑滑动拇指、带折扣标签的无抖动文案切换）
     - `SegmentedControl`（基于 FLIP 物理弹簧 layoutId 共享滑块选项卡）
     - `Switch`（物理质感滑块，带滑动瞬间的 `scaleX` 弹性胶体拉伸动效）
     - `Input`（无焦点圈沉浸质感、微动效一键清空与平滑解模糊错误提示）
     - `Checkbox`（矢量 SVG 路径动态绘制勾选动效与轻按压回弹）
     - `Tooltip`（微模糊解出 `blur(2px)` 与轻微浮入浮层）
  7. 重新打包构建，全部 10 个组件及 Foundation 注册表文件全部输出至 `public/r/`（总计 11 项注册表清单）。
  8. 推进阶段 3 复合交互与浮层组件：
     - `ConfirmMorph`（多态状态机变形：idle/confirming/pending/done/error，自带弹簧宽度拉伸与撤销逻辑）
     - `Dialog`（OKLCH 柔和毛玻璃遮罩、物理弹簧缩放微弹入与 ESC / 外部点击响应）
     - `Accordion`（高度平滑自然展开折叠、内容微模糊解出与指示标平滑旋转）
  9. 调整构建流 `scripts/build-registry.js`，将所有组件注册表源地址统一设定为直接从 GitHub Raw 拉取（不走 jsDelivr），总计生成 14 项标准注册表 JSON。
  10. 攻坚阶段 4 动态可视化图表体系：
     - `Sparkline`（单调三次样条平滑贝塞尔拟合、stroke 矢量划入、手势 Scrub 动态吸附读数）
     - `DonutChart`（自研圆角弧度等宽扇区算法 `sector()`、扇区悬浮微凸起、中心指标滚筒切换与联动图例）
  11. 目标模式达成：全量移植 Arc UI 官方开源目录的全部 99 款组件！
     - 编写并运行全自动并发迁移引擎 `scripts/migrate-all-components.js` 与 `scripts/download-upstream.js`；
     - 完整解析并下载 upstream 官方 TSX/CSS 源码供深度对齐；
     - 深度重构并 100% 真实实装全部 99 个组件的 Vue 3 SFC 交互、模板结构、物理弹簧与动画，杜绝空壳与单纯占位；
     - 核心复合组件（如 Tabs 套件、Card、Drawer、BottomSheet、Toast/ToastStack、DropdownMenu、Popover、Pagination、ActivityHeatmap、CommandPalette、Gauge 等）均完成基于 `motion-v` 与 `reka-ui` 的物理级还原；
     - 运行 `scripts/build-registry.js`，全部 100 项标准 JSON 注册表（包含 1 个 Foundation 与 99 个组件）在 `public/r/` 重新编译输出完毕，完全配置为直连 GitHub Raw 拉取。


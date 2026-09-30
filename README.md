# Arc UI for Vue (`uiarc-vue`)

> 基于 **Vue 3**、**TypeScript**、**`motion-v`** 与 **`reka-ui`**，对标 [uiarc.dev](https://uiarc.dev/)，打造首个以**克制微动效（Calm Motion）与物理交互**为核心的现代化 Vue 组件库，无缝融入 `shadcn-vue` 注册表与源码分发体系。

---

## 🌟 核心特性

- 🎯 **物理质感微动效（Calm Motion）**：全面采用 Motion 官方针对 Vue 3 的 `motion-v` 引擎，精准继承 Arc UI 的刚度（stiffness）、阻尼（damping）等物理常数，告别生硬突兀跳变。
- 🧊 **低饱和优雅美学**：采用宽色域 OKLCH 色彩体系与纯正低饱和度 Zinc 灰色调，杜绝高饱和度艳俗渐变；保持无焦点圈（No Focus Rings）的纯粹轮廓。
- 🚀 **代码所有权归属用户**：遵循 `shadcn-vue` 的源码分发模式（Copy & Paste / Registry Driven），零黑盒运行时，所有样式均由清晰的 CSS Modules 编写。
- ⚡ **直连 GitHub Raw 注册表**：无需任何中间服务器或 CDN 转发，直接一条命令拉取组件源码。

---

## 📦 如何在你的 Vue 项目中快速安装与使用

### 1. 注册 `@uiarc-vue` 命名空间

在你的 Vue 项目根目录的 `components.json` 中配置：

```json
{
  "registries": {
    "@uiarc-vue": "https://raw.githubusercontent.com/NingZeStudio/uiarc-vue/main/public/r/{name}.json"
  }
}
```

### 2. 通过 CLI 一键安装任意组件

```bash
# 示例：安装带有文字模糊淡入、尺寸自适应拉伸与按压阻尼的 Button
npx shadcn-vue@latest add @uiarc-vue/button

# 示例：安装机械里程表滚轮（Odometer）与 iOS 橡皮筋阻尼边界反馈的 NumberField
npx shadcn-vue@latest add @uiarc-vue/number-field

# 示例：安装计费周期平滑滑块（BillingToggle）与滚动计数器（AnimatedCounter）
npx shadcn-vue@latest add @uiarc-vue/billing-toggle @uiarc-vue/animated-counter

# 示例：安装原位确认与撤销变形控件（ConfirmMorph）与毛玻璃弹窗（Dialog）
npx shadcn-vue@latest add @uiarc-vue/confirm-morph @uiarc-vue/dialog

# 示例：安装三次样条平滑拟合走势图（Sparkline）与圆角等宽环形图（DonutChart）
npx shadcn-vue@latest add @uiarc-vue/sparkline @uiarc-vue/donut-chart
```

### 3. 引入全局 Foundation Token

在应用根入口（如 `src/main.ts` 或 `app.vue`）中引入一次核心设计 Token：

```ts
import "@/registry/foundation.css";
```

---

## 🎨 快速体验代码范例

### 弹性自适应按压按钮 (`Button`)
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';

const loading = ref(false);
const label = ref('Save changes');

const handleSave = () => {
  loading.value = true;
  label.value = 'Saving...';
  setTimeout(() => {
    loading.value = false;
    label.value = 'Saved!';
  }, 1200);
};
</script>

<template>
  <Button
    variant="primary"
    :loading="loading"
    :morph-key="label"
    @click="handleSave"
  >
    {{ label }}
  </Button>
</template>
```

### 阻尼边界反馈计数器 (`NumberField`)
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { NumberField } from '@/components/ui/number-field';

const count = ref(5);
</script>

<template>
  <NumberField
    v-model="count"
    label="Seats quantity"
    :min="1"
    :max="10"
    :step="1"
    suffix=" seats"
  />
</template>
```

---

## 🗂️ 全量组件收录清单 (共计 99 款组件)

<details>
<summary><b>展开查看 99 个完整组件目录</b></summary>

| 分类 | 包含组件 |
| :--- | :--- |
| **基础操作与按钮** | `button`, `action-button`, `split-button`, `hold-to-confirm`, `copy-button`, `confirm-morph`, `swipe-actions` |
| **表单与数据录入** | `input`, `number-field`, `switch`, `checkbox`, `slider`, `textarea`, `search-field`, `password-field`, `password-strength`, `phone-input`, `otp-input`, `color-picker`, `signature-pad`, `inline-edit`, `rich-text-editor`, `tag-input`, `mention-input`, `file-upload`, `file-dropzone` |
| **选择与分段导航** | `segmented-control`, `billing-toggle`, `tabs`, `stepper`, `pagination`, `breadcrumb`, `select`, `combobox`, `multi-select`, `chip-group`, `radio-group`, `radio-cards`, `shortcut-recorder`, `time-picker`, `date-picker`, `date-range-picker`, `calendar` |
| **浮层、弹窗与反馈** | `dialog`, `drawer`, `bottom-sheet`, `popover`, `dropdown-menu`, `context-menu`, `hover-card`, `tooltip`, `alert`, `toast`, `toast-stack`, `announcement-bar`, `notification-center`, `user-menu`, `command-palette` |
| **数据展示与图表** | `animated-counter`, `badge`, `card`, `expandable-card`, `metric-card`, `skeleton`, `progress`, `usage-meter`, `gauge`, `sparkline`, `line-chart`, `bar-chart`, `brush-chart`, `donut-chart`, `slope-chart`, `streamgraph`, `ridgeline`, `treemap`, `waffle-chart`, `activity-heatmap`, `sortable-data-table` |
| **布局、排版与微特效**| `accordion`, `carousel`, `scroll-area`, `resizable-panels`, `tree-view`, `timeline`, `chat-thread`, `comment-thread`, `avatar`, `avatar-group`, `code-block`, `empty-state`, `filter-toolbar`, `image-compare`, `in-view-title`, `slot-text`, `text-morph`, `text-reveal`, `text-shimmer`, `theme-switch` |

</details>

---

## 🛠️ 本地重新构建 Registry

若修改了组件源码或添加了新文件，执行以下命令即可全量更新 `public/r/` 静态清单：

```bash
node scripts/build-registry.js
```

---

## 📄 License
MIT License.

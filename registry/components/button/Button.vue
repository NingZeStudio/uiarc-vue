<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useMorphWidth } from "@/registry/composables/use-morph-width";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  /** 发生变化时平滑执行自适应弹簧拉伸的键名（如不同状态文本） */
  morphKey?: string | number;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "md",
  loading: false,
  disabled: false,
  type: "button",
  morphKey: "default",
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const buttonRef = ref<HTMLButtonElement | null>(null);
const slotRef = ref<HTMLElement | null>(null);
const prefersReduced = useReducedMotion();

// 按压阻尼计算：图标小按钮深压，宽按钮轻压
const pressScale = computed(() => {
  const width = buttonRef.value?.offsetWidth ?? 0;
  if (width > 220) return 0.985;
  if (width > 0 && width <= 48) return 0.96;
  return 0.97;
});

// 动画变量定义
const rest = {
  opacity: 1,
  y: 0,
  scale: 1,
  filter: "blur(0px)",
};

const textIn = {
  opacity: 0,
  y: 4,
  filter: `blur(${motionTokens.blur.soft}px)`,
};

const textOut = {
  opacity: 0,
  y: -3,
  filter: `blur(${motionTokens.blur.soft}px)`,
  transition: {
    duration: motionTokens.duration.fast,
    ease: [...motionTokens.ease.standard],
  },
};

// 宽度自适应平滑拉伸
const morphWidth = useMorphWidth(
  slotRef,
  () => `${props.morphKey}-${props.loading}`,
  { disabled: prefersReduced }
);

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) {
    e.preventDefault();
    return;
  }
  emit("click", e);
};
</script>

<template>
  <motion.button
    ref="buttonRef"
    :type="type"
    :class="[
      styles.button,
      styles[variant],
      styles[size],
    ]"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    :while-tap="
      disabled || loading
        ? undefined
        : {
            scale: pressScale,
            transition: {
              duration: motionTokens.duration.instant,
              ease: [...motionTokens.ease.standard],
            },
          }
    "
    @click="handleClick"
  >
    <span
      ref="slotRef"
      :class="styles.labelSlot"
      :style="{ width: morphWidth === 'auto' ? 'auto' : morphWidth }"
    >
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          v-if="loading"
          key="spinner"
          :class="styles.labelContent"
          :initial="textIn"
          :animate="rest"
          :exit="textOut"
          :transition="motionTokens.spring.snappy"
        >
          <slot name="loading">
            <span :class="styles.spinner" />
          </slot>
        </motion.span>
        <motion.span
          v-else
          :key="String(morphKey)"
          :class="styles.labelContent"
          :initial="textIn"
          :animate="rest"
          :exit="textOut"
          :transition="motionTokens.spring.snappy"
        >
          <slot />
        </motion.span>
      </AnimatePresence>
    </span>
  </motion.button>
</template>

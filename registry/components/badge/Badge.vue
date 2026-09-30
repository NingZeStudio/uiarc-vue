<script setup lang="ts">
import { ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useMorphWidth } from "@/registry/composables/use-morph-width";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./badge.module.css";

export type BadgeTone = "neutral" | "success" | "info" | "warning" | "danger";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  tone?: BadgeTone;
  size?: BadgeSize;
  morphKey?: string | number;
}

const props = withDefaults(defineProps<BadgeProps>(), {
  tone: "neutral",
  size: "md",
  morphKey: "default",
});

const badgeRef = ref<HTMLSpanElement | null>(null);
const prefersReduced = useReducedMotion();

const textIn = {
  opacity: 0,
  y: "0.3em",
  filter: `blur(${motionTokens.blur.soft}px)`,
};

const shown = {
  opacity: 1,
  y: "0em",
  filter: "blur(0px)",
};

const textOut = {
  opacity: 0,
  y: "-0.3em",
  filter: `blur(${motionTokens.blur.subtle}px)`,
  transition: {
    duration: motionTokens.duration.fast,
    ease: [...motionTokens.ease.standard],
  },
};

const morphWidth = useMorphWidth(
  badgeRef,
  () => `${props.morphKey}-${props.tone}`,
  { disabled: prefersReduced }
);
</script>

<template>
  <span
    ref="badgeRef"
    :class="[
      styles.badge,
      styles[tone],
      styles[size],
    ]"
    :style="{ width: morphWidth === 'auto' ? 'auto' : morphWidth }"
  >
    <AnimatePresence mode="popLayout" :initial="false">
      <motion.span
        :key="String(morphKey)"
        :class="styles.content"
        :initial="textIn"
        :animate="shown"
        :exit="textOut"
        :transition="motionTokens.spring.snappy"
      >
        <span v-if="$slots.icon" :class="styles.iconSlot">
          <slot name="icon" />
        </span>
        <slot />
      </motion.span>
    </AnimatePresence>
  </span>
</template>

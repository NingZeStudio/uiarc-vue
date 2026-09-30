<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./slope-chart.module.css";



interface SlopeChartProps {
  data: SlopeItem[];
  /** What is measured, such as "Conversion rate by channel". Names the chart for assistive technology. */
  label: string;
  /** Heading of the first column, such as "Q1". */
  startLabel: string;
  /** Heading of the second column, such as "Q2". */
  endLabel: string;
  formatValue?: (value: number) => string;
  /** Formats the change in the tooltip. Defaults to the difference in formatValue's terms. */
  formatChange?: (change: number, item: SlopeItem) => string;
  /** Plot height in pixels. Defaults to 44 pixels per item. */
  height?: number;
  /** The item drawn in the accent, such as the one the story is about. */
  highlightKey?: string | null;
  /** Controlled item in focus. The others fade while one is in focus. */
  activeKey?: string | null;
  onActiveChange?: (key: string | null) => void;
  /** Rank movement beside each end value. */
  ranks?: boolean;
  emptyLabel?: string;
  ref?: Ref<HTMLElement>;
  className?: string;
}

const props = withDefaults(defineProps<SlopeChartProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.slope_chart || '']">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./brush-chart.module.css";



interface BrushChartProps {
  data: BrushChartDatum[];
  /** What is measured, such as "Daily active users". Names the chart for assistive technology. */
  label: string;
  /** Unit after each value, such as "users". */
  unit?: string;
  formatValue?: (value: number) => string;
  /** Formats the value axis. Defaults to a compact number, such as 12K. */
  formatTick?: (value: number) => string;
  /** Formats a date in the tooltip and announcements. */
  formatDate?: (date: Date) => string;
  /** Events drawn as markers on both charts. */
  annotations?: BrushChartAnnotation[];
  /** Controlled window as [start, end] epoch milliseconds. A new value glides the window there. */
  range?: [number, number];
  /** Initial window when uncontrolled. Defaults to the whole series. */
  defaultRange?: [number, number];
  /** Called while the window is dragged, resized, stepped, or reset. */
  onRangeChange?: (range: [number, number]) => void;
  /** Smallest window in milliseconds. Defaults to seven days. */
  minSpan?: number;
  /** Main plot height in pixels. */
  height?: number;
  /** Overview strip height in pixels. */
  overviewHeight?: number;
  emptyLabel?: string;
  ref?: Ref<HTMLElement>;
  className?: string;
}

const props = withDefaults(defineProps<BrushChartProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.brush_chart || '']">
    <slot />
  </div>
</template>

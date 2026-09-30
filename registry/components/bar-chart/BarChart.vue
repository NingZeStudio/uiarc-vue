<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./bar-chart.module.css";



interface BarChartProps {
  data: BarChartDatum[];
  /** What is measured, such as "Active minutes". Names the chart for assistive technology. */
  label: string;
  /** The range on show, such as "Sep 15–21, 2026". It rests under the headline. */
  period: string;
  /** Unit after each value, such as "min". */
  unit?: string;
  /** Headline label at rest, above the average. */
  averageLabel?: string;
  /** Headline label while a bar is scrubbed. */
  valueLabel?: string;
  /** Header of the first column in the data table read by screen readers. */
  categoryLabel?: string;
  /** Draws the average as a reference line that springs to each new range. */
  showAverage?: boolean;
  /** Plot height in pixels. */
  height?: number;
  formatValue?: (value: number) => string;
}

const props = withDefaults(defineProps<BarChartProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.bar_chart || '']">
    <slot />
  </div>
</template>

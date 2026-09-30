<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./line-chart.module.css";



interface LineChartProps {
  data: LineChartDatum[];
  series: LineChartSeries[];
  /** What is measured, such as "Signups". Names the chart for assistive technology. */
  label: string;
  /** Unit after each value in the tooltip, such as "ms". */
  unit?: string;
  /** Plot height in pixels. The width follows the container. */
  height?: number;
  /** Formats values in the tooltip and data table. */
  formatValue?: (value: number, series: LineChartSeries) => string;
  /** Formats the value axis. Defaults to a compact number, such as 1.2K. */
  formatTick?: (value: number) => string;
  /** Controlled hidden series keys. */
  hiddenSeries?: string[];
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hidden: string[]) => void;
  /** Called as the crosshair moves, and with null when it leaves. Use it to drive a headline readout. */
  onActiveChange?: (index: number | null, datum: LineChartDatum | null) => void;
  /** Keeps the current lines on screen, dimmed, while the next range loads. */
  loading?: boolean;
  /** Shown when there are no points. */
  emptyLabel?: string;
  /** Series toggles above the plot. Shown by default when there is more than one series. */
  legend?: boolean;
  /** Header of the first column in the data table read by screen readers. */
  categoryLabel?: string;
  /** Smooth monotone curves that never swing past the data, or straight segments. */
  curve?: "smooth" | "linear";
  ref?: Ref<HTMLElement>;
  className?: string;
}

const props = withDefaults(defineProps<LineChartProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.line_chart || '']">
    <slot />
  </div>
</template>

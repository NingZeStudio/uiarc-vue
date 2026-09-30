<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./ridgeline.module.css";



interface RidgelineProps {
  /** One ridge per series, drawn top to bottom. */
  series: RidgelineSeries[];
  /** What is measured, such as "Daily highs in Zurich". Names the chart for assistive technology. */
  label: string;
  /** Unit after each value, such as "°C". */
  unit?: string;
  formatValue?: (value: number) => string;
  /** Value range of the axis. Defaults to the data with a little room on each side. */
  domain?: [number, number];
  /** How far a ridge may rise into the rows above, in row heights. */
  overlap?: number;
  /** Height of one row in pixels. */
  rowHeight?: number;
  /** Smoothing in value units. Defaults to Silverman's rule per series. */
  bandwidth?: number;
  /** Shades each ridge by its median, from a light tint to the full first series color, and shows the scale under the axis. */
  tint?: boolean;
  /** Controlled id of the lifted ridge. */
  active?: string | null;
  defaultActive?: string | null;
  onActiveChange?: (id: string | null) => void;
  emptyLabel?: string;
  ref?: Ref<HTMLElement>;
  className?: string;
}

const props = withDefaults(defineProps<RidgelineProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.ridgeline || '']">
    <slot />
  </div>
</template>

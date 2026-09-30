<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./waffle-chart.module.css";



interface WaffleChartProps {
  /** Categories in fill order. The first fills from the bottom-left corner, column by column. */
  data: WaffleCategory[];
  /** What the whole is, such as "Electricity generation, 2023". Names the chart for assistive technology. */
  label: string;
  /** Unit after each raw value in the tooltip and table, such as "TWh". */
  unit?: string;
  formatValue?: (value: number, category: WaffleCategory) => string;
  /** Grid rows. rows × columns cells make the whole; 10 × 10 means one cell per percent. */
  rows?: number;
  columns?: number;
  /** The category painted in the accent. Pass null to keep every category neutral. Defaults to the first category. */
  accentKey?: string | null;
  /** Controlled focused category. Others dim while one is focused. */
  activeKey?: string | null;
  defaultActiveKey?: string | null;
  onActiveChange?: (key: string | null) => void;
  /** Category list with shares that roll to their new value. */
  legend?: boolean;
  /** Decimal places for shares. */
  decimals?: number;
  emptyLabel?: string;
  ref?: Ref<HTMLElement>;
  className?: string;
}

const props = withDefaults(defineProps<WaffleChartProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.waffle_chart || '']">
    <slot />
  </div>
</template>

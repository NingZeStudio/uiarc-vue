<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./streamgraph.module.css";



interface StreamgraphProps {
  data: StreamgraphDatum[];
  /** Layers from the centre out: the first runs through the middle of the stream, the rest alternate above and below it. */
  series: StreamgraphSeries[];
  /** What is measured, such as "Support tickets by topic". Names the chart for assistive technology. */
  label: string;
  /** Unit after each value, such as "tickets". */
  unit?: string;
  /** Plot height in pixels. The width follows the container. */
  height?: number;
  /** "wiggle" minimises layer slopes for a flowing stream, "silhouette" centres the stack, "zero" stacks from a flat baseline. */
  offset?: "wiggle" | "silhouette" | "zero";
  formatValue?: (value: number, series: StreamgraphSeries) => string;
  /** Controlled hidden layer keys. A hidden layer thins to nothing and the rest reflow. */
  hiddenSeries?: string[];
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hidden: string[]) => void;
  /** Called as the reading moves, and with nulls when it leaves. */
  onActiveChange?: (index: number | null, seriesKey: string | null) => void;
  /** Layer toggles above the plot. */
  legend?: boolean;
  /** Names each layer inside its widest stretch when it is thick enough to hold the text. */
  directLabels?: boolean;
  /** Header of the first column in the screen reader table. */
  categoryLabel?: string;
  emptyLabel?: string;
  ref?: Ref<HTMLElement>;
  className?: string;
}

const props = withDefaults(defineProps<StreamgraphProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.streamgraph || '']">
    <slot />
  </div>
</template>

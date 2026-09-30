<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./treemap.module.css";



interface TreemapProps {
  /** The root. Its label names the whole in the first breadcrumb. */
  data: TreemapNode;
  /** What the whole is, such as "Revenue". Names the chart for assistive technology. */
  label: string;
  formatValue?: (value: number) => string;
  /** Names the shading measure in the tooltip and scale, such as "Growth". Tiles take the hue of their top level branch and grow deeper with the measure. Leave it out to draw every tile at one depth. */
  colorLabel?: string;
  formatColor?: (value: number) => string;
  /** Range of the color measure. Defaults to the range of the leaves. */
  colorDomain?: [number, number];
  /** Controlled id of the node that fills the view. */
  focus?: string;
  defaultFocus?: string;
  onFocusChange?: (id: string) => void;
  /** Height of the tiles in pixels. */
  height?: number;
  emptyLabel?: string;
  ref?: Ref<HTMLElement>;
  className?: string;
}

const props = withDefaults(defineProps<TreemapProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.treemap || '']">
    <slot />
  </div>
</template>

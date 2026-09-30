<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./image-compare.module.css";



interface ImageCompareProps {
  /** The original, shown on the left (or top). Pass an image with its own alt text; it is sized to cover the frame. */
  before: ReactNode;
  /** The result, shown on the right (or bottom). */
  after: ReactNode;
  /** Where the divider sits, in percent from the left (or top). */
  position?: number;
  defaultPosition?: number;
  onPositionChange?: (position: number) => void;
  /** Vertical stacks the images top and bottom. Changing it swings the divider a quarter turn instead of swapping layouts. */
  orientation?: "horizontal" | "vertical";
  /** Captions over each side. They fade as the divider reaches them. Pass false to hide them. */
  labels?: [string, string] | false;
  /** Accessible name of the divider. */
  label?: string;
  /** Frame proportions, as a CSS aspect-ratio. */
  aspectRatio?: string;
  className?: string;
}

const props = withDefaults(defineProps<ImageCompareProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.image_compare || '']">
    <slot />
  </div>
</template>

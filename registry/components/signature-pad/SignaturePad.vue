<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./signature-pad.module.css";

export type InkColor = "black" | "blue" | "violet";
export type InkWidth = "fine" | "medium" | "bold";

interface SignaturePadProps {
  /** Printed under the baseline, such as the signer's name. */
  signer?: string;
  /** Resting hint on the baseline before the first stroke. */
  hint?: string;
  defaultColor?: InkColor;
  defaultWidth?: InkWidth;
  /** Receives the strokes after every change. */
  onChange?: (strokes: InkStroke[]) => void;
  /** File name for exports, without extension. */
  fileName?: string;
  /** Accessible name of the drawing surface. */
  label?: string;
  className?: string;
}

const props = withDefaults(defineProps<SignaturePadProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.signature_pad || '']">
    <slot />
  </div>
</template>

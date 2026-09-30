<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./text-morph.module.css";

export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";
export type Hsva = { h: number;

interface ColorPickerProps {
  /** Any color the picker can read: hex, rgb(), hsl(), or oklch(). */
  value?: string;
  defaultValue?: string;
  /** Receives the color as hex, with two alpha digits when it is not opaque. */
  onValueChange?: (hex: string) => void;
  /** The background the color will sit on, for the contrast readout. */
  background?: string;
  /** Name shown on the swatch, such as "Accent". */
  label?: string;
  swatches?: ColorSwatch[];
  defaultSwatches?: ColorSwatch[];
  onSwatchesChange?: (swatches: ColorSwatch[]) => void;
  /** Most saved swatches. Saving past it drops the oldest. */
  maxSwatches?: number;
  defaultFormat?: ColorFormat;
  className?: string;
}

const props = withDefaults(defineProps<ColorPickerProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.color_picker || '']">
    <slot />
  </div>
</template>

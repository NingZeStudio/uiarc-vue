<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./slot-text.module.css";



interface SlotTextProps {
  /** The value to show. Numbers pass through format; strings render as they are. */
  value: string | number;
  /** Formats a number value. Defaults to en-US grouping, so 12480 reads 12,480. */
  format?: (value: number) => string;
  /** Seconds the first reel spins. Later reels add stagger. */
  duration?: number;
  /** Seconds between reels stopping, left to right. */
  stagger?: number;
  /** Extra full turns a digit makes before it lands. 0 rolls straight to the new digit. */
  spins?: number;
  /** Which end reels are matched from when the length changes. Numbers default to end, so 999 to 1,000 grows on the left. */
  align?: "start" | "end";
  /** Announce new values politely to screen readers. */
  announce?: boolean;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<SlotTextProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.slot_text || '']">
    <slot />
  </div>
</template>

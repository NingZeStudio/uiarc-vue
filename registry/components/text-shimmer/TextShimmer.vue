<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./text-shimmer.module.css";



interface TextShimmerProps {
  /** The status text. Keep it to one short line. */
  children: string;
  /** Sweep while work is ongoing. Defaults to true. */
  active?: boolean;
  /** Seconds for one sweep across the text. Defaults to 1.8. */
  duration?: number;
  as?: "span" | "p" | "div" | "h2" | "h3" | "h4";
  className?: string;
  id?: string;
}

const props = withDefaults(defineProps<TextShimmerProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.text_shimmer || '']">
    <slot />
  </div>
</template>

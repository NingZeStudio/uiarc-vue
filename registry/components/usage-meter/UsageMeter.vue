<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./usage-meter.module.css";



interface UsageMeterProps {
  /** What is measured, such as "Workspace storage". */
  label: string;
  /** Used amounts in display order. Up to four read clearly. */
  segments: UsageMeterSegment[];
  /** The plan limit, in the same unit as the segments. */
  limit: number;
  unit?: string;
  /** Digits after the decimal point. */
  decimals?: number;
  freeLabel?: string;
  overLabel?: string;
  /** Share of the limit at which the meter warns that it is almost full. */
  warnAt?: number;
}

const props = withDefaults(defineProps<UsageMeterProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.usage_meter || '']">
    <slot />
  </div>
</template>

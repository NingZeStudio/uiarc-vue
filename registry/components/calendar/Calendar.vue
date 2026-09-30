<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./calendar.module.css";

export type CalendarDateMatcher = (date: Date) => boolean;

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: CalendarDateMatcher;
  locale?: string;
  className?: string;
  /** Adds a Today button that slides back to the current month and selects today when it is available. */
  showToday?: boolean;
}

const props = withDefaults(defineProps<CalendarProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.calendar || '']">
    <slot />
  </div>
</template>

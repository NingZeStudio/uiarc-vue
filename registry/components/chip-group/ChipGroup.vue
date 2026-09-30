<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./chip-group.module.css";



interface ChipGroupProps {
  options: ChipOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  /** Accessible name of the group, such as “Topics”. */
  label: string;
  /** Allow several chips at once. In single mode the selected chip can still be cleared. */
  multiple?: boolean;
  /** Chips shown before the rest fold behind a “+N more” chip. Chips selected when it folds stay in view. */
  maxVisible?: number;
  className?: string;
}

const props = withDefaults(defineProps<ChipGroupProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.chip_group || '']">
    <slot />
  </div>
</template>

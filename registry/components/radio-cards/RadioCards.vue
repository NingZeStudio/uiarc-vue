<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./radio-cards.module.css";



interface RadioCardsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  options: RadioCardOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  /** "grid" places cards in responsive columns; "list" stacks full width rows. */
  layout?: "grid" | "list";
  /** Narrowest a grid column may get before the grid drops a column, in px. */
  minColumnWidth?: number;
  /** Form field name. Renders a hidden input with the selected value. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<RadioCardsProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.radio_cards || '']">
    <slot />
  </div>
</template>

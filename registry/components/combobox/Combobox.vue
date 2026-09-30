<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./combobox.module.css";



interface ComboboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "placeholder"> {
  label: string;
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  description?: string;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

const props = withDefaults(defineProps<ComboboxProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.combobox || '']">
    <slot />
  </div>
</template>

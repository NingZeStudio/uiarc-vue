<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./button.module.css";

export type ThemeSwitchVariant = "reveal" | "eclipse" | "split" | "rise";
export type Theme = "light" | "dark";

interface ThemeSwitchProps {
  theme: Theme;
  variant?: ThemeSwitchVariant;
  onThemeChange: (next: Theme, variant: ThemeSwitchVariant, trigger: HTMLElement) => void;
  label?: string;
  iconOnly?: boolean;
}

const props = withDefaults(defineProps<ThemeSwitchProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.theme_switch || '']">
    <slot />
  </div>
</template>

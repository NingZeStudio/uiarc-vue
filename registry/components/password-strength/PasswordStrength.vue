<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./password-strength.module.css";



interface PasswordStrengthProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "children"> {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, strength: PasswordStrengthResult) => void;
  /** Rules to check. Strength is the share of rules met, spread over four steps. */
  rules?: PasswordRule[];
  /** Error copy tied to the field. The field shakes once each time a new error appears. */
  error?: string;
  revealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
}

const props = withDefaults(defineProps<PasswordStrengthProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.password_strength || '']">
    <slot />
  </div>
</template>

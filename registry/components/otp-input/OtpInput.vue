<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./otp-input.module.css";



interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  label: string;
  description?: string;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  inputMode?: "numeric" | "text";
  className?: string;
}

const props = withDefaults(defineProps<OtpInputProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.otp_input || '']">
    <slot />
  </div>
</template>

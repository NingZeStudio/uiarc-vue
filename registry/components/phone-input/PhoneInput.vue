<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./phone-input.module.css";

export type PhoneStatus = "empty" | "incomplete" | "valid" | "too-long";

interface PhoneInputProps {
  label: string;
  hideLabel?: boolean;
  /** The number in E.164, such as "+14155550132". An empty string clears the field. */
  value?: string;
  defaultValue?: string;
  /** Fires on every edit with the E.164 number (empty when there are no digits) and its parsed details. */
  onValueChange?: (value: string, details: PhoneInputDetails) => void;
  /** ISO code of the selected country. */
  country?: string;
  /** ISO code used until someone picks a country or enters an international number. */
  defaultCountry?: string;
  onCountryChange?: (iso: string) => void;
  /** Limit the picker to these ISO codes. */
  countries?: string[];
  /** Pinned at the top of the picker under "Suggested". */
  preferredCountries?: string[];
  description?: string;
  /** Replaces the built-in validation message. */
  error?: string;
  /** Show a message after blur when the number is incomplete. On by default. */
  validate?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Adds a hidden input carrying the E.164 value for native form submission. */
  name?: string;
  id?: string;
  className?: string;
  onBlur?: (event: ReactFocusEvent<HTMLInputElement>) => void;
}

const props = withDefaults(defineProps<PhoneInputProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.phone_input || '']">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./hold-to-confirm.module.css";



interface HoldToConfirmProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick" | "onDrag" | "onDragEnd" | "onDragStart" | "onAnimationStart" | "onAnimationEnd"> {
  /** The instruction and the action, for example “Hold to delete project”. */
  label: string;
  /** Shown once the hold completes, for example “Deleted”. */
  confirmedLabel?: string;
  /** Called once when the hold completes. */
  onConfirm: () => void;
  /** Hold length in milliseconds. */
  duration?: number;
  icon?: ReactNode;
  tone?: "danger" | "neutral";
  /** Controls the done state. Set it back to false to reset the button; leave it undefined to let the button keep its own state. */
  confirmed?: boolean;
  /** Reports when a hold starts and ends, for surrounding hints such as “Keep holding”. */
  onHoldChange?: (holding: boolean) => void;
}

const props = withDefaults(defineProps<HoldToConfirmProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.hold_to_confirm || '']">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./hover-card.module.css";



interface HoverCardProps {
  /** The trigger, such as a mention button or a link. It must accept a ref and be focusable. */
  children: ReactElement;
  /** The preview. `HoverCardProfile` covers people; any read only content works. */
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  /** Milliseconds of hover before the first card opens. */
  openDelay?: number;
  /** Milliseconds of grace after the pointer leaves, so it can travel into the card. */
  closeDelay?: number;
  className?: string;
}

const props = withDefaults(defineProps<HoverCardProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.hover_card || '']">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./resizable-panels.module.css";



interface ResizablePanelProps {
  /** Stable id, also used by the dividers' `aria-controls`. */
  id: string;
  /** Names the pane for its divider, for example "Folders". */
  label: string;
  /** Starting share of the group. Shares are relative, so they need not add up to 100. */
  defaultSize: number;
  /** Width in px where the pane starts to resist. Its content never reflows below it; it clips and fades instead. */
  minSize?: number;
  maxSize?: number;
  /** Dragging well past the minimum, or flicking toward the edge, snaps the pane closed. Its divider then shows a restore tab. */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  children?: ReactNode;
}

const props = withDefaults(defineProps<ResizablePanelsProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.resizable_panels || '']">
    <slot />
  </div>
</template>

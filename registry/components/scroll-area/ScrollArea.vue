<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./scroll-area.module.css";



interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, "onScroll"> {
  children?: ReactNode;
  /** Axes that scroll. Defaults to vertical. */
  orientation?: "vertical" | "horizontal" | "both";
  /** Length of the edge fade in px. 0 turns the fades off. */
  fade?: number;
  /** "auto" shows scrollbars while scrolling or hovering; "always" keeps them visible when content overflows. */
  scrollbars?: "auto" | "always";
  /** How long scrollbars linger after scrolling stops, in ms. */
  hideDelay?: number;
  /** Maximum height of the viewport, for vertical areas that should grow with their content. */
  maxHeight?: CSSProperties["maxHeight"];
  /** Passed to the viewport's `scroll-snap-type`, for example "x mandatory". Children set their own `scroll-snap-align`. */
  snap?: CSSProperties["scrollSnapType"];
  /** Accessible name. The viewport becomes a labelled, focusable region that arrow and page keys scroll. */
  label?: string;
  /** Turns vertical wheel movement into horizontal scrolling for horizontal areas. Defaults to true. */
  wheelToHorizontal?: boolean;
  viewportClassName?: string;
  viewportStyle?: CSSProperties;
  viewportRef?: Ref<HTMLDivElement>;
  onScroll?: (event: UIEvent<HTMLDivElement>) => void;
  /** Called when content starts or stops extending past an edge. */
  onEdgeChange?: (edges: ScrollAreaEdges) => void;
}

const props = withDefaults(defineProps<ScrollAreaProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.scroll_area || '']">
    <slot />
  </div>
</template>

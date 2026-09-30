<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./carousel.module.css";



interface CarouselProps {
  /** Names the carousel for assistive technology, for example "From the Harbour suites". */
  label: string;
  /** One child per slide. */
  children: ReactNode;
  /** Controlled active slide. Pair with `onIndexChange`. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Width of one slide as a CSS length. Use `cqw` for a share of the carousel width. */
  slideSize?: string;
  /** Names each slide and its indicator. Defaults to "2 of 5". */
  slideLabel?: (index: number, count: number) => string;
  /** Milliseconds per slide. Adds a play control that rotates through the slides; rotation pauses on hover, keyboard focus, and drag, and is unavailable with reduced motion. */
  interval?: number;
  /** Starts rotating on mount. Off by default, so motion begins with the viewer. */
  autoplay?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<CarouselProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.carousel || '']">
    <slot />
  </div>
</template>

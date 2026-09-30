<script setup lang="ts">
import { ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./tooltip.module.css";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content?: string;
  side?: TooltipSide;
  delay?: number;
}

const props = withDefaults(defineProps<TooltipProps>(), {
  side: "top",
  delay: 200,
});

const prefersReduced = useReducedMotion();
const isOpen = ref(false);
let timer: any = null;

const show = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    isOpen.value = true;
  }, props.delay);
};

const hide = () => {
  clearTimeout(timer);
  isOpen.value = false;
};

const getInitialPos = () => {
  if (props.side === "top") return { y: 4 };
  if (props.side === "bottom") return { y: -4 };
  if (props.side === "left") return { x: 4 };
  return { x: -4 };
};
</script>

<template>
  <div
    :class="styles.wrapper"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
  >
    <slot />

    <AnimatePresence>
      <motion.div
        v-if="isOpen && (content || $slots.content)"
        :class="styles.tooltip"
        :data-side="side"
        role="tooltip"
        :initial="
          prefersReduced
            ? { opacity: 0 }
            : {
                opacity: 0,
                ...getInitialPos(),
                filter: `blur(${motionTokens.blur.subtle}px)`,
              }
        "
        :animate="{
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
        }"
        :exit="
          prefersReduced
            ? { opacity: 0 }
            : {
                opacity: 0,
                filter: `blur(${motionTokens.blur.subtle}px)`,
              }
        "
        :transition="{
          duration: motionTokens.duration.fast,
          ease: [...motionTokens.ease.standard],
        }"
      >
        <slot name="content">{{ content }}</slot>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

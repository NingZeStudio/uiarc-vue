<script setup lang="ts">
import { inject, computed, type Ref } from "vue";
import { motion, AnimatePresence, type Variants } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./tabs.module.css";

interface TabsContextType {
  active: Ref<string>;
  direction: Ref<number>;
  updateActive: (val: string) => void;
  registerTab: (val: string) => void;
}

const props = defineProps<{
  value: string;
  class?: any;
}>();

const prefersReduced = useReducedMotion();
const context = inject<TabsContextType>("tabsContext");

const isSelected = computed(() => context?.active.value === props.value);
const dir = computed(() => context?.direction.value ?? 1);

const panelMotion: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 8 }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      opacity: {
        duration: motionTokens.duration.standard,
        ease: [...motionTokens.ease.enter],
      },
      x: motionTokens.spring.smooth,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -6,
    transition: {
      duration: motionTokens.duration.instant,
      ease: [...motionTokens.ease.standard],
    },
  }),
};

const panelFade: Variants = {
  enter: { opacity: 0, x: 0 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: motionTokens.duration.instant },
  },
  exit: { opacity: 0, x: 0, transition: { duration: 0.1 } },
};
</script>

<template>
  <AnimatePresence mode="popLayout" :custom="dir">
    <motion.div
      v-if="isSelected"
      :key="value"
      role="tabpanel"
      :class="[styles.content, props.class]"
      :custom="dir"
      :variants="prefersReduced ? panelFade : panelMotion"
      initial="enter"
      animate="center"
      exit="exit"
    >
      <slot />
    </motion.div>
  </AnimatePresence>
</template>

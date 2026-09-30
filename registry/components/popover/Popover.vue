<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./popover.module.css";

export interface PopoverProps {
  align?: "start" | "center" | "end";
  class?: any;
}

const props = withDefaults(defineProps<PopoverProps>(), {
  align: "start",
});

const prefersReduced = useReducedMotion();
const isOpen = ref(false);
const containerRef = ref<HTMLDivElement | null>(null);

function toggle() {
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

function handleOutsideClick(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});
</script>

<template>
  <div ref="containerRef" :class="[styles.container, props.class]">
    <div :class="styles.anchor" @click="toggle">
      <slot name="trigger" :open="isOpen" />
    </div>

    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        :class="[styles.content, styles[align]]"
        :initial="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.96, y: -4, filter: `blur(${motionTokens.blur.subtle}px)` }
        "
        :animate="{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }"
        :exit="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.96, y: -4, filter: `blur(${motionTokens.blur.subtle}px)` }
        "
        :transition="
          prefersReduced ? { duration: 0.1 } : motionTokens.spring.snappy
        "
      >
        <slot :close="close" />
      </motion.div>
    </AnimatePresence>
  </div>
</template>

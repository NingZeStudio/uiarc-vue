<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./drawer.module.css";

export interface DrawerProps {
  open?: boolean;
  title: string;
  description?: string;
  side?: "left" | "right" | "top" | "bottom";
  class?: any;
}

const props = withDefaults(defineProps<DrawerProps>(), {
  open: false,
  side: "right",
});

const emit = defineEmits<{
  (e: "update:open", val: boolean): void;
  (e: "close"): void;
}>();

const prefersReduced = useReducedMotion();
const isOpen = ref(props.open);

watch(
  () => props.open,
  (val) => {
    isOpen.value = val;
  }
);

function close() {
  isOpen.value = false;
  emit("update:open", false);
  emit("close");
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value) {
    close();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

const sideOffsets = {
  right: { x: "100%", y: 0 },
  left: { x: "-100%", y: 0 },
  bottom: { x: 0, y: "100%" },
  top: { x: 0, y: "-100%" },
};
</script>

<template>
  <AnimatePresence>
    <div v-if="isOpen" :class="styles.overlay">
      <!-- Backdrop -->
      <motion.div
        :class="styles.backdrop"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{
          duration: prefersReduced
            ? 0
            : motionTokens.duration.standard,
        }"
        @click="close"
      />

      <!-- Content Panel -->
      <motion.div
        :class="[styles.panel, styles[side], props.class]"
        role="dialog"
        aria-modal="true"
        :initial="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, ...sideOffsets[side] }
        "
        :animate="{ opacity: 1, x: 0, y: 0 }"
        :exit="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, ...sideOffsets[side] }
        "
        :transition="
          prefersReduced
            ? { duration: 0.1 }
            : motionTokens.spring.smooth
        "
      >
        <div :class="styles.header">
          <div :class="styles.titleGroup">
            <h2 :class="styles.title">{{ title }}</h2>
            <p v-if="description" :class="styles.description">{{ description }}</p>
          </div>
          <button
            type="button"
            :class="styles.close"
            aria-label="Close drawer"
            @click="close"
          >
            <X :size="16" aria-hidden="true" />
          </button>
        </div>

        <div :class="styles.body">
          <slot />
        </div>

        <div v-if="$slots.footer" :class="styles.footer">
          <slot name="footer" />
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
</template>

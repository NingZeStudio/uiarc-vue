<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./bottom-sheet.module.css";

export interface BottomSheetProps {
  open?: boolean;
  title: string;
  description?: string;
  detents?: number[];
  initialDetent?: number;
  class?: any;
}

const props = withDefaults(defineProps<BottomSheetProps>(), {
  open: false,
  detents: () => [0.5, 0.9],
  initialDetent: 0,
});

const emit = defineEmits<{
  (e: "update:open", val: boolean): void;
  (e: "close"): void;
}>();

const prefersReduced = useReducedMotion();
const isOpen = ref(props.open);
const currentDetent = ref(props.initialDetent);

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
</script>

<template>
  <AnimatePresence>
    <div v-if="isOpen" :class="styles.overlay">
      <motion.div
        :class="styles.backdrop"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        @click="close"
      />

      <motion.div
        :class="[styles.sheet, props.class]"
        role="dialog"
        aria-modal="true"
        :initial="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, y: '100%' }
        "
        :animate="{ opacity: 1, y: '0%' }"
        :exit="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, y: '100%' }
        "
        :transition="
          prefersReduced
            ? { duration: 0.1 }
            : motionTokens.spring.smooth
        "
      >
        <div :class="styles.handleWrap">
          <div :class="styles.handle" aria-hidden="true" />
        </div>

        <div :class="styles.header">
          <div :class="styles.titleGroup">
            <h2 :class="styles.title">{{ title }}</h2>
            <p v-if="description" :class="styles.description">{{ description }}</p>
          </div>
          <button
            type="button"
            :class="styles.close"
            aria-label="Close sheet"
            @click="close"
          >
            <X :size="16" aria-hidden="true" />
          </button>
        </div>

        <div :class="styles.content">
          <slot />
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
</template>

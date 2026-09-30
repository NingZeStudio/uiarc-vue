<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./toast.module.css";

export interface ToastProps {
  title: string;
  description?: string;
  open?: boolean;
  duration?: number;
  class?: any;
}

const props = withDefaults(defineProps<ToastProps>(), {
  open: true,
  duration: 4500,
});

const emit = defineEmits<{
  (e: "update:open", val: boolean): void;
  (e: "close"): void;
}>();

const prefersReduced = useReducedMotion();
const visible = ref(props.open);
let timer: any = null;

function close() {
  visible.value = false;
  emit("update:open", false);
  emit("close");
}

onMounted(() => {
  if (props.duration > 0 && props.duration !== Infinity) {
    timer = setTimeout(close, props.duration);
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="visible"
      :class="[styles.toast, props.class]"
      role="status"
      :initial="
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, y: 16, scale: 0.95 }
      "
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :exit="
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, y: 8, scale: 0.96 }
      "
      :transition="
        prefersReduced ? { duration: 0.1 } : motionTokens.spring.snappy
      "
    >
      <div :class="styles.content">
        <h4 :class="styles.title">{{ title }}</h4>
        <p v-if="description" :class="styles.description">{{ description }}</p>
      </div>

      <button
        type="button"
        :class="styles.close"
        aria-label="Close notification"
        @click="close"
      >
        <X :size="14" aria-hidden="true" />
      </button>
    </motion.div>
  </AnimatePresence>
</template>

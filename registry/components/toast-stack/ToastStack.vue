<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import {
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
  X,
} from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./toast-stack.module.css";

export type ToastType = "success" | "info" | "warning" | "error" | "loading";

export interface ToastItem {
  id: string;
  type?: ToastType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: (id: string) => void;
  };
}

export interface ToastStackProps {
  toasts?: ToastItem[];
  position?: "bottom-right" | "bottom-center" | "bottom-left";
  visibleToasts?: number;
  class?: any;
}

const props = withDefaults(defineProps<ToastStackProps>(), {
  toasts: () => [],
  position: "bottom-right",
  visibleToasts: 3,
});

const emit = defineEmits<{
  (e: "dismiss", id: string): void;
}>();

const prefersReduced = useReducedMotion();
const isHovered = ref(false);

const icons = {
  success: CircleCheck,
  info: Info,
  warning: TriangleAlert,
  error: CircleX,
  loading: null,
};

function dismiss(id: string) {
  emit("dismiss", id);
}
</script>

<template>
  <div
    :class="[styles.viewport, styles[position], props.class]"
    role="region"
    aria-label="Notifications"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div :class="styles.stack">
      <AnimatePresence>
        <motion.div
          v-for="(item, index) in toasts.slice(0, visibleToasts)"
          :key="item.id"
          :class="[styles.toast, item.type ? styles[item.type] : undefined]"
          :data-front="index === 0 ? '' : undefined"
          :initial="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: 20, scale: 0.92 }
          "
          :animate="{
            opacity: 1,
            y: isHovered ? -index * 64 : -index * 12,
            scale: isHovered ? 1 : 1 - index * 0.05,
            zIndex: toasts.length - index,
          }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: 15, scale: 0.9 }
          "
          :transition="
            prefersReduced ? { duration: 0.1 } : motionTokens.spring.smooth
          "
        >
          <div v-if="item.type && icons[item.type]" :class="styles.icon">
            <component :is="icons[item.type]" :size="16" />
          </div>

          <div :class="styles.content">
            <h5 :class="styles.title">{{ item.title }}</h5>
            <p v-if="item.description" :class="styles.description">
              {{ item.description }}
            </p>
          </div>

          <button
            v-if="item.action"
            type="button"
            :class="styles.action"
            @click="item.action.onClick(item.id)"
          >
            {{ item.action.label }}
          </button>

          <button
            type="button"
            :class="styles.close"
            aria-label="Dismiss"
            @click="dismiss(item.id)"
          >
            <X :size="14" aria-hidden="true" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
</template>

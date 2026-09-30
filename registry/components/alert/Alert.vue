<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import {
  Info as InfoCircle,
  Check,
  TriangleAlert as WarningTriangle,
  CircleX as XmarkCircle,
  X,
} from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./alert.module.css";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  tone?: AlertTone;
  title: string;
  open?: boolean;
  onDismiss?: () => void;
  class?: any;
}

const props = withDefaults(defineProps<AlertProps>(), {
  tone: "info",
  open: true,
});

const emit = defineEmits<{
  (e: "dismiss"): void;
}>();

const prefersReduced = useReducedMotion();
const visible = ref(props.open);

const icons = {
  info: InfoCircle,
  success: Check,
  warning: WarningTriangle,
  danger: XmarkCircle,
};

const currentIcon = computed(() => icons[props.tone] || InfoCircle);

function handleDismiss() {
  visible.value = false;
  emit("dismiss");
  props.onDismiss?.();
}
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="visible"
      :class="[styles.alert, styles[tone], props.class]"
      role="alert"
      :initial="{ opacity: 0, height: 0, scale: 0.98 }"
      :animate="{
        opacity: 1,
        height: 'auto',
        scale: 1,
        transition: prefersReduced
          ? { duration: 0.1 }
          : motionTokens.spring.smooth,
      }"
      :exit="{
        opacity: 0,
        height: 0,
        scale: 0.96,
        transition: {
          duration: prefersReduced ? 0 : motionTokens.duration.fast,
          ease: [...motionTokens.ease.standard],
        },
      }"
    >
      <div :class="styles.iconWrap">
        <AnimatePresence mode="popLayout" :initial="false">
          <motion.div
            :key="tone"
            :initial="{ opacity: 0, scale: 0.6, filter: `blur(${motionTokens.blur.subtle}px)` }"
            :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
            :exit="{ opacity: 0, scale: 0.6, filter: `blur(${motionTokens.blur.subtle}px)` }"
            :transition="prefersReduced ? { duration: 0 } : motionTokens.spring.snappy"
            :class="styles.icon"
          >
            <component :is="currentIcon" :size="16" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div :class="styles.content">
        <div :class="styles.titleWrap">
          <AnimatePresence mode="popLayout" :initial="false">
            <motion.h4
              :key="title"
              :class="styles.title"
              :initial="{ opacity: 0, y: '0.3em', filter: `blur(${motionTokens.blur.soft}px)` }"
              :animate="{ opacity: 1, y: '0em', filter: 'blur(0px)' }"
              :exit="{ opacity: 0, y: '-0.3em', filter: `blur(${motionTokens.blur.subtle}px)` }"
              :transition="prefersReduced ? { duration: 0 } : motionTokens.spring.smooth"
            >
              {{ title }}
            </motion.h4>
          </AnimatePresence>
        </div>
        <div v-if="$slots.default" :class="styles.description">
          <slot />
        </div>
      </div>

      <button
        v-if="onDismiss || $attrs.onDismiss"
        type="button"
        :class="styles.dismiss"
        aria-label="Dismiss alert"
        @click="handleDismiss"
      >
        <X :size="14" aria-hidden="true" />
      </button>
    </motion.div>
  </AnimatePresence>
</template>

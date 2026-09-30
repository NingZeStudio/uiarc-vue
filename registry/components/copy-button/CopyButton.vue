<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Copy, CircleAlert } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./copy-button.module.css";

export interface CopyButtonProps {
  value: string;
  label?: string;
  iconOnly?: boolean;
  variant?: "outline" | "plain";
  disabled?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<CopyButtonProps>(), {
  label: "Copy",
  variant: "outline",
  iconOnly: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "copied"): void;
}>();

const prefersReduced = useReducedMotion();
const status = ref<"idle" | "copied" | "failed">("idle");
let resetTimer: any = null;

async function handleCopy() {
  if (props.disabled || status.value !== "idle") return;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.value);
    }
    status.value = "copied";
    emit("copied");
  } catch (err) {
    status.value = "failed";
  }

  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    status.value = "idle";
  }, 2000);
}

const buttonText = computed(() => {
  if (status.value === "copied") return "Copied";
  if (status.value === "failed") return "Failed";
  return props.label;
});
</script>

<template>
  <button
    type="button"
    :class="[
      styles.button,
      styles[variant],
      iconOnly ? styles.iconOnly : undefined,
      props.class,
    ]"
    :disabled="disabled"
    :aria-label="iconOnly ? buttonText : undefined"
    @click="handleCopy"
  >
    <span :class="styles.iconWrap">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          v-if="status === 'copied'"
          key="copied"
          :class="styles.icon"
          :initial="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.6, filter: `blur(${motionTokens.blur.soft}px)` }
          "
          :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.6, filter: `blur(${motionTokens.blur.soft}px)` }
          "
          :transition="
            prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
          "
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <motion.path
              d="M4 12l5 5L20 6"
              :initial="prefersReduced ? false : { pathLength: 0, opacity: 0 }"
              :animate="{ pathLength: 1, opacity: 1 }"
              :transition="{
                pathLength: {
                  duration: 0.4,
                  ease: [...motionTokens.ease.standard],
                },
                opacity: { duration: 0.05 },
              }"
            />
          </svg>
        </motion.span>

        <motion.span
          v-else-if="status === 'failed'"
          key="failed"
          :class="styles.icon"
          :initial="{ opacity: 0, scale: 0.6 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.6 }"
        >
          <CircleAlert :size="15" />
        </motion.span>

        <motion.span
          v-else
          key="idle"
          :class="styles.icon"
          :initial="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.6, filter: `blur(${motionTokens.blur.soft}px)` }
          "
          :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.6, filter: `blur(${motionTokens.blur.soft}px)` }
          "
          :transition="
            prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
          "
        >
          <Copy :size="15" />
        </motion.span>
      </AnimatePresence>
    </span>

    <span v-if="!iconOnly" :class="styles.label">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          :key="buttonText"
          :class="styles.text"
          :initial="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: 4, filter: `blur(${motionTokens.blur.soft}px)` }
          "
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: -4, filter: `blur(${motionTokens.blur.soft}px)` }
          "
          :transition="{
            duration: prefersReduced ? 0 : motionTokens.duration.fast,
            ease: [...motionTokens.ease.standard],
          }"
        >
          {{ buttonText }}
        </motion.span>
      </AnimatePresence>
    </span>
  </button>
</template>

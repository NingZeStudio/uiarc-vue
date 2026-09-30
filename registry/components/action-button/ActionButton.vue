<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { ArrowRight } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./action-button.module.css";

export interface ActionButtonProps {
  label: string;
  successLabel?: string;
  pendingLabel?: string;
  onAction?: () => void | Promise<void>;
  resetAfterMs?: number;
  disabled?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<ActionButtonProps>(), {
  successLabel: "Saved",
  pendingLabel: "Saving",
  resetAfterMs: 2400,
  disabled: false,
});

const emit = defineEmits<{
  (e: "action"): void;
  (e: "error", err: unknown): void;
}>();

const prefersReduced = useReducedMotion();
const state = ref<"idle" | "pending" | "success">("idle");
let resetTimer: any = null;

const currentText = computed(() => {
  if (state.value === "pending") return props.pendingLabel;
  if (state.value === "success") return props.successLabel;
  return props.label;
});

async function handleClick() {
  if (props.disabled || state.value === "pending") return;
  if (resetTimer) clearTimeout(resetTimer);

  state.value = "pending";
  try {
    if (props.onAction) {
      await props.onAction();
    }
    emit("action");
    state.value = "success";

    if (props.resetAfterMs > 0) {
      resetTimer = setTimeout(() => {
        state.value = "idle";
      }, props.resetAfterMs);
    }
  } catch (err) {
    state.value = "idle";
    emit("error", err);
  }
}

onUnmounted(() => {
  if (resetTimer) clearTimeout(resetTimer);
});
</script>

<template>
  <button
    type="button"
    :class="[styles.button, props.class]"
    :disabled="disabled"
    :aria-busy="state === 'pending'"
    :data-state="state"
    @click="handleClick"
  >
    <span :class="styles.content" aria-hidden="true">
      <span :class="styles.morph">
        <AnimatePresence mode="popLayout" :initial="false">
          <motion.span
            :key="currentText"
            :class="styles.text"
            :initial="
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 5, filter: `blur(${motionTokens.blur.soft}px)` }
            "
            :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
            :exit="
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: -4, filter: `blur(${motionTokens.blur.subtle}px)` }
            "
            :transition="{
              duration: prefersReduced ? 0 : motionTokens.duration.standard,
              ease: [...motionTokens.ease.enter],
            }"
          >
            {{ currentText }}
          </motion.span>
        </AnimatePresence>
      </span>

      <span :class="styles.iconSlot">
        <AnimatePresence mode="popLayout" :initial="false">
          <!-- Pending Spinner -->
          <motion.span
            v-if="state === 'pending'"
            key="pending"
            :class="styles.phase"
            :initial="{ opacity: 0, scale: 0.6 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.6 }"
          >
            <span :class="styles.spinner" />
          </motion.span>

          <!-- Success Drawn Check -->
          <motion.span
            v-else-if="state === 'success'"
            key="success"
            :class="styles.phase"
            :initial="{ opacity: 0, scale: 0.6 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.6 }"
            :transition="
              prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
            "
          >
            <svg
              :class="styles.statusIcon"
              width="17"
              height="17"
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

          <!-- Idle Arrow -->
          <motion.span
            v-else
            key="idle"
            :class="styles.phase"
            :initial="
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, x: -6, filter: `blur(${motionTokens.blur.subtle}px)` }
            "
            :animate="{ opacity: 1, x: 0, filter: 'blur(0px)' }"
            :exit="
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, x: 8, filter: `blur(${motionTokens.blur.subtle}px)` }
            "
            :transition="
              prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
            "
          >
            <ArrowRight :class="styles.arrow" :size="17" />
          </motion.span>
        </AnimatePresence>
      </span>
    </span>

    <span :class="styles.visuallyHidden">{{ label }}</span>
  </button>
</template>

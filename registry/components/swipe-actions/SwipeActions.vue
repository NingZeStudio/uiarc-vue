<script setup lang="ts">
import { ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./swipe-actions.module.css";

export interface SwipeActionItem {
  label: string;
  tone?: "neutral" | "accent" | "danger";
  onSelect?: () => void;
}

export interface SwipeActionsProps {
  label?: string;
  leading?: SwipeActionItem[];
  trailing?: SwipeActionItem[];
  class?: any;
}

const props = withDefaults(defineProps<SwipeActionsProps>(), {
  leading: () => [],
  trailing: () => [],
});

const prefersReduced = useReducedMotion();
const offset = ref(0);
const isOpen = ref(false);

function triggerAction(action: SwipeActionItem) {
  action.onSelect?.();
  offset.value = 0;
  isOpen.value = false;
}
</script>

<template>
  <div :class="[styles.container, props.class]">
    <!-- Leading Actions Container -->
    <div v-if="leading.length > 0" :class="[styles.actions, styles.leading]">
      <button
        v-for="act in leading"
        :key="act.label"
        type="button"
        :class="[styles.actionButton, act.tone ? styles[act.tone] : undefined]"
        @click="triggerAction(act)"
      >
        <span :class="styles.actionLabel">{{ act.label }}</span>
      </button>
    </div>

    <!-- Main Swipeable Row Surface -->
    <motion.div
      :class="styles.rowSurface"
      :animate="{ x: offset }"
      :transition="
        prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
      "
    >
      <slot />
    </motion.div>

    <!-- Trailing Actions Container -->
    <div v-if="trailing.length > 0" :class="[styles.actions, styles.trailing]">
      <button
        v-for="act in trailing"
        :key="act.label"
        type="button"
        :class="[styles.actionButton, act.tone ? styles[act.tone] : undefined]"
        @click="triggerAction(act)"
      >
        <span :class="styles.actionLabel">{{ act.label }}</span>
      </button>
    </div>
  </div>
</template>

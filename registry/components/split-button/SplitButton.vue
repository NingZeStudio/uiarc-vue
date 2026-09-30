<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./split-button.module.css";

export interface SplitButtonAction {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface SplitButtonProps {
  label: string;
  actions?: SplitButtonAction[];
  disabled?: boolean;
  variant?: "primary" | "secondary";
  class?: any;
}

const props = withDefaults(defineProps<SplitButtonProps>(), {
  actions: () => [],
  disabled: false,
  variant: "primary",
});

const emit = defineEmits<{
  (e: "click"): void;
}>();

const prefersReduced = useReducedMotion();
const menuOpen = ref(false);
const groupRef = ref<HTMLDivElement | null>(null);

function handlePrimaryClick() {
  if (props.disabled) return;
  emit("click");
}

function toggleMenu() {
  if (props.disabled) return;
  menuOpen.value = !menuOpen.value;
}

function handleSelect(action: SplitButtonAction) {
  if (action.disabled) return;
  action.onSelect?.();
  menuOpen.value = false;
}

function handleOutsideClick(e: MouseEvent) {
  if (groupRef.value && !groupRef.value.contains(e.target as Node)) {
    menuOpen.value = false;
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
  <div
    ref="groupRef"
    :class="[
      styles.group,
      variant === 'secondary' ? styles.secondary : undefined,
      props.class,
    ]"
  >
    <button
      type="button"
      :class="styles.primary"
      :disabled="disabled"
      @click="handlePrimaryClick"
    >
      <span :class="styles.primaryContent">
        <slot name="icon" />
        <span :class="styles.label">{{ label }}</span>
      </span>
    </button>

    <button
      type="button"
      :class="styles.trigger"
      :disabled="disabled"
      :aria-expanded="menuOpen"
      aria-label="More actions"
      @click.stop="toggleMenu"
    >
      <ChevronDown :class="styles.chevron" :size="15" aria-hidden="true" />
    </button>

    <!-- Dropdown Menu -->
    <AnimatePresence>
      <motion.div
        v-if="menuOpen && actions.length > 0"
        :class="styles.menu"
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
        <button
          v-for="(action, index) in actions"
          :key="action.label"
          type="button"
          :class="[
            styles.item,
            action.destructive ? styles.destructive : undefined,
          ]"
          :disabled="action.disabled"
          @click="handleSelect(action)"
        >
          {{ action.label }}
        </button>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

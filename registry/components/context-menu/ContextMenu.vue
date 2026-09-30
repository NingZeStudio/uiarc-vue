<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./context-menu.module.css";

export interface ContextMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  class?: any;
}

const props = defineProps<ContextMenuProps>();
const prefersReduced = useReducedMotion();

const isOpen = ref(false);
const position = ref({ x: 0, y: 0 });
const menuRef = ref<HTMLDivElement | null>(null);

function handleContextMenu(e: MouseEvent) {
  e.preventDefault();
  isOpen.value = true;
  position.value = { x: e.clientX, y: e.clientY };
}

function close() {
  isOpen.value = false;
}

function handleSelect(item: ContextMenuItem) {
  if (item.disabled) return;
  item.onSelect?.();
  close();
}

function handleOutsideClick(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
  window.addEventListener("scroll", close);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
  window.removeEventListener("scroll", close);
});
</script>

<template>
  <div :class="styles.target" @contextmenu="handleContextMenu">
    <slot />

    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        ref="menuRef"
        :class="[styles.menu, props.class]"
        :style="{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }"
        :initial="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.95, filter: `blur(${motionTokens.blur.subtle}px)` }
        "
        :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
        :exit="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.95, filter: `blur(${motionTokens.blur.subtle}px)` }
        "
        :transition="
          prefersReduced ? { duration: 0.1 } : motionTokens.spring.snappy
        "
      >
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          :class="[
            styles.item,
            item.destructive ? styles.destructive : undefined,
          ]"
          :disabled="item.disabled"
          @click="handleSelect(item)"
        >
          <span :class="styles.label">{{ item.label }}</span>
        </button>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./dropdown-menu.module.css";

export interface DropdownItem {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
}

export interface DropdownMenuProps {
  label: string;
  items: DropdownItem[];
  class?: any;
}

const props = defineProps<DropdownMenuProps>();
const prefersReduced = useReducedMotion();
const isOpen = ref(false);
const activeIndex = ref<number | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

function toggle() {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) activeIndex.value = null;
}

function handleSelect(item: DropdownItem) {
  if (item.disabled) return;
  item.onSelect?.();
  isOpen.value = false;
  activeIndex.value = null;
}

function handleOutsideClick(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
    activeIndex.value = null;
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
  <div ref="containerRef" :class="[styles.container, props.class]">
    <button
      type="button"
      :class="styles.trigger"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <slot name="icon" />
      <span :class="styles.label">{{ label }}</span>
      <ChevronDown :class="styles.chevron" :size="15" aria-hidden="true" />
    </button>

    <AnimatePresence>
      <motion.div
        v-if="isOpen"
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
        <template v-for="(item, index) in items" :key="item.label">
          <div v-if="item.separatorBefore" :class="styles.separator" role="separator" />

          <button
            type="button"
            role="menuitem"
            :class="[
              styles.item,
              item.destructive ? styles.destructive : undefined,
              activeIndex === index ? styles.highlighted : undefined,
            ]"
            :disabled="item.disabled"
            @mouseenter="activeIndex = index"
            @mouseleave="activeIndex === index ? (activeIndex = null) : undefined"
            @click="handleSelect(item)"
          >
            <motion.span
              v-if="activeIndex === index"
              :class="[
                styles.highlight,
                item.destructive ? styles.highlightDestructive : undefined,
              ]"
              layout-id="dropdown-highlight"
              :transition="
                prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
              "
              aria-hidden="true"
            />
            <span :class="styles.itemLabel">{{ item.label }}</span>
          </button>
        </template>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

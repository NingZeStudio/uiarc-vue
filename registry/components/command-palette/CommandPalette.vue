<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Search, CornerDownLeft, X } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./command-palette.module.css";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  keywords?: string[];
  shortcut?: string;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  placeholder?: string;
  open?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  placeholder: "Search commands...",
  open: true,
});

const emit = defineEmits<{
  (e: "select", item: CommandItem): void;
  (e: "close"): void;
  (e: "update:open", val: boolean): void;
}>();

const prefersReduced = useReducedMotion();
const query = ref("");
const activeIndex = ref(0);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.items;
  return props.items.filter((item) =>
    [item.label, item.description, item.group, ...(item.keywords ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
});

function handleSelect(item: CommandItem) {
  emit("select", item);
  close();
}

function close() {
  emit("update:open", false);
  emit("close");
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    close();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (filtered.value.length > 0) {
      activeIndex.value = (activeIndex.value + 1) % filtered.value.length;
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (filtered.value.length > 0) {
      activeIndex.value =
        (activeIndex.value - 1 + filtered.value.length) % filtered.value.length;
    }
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (filtered.value[activeIndex.value]) {
      handleSelect(filtered.value[activeIndex.value]);
    }
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
    <div v-if="open" :class="styles.overlay">
      <motion.div
        :class="styles.backdrop"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        @click="close"
      />

      <motion.div
        :class="[styles.palette, props.class]"
        role="dialog"
        aria-modal="true"
        :initial="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.96, y: -10, filter: `blur(${motionTokens.blur.subtle}px)` }
        "
        :animate="{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }"
        :exit="
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.96, y: -10, filter: `blur(${motionTokens.blur.subtle}px)` }
        "
        :transition="
          prefersReduced ? { duration: 0.1 } : motionTokens.spring.smooth
        "
      >
        <div :class="styles.searchBar">
          <Search :size="18" :class="styles.searchIcon" aria-hidden="true" />
          <input
            v-model="query"
            type="text"
            :placeholder="placeholder"
            :class="styles.input"
            autofocus
          />
          <button
            type="button"
            :class="styles.closeButton"
            aria-label="Close"
            @click="close"
          >
            <X :size="16" />
          </button>
        </div>

        <div :class="styles.list" role="listbox">
          <div
            v-if="filtered.length === 0"
            :class="styles.empty"
          >
            No results found.
          </div>

          <button
            v-for="(item, idx) in filtered"
            :key="item.id"
            type="button"
            role="option"
            :class="[
              styles.item,
              activeIndex === idx ? styles.active : undefined,
            ]"
            @mouseenter="activeIndex = idx"
            @click="handleSelect(item)"
          >
            <div :class="styles.itemContent">
              <span :class="styles.itemLabel">{{ item.label }}</span>
              <span v-if="item.description" :class="styles.itemDesc">
                {{ item.description }}
              </span>
            </div>

            <div v-if="item.shortcut" :class="styles.shortcut">
              {{ item.shortcut }}
            </div>
            <CornerDownLeft
              v-else-if="activeIndex === idx"
              :size="14"
              :class="styles.enterIcon"
            />
          </button>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
</template>

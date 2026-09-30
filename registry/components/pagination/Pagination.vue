<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./pagination.module.css";

export interface PaginationProps {
  page: number;
  pageCount: number;
  label?: string;
  class?: any;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  label: "Pagination",
});

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "change", page: number): void;
}>();

const prefersReduced = useReducedMotion();
const safePageCount = computed(() => Math.max(0, Math.floor(props.pageCount)));
const currentPage = computed(() =>
  safePageCount.value > 0
    ? Math.min(Math.max(1, Math.floor(props.page)), safePageCount.value)
    : 0
);

const start = computed(() =>
  safePageCount.value > 0
    ? Math.max(1, Math.min(safePageCount.value - 4, currentPage.value - 2))
    : 1
);

const visiblePages = computed(() => {
  const len = Math.min(safePageCount.value, 5);
  return Array.from({ length: len }, (_, i) => start.value + i);
});

function goTo(p: number) {
  if (p < 1 || p > safePageCount.value || p === currentPage.value) return;
  emit("update:page", p);
  emit("change", p);
}
</script>

<template>
  <nav :class="[styles.nav, props.class]" :aria-label="label">
    <button
      type="button"
      :class="styles.step"
      :disabled="currentPage <= 1"
      aria-label="Previous page"
      @click="goTo(currentPage - 1)"
    >
      <ChevronLeft :size="16" aria-hidden="true" />
    </button>

    <div :class="styles.pages">
      <button
        v-for="num in visiblePages"
        :key="num"
        type="button"
        :class="[
          styles.pageButton,
          currentPage === num ? styles.active : undefined,
        ]"
        :aria-current="currentPage === num ? 'page' : undefined"
        @click="goTo(num)"
      >
        <motion.span
          v-if="currentPage === num"
          :class="styles.mark"
          layout-id="pagination-mark"
          :transition="
            prefersReduced ? { duration: 0 } : motionTokens.spring.morph
          "
          aria-hidden="true"
        />
        <span :class="styles.pageLabel">{{ num }}</span>
      </button>
    </div>

    <button
      type="button"
      :class="styles.step"
      :disabled="currentPage >= safePageCount"
      aria-label="Next page"
      @click="goTo(currentPage + 1)"
    >
      <ChevronRight :size="16" aria-hidden="true" />
    </button>
  </nav>
</template>

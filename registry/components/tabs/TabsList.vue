<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, type Ref } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./tabs.module.css";

const props = defineProps<{
  class?: any;
}>();

const prefersReduced = useReducedMotion();
const shellRef = ref<HTMLDivElement | null>(null);
const viewportRef = ref<HTMLDivElement | null>(null);
const listRef = ref<HTMLDivElement | null>(null);

const edges = ref({ overflow: false, left: false, right: false });

function update() {
  const frame = shellRef.value;
  const scroll = viewportRef.value;
  if (!frame || !scroll) return;
  const max = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
  edges.value = {
    overflow: scroll.scrollWidth > frame.clientWidth + 1,
    left: scroll.scrollLeft > 1,
    right: scroll.scrollLeft < max - 1,
  };
}

function scrollTabs(dir: number) {
  viewportRef.value?.scrollBy({
    left: dir * (viewportRef.value?.clientWidth ?? 0) * 0.75,
    behavior: prefersReduced.value ? "auto" : "smooth",
  });
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(update);
    if (shellRef.value) resizeObserver.observe(shellRef.value);
    if (viewportRef.value) resizeObserver.observe(viewportRef.value);
    if (listRef.value) resizeObserver.observe(listRef.value);
  }
  viewportRef.value?.addEventListener("scroll", update, { passive: true });
  update();
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  viewportRef.value?.removeEventListener("scroll", update);
});
</script>

<template>
  <div
    ref="shellRef"
    :class="styles.listShell"
    :data-overflow="edges.overflow ? '' : undefined"
    :data-left="edges.left ? '' : undefined"
    :data-right="edges.right ? '' : undefined"
  >
    <button
      v-if="edges.overflow"
      type="button"
      :class="[styles.scrollButton, styles.scrollLeft]"
      aria-label="Scroll tabs left"
      :disabled="!edges.left"
      @click="scrollTabs(-1)"
    >
      <ChevronLeft :size="16" aria-hidden="true" />
    </button>

    <div ref="viewportRef" :class="styles.viewport">
      <div ref="listRef" role="tablist" :class="[styles.list, props.class]">
        <slot />
      </div>
    </div>

    <button
      v-if="edges.overflow"
      type="button"
      :class="[styles.scrollButton, styles.scrollRight]"
      aria-label="Scroll tabs right"
      :disabled="!edges.right"
      @click="scrollTabs(1)"
    >
      <ChevronRight :size="16" aria-hidden="true" />
    </button>
  </div>
</template>

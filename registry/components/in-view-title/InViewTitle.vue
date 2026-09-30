<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./in-view-title.module.css";

export type InViewTitleVariant = "word" | "line" | "blur" | "tracking" | "wipe";

export interface InViewTitleProps {
  text: string;
  variant?: InViewTitleVariant;
  as?: "h1" | "h2" | "h3";
  class?: any;
}

const props = withDefaults(defineProps<InViewTitleProps>(), {
  variant: "blur",
  as: "h2",
});

const prefersReduced = useReducedMotion();
const isVisible = ref(false);
const elRef = ref<HTMLElement | null>(null);

const words = computed(() => props.text.split(" ").filter(Boolean));

onMounted(() => {
  if (prefersReduced.value) {
    isVisible.value = true;
    return;
  }

  if (typeof IntersectionObserver !== "undefined" && elRef.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible.value = true;
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(elRef.value);
  } else {
    isVisible.value = true;
  }
});
</script>

<template>
  <div ref="elRef" :class="[styles.wrap, props.class]">
    <component
      :is="as"
      :class="[
        styles.title,
        styles[variant],
        isVisible ? styles.visible : undefined,
      ]"
    >
      <span
        v-for="(word, index) in words"
        :key="`${word}-${index}`"
        :class="styles.wordWrap"
      >
        <span
          :class="styles.word"
          :style="{
            transitionDelay: `${index * 0.04}s`,
          }"
        >
          {{ word }}
        </span>
        <span v-if="index < words.length - 1">&nbsp;</span>
      </span>
    </component>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./avatar.module.css";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline";
  class?: any;
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: "md",
});

const prefersReduced = useReducedMotion();
const failedSrc = ref<string | null>(null);
const imageLoaded = ref(false);

const initials = computed(() => {
  return props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
});

watch(
  () => props.src,
  () => {
    failedSrc.value = null;
    imageLoaded.value = false;
  }
);

function handleLoad() {
  imageLoaded.value = true;
}

function handleError() {
  failedSrc.value = props.src || null;
}
</script>

<template>
  <span
    :class="[styles.avatar, styles[size], props.class]"
    role="img"
    :aria-label="`${name}${status ? `, ${status}` : ''}`"
  >
    <img
      v-if="src && failedSrc !== src"
      :src="src"
      alt=""
      :class="styles.image"
      :data-loading="!imageLoaded ? '' : undefined"
      @load="handleLoad"
      @error="handleError"
    />
    <span
      v-else
      :class="[styles.initials, src ? styles.fallback : undefined]"
      aria-hidden="true"
    >
      {{ initials }}
    </span>

    <AnimatePresence :initial="false">
      <motion.i
        v-if="status"
        :key="status"
        :class="[styles.status, styles[status]]"
        aria-hidden="true"
        :initial="{ opacity: 0, scale: 0.6 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{
          opacity: 0,
          scale: 0.6,
          transition: { duration: prefersReduced ? 0 : motionTokens.duration.fast },
        }"
        :transition="
          prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
        "
      />
    </AnimatePresence>
  </span>
</template>

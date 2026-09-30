<script setup lang="ts">
import { computed, type CSSProperties } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./skeleton.module.css";

export interface SkeletonProps {
  label?: string;
  lines?: number;
  avatar?: boolean;
  loading?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  label: "Loading content",
  lines: 3,
  avatar: false,
  loading: true,
});

const prefersReduced = useReducedMotion();
const count = computed(() => Math.min(Math.max(Math.floor(props.lines), 1), 6));
</script>

<template>
  <div v-if="!$slots.default" :class="[styles.root, props.class]" role="status" :aria-label="label" aria-busy="true">
    <span v-if="avatar" :class="styles.avatar" aria-hidden="true" />
    <span :class="styles.lines" aria-hidden="true">
      <span
        v-for="(_, index) in count"
        :key="index"
        :class="styles.line"
        :style="{ '--index': index + (avatar ? 1 : 0) } as CSSProperties"
      />
    </span>
  </div>

  <div v-else :class="props.class" :aria-busy="loading">
    <AnimatePresence mode="popLayout" :initial="false">
      <motion.div
        v-if="loading"
        key="placeholder"
        :exit="{
          opacity: 0,
          transition: {
            duration: prefersReduced
              ? motionTokens.duration.instant
              : motionTokens.duration.fast,
          },
        }"
      >
        <div :class="styles.root" role="status" :aria-label="label" aria-busy="true">
          <span v-if="avatar" :class="styles.avatar" aria-hidden="true" />
          <span :class="styles.lines" aria-hidden="true">
            <span
              v-for="(_, index) in count"
              :key="index"
              :class="styles.line"
              :style="{ '--index': index + (avatar ? 1 : 0) } as CSSProperties"
            />
          </span>
        </div>
      </motion.div>

      <motion.div
        v-else
        key="content"
        :initial="prefersReduced ? { opacity: 0 } : { opacity: 0, y: 4 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{
          duration: prefersReduced
            ? motionTokens.duration.instant
            : motionTokens.duration.standard,
          ease: [...motionTokens.ease.enter],
        }"
      >
        <slot />
      </motion.div>
    </AnimatePresence>
  </div>
</template>

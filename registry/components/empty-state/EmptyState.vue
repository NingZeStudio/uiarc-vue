<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Folder } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./empty-state.module.css";

export interface EmptyStateProps {
  title: string;
  description: string;
  label?: string;
  class?: any;
}

const props = defineProps<EmptyStateProps>();
const prefersReduced = useReducedMotion();
</script>

<template>
  <div
    :class="[styles.state, props.class]"
    role="region"
    :aria-label="label ?? title"
  >
    <div :class="styles.iconWrap">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.div
          :key="title"
          :class="styles.icon"
          :initial="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.6, filter: `blur(${motionTokens.blur.subtle}px)` }
          "
          :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.6, filter: `blur(${motionTokens.blur.subtle}px)` }
          "
          :transition="
            prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
          "
        >
          <slot name="icon">
            <Folder :size="24" :stroke-width="1.6" />
          </slot>
        </motion.div>
      </AnimatePresence>
    </div>

    <div :class="styles.textGroup">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.h3
          :key="title"
          :class="styles.title"
          :initial="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: '0.3em', filter: `blur(${motionTokens.blur.soft}px)` }
          "
          :animate="{ opacity: 1, y: '0em', filter: 'blur(0px)' }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: '-0.3em', filter: `blur(${motionTokens.blur.subtle}px)` }
          "
          :transition="{
            duration: prefersReduced ? 0 : motionTokens.duration.standard,
            ease: [...motionTokens.ease.enter],
          }"
        >
          {{ title }}
        </motion.h3>
      </AnimatePresence>

      <AnimatePresence mode="popLayout" :initial="false">
        <motion.p
          :key="description"
          :class="styles.description"
          :initial="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: '0.3em', filter: `blur(${motionTokens.blur.soft}px)` }
          "
          :animate="{ opacity: 1, y: '0em', filter: 'blur(0px)' }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: '-0.3em', filter: `blur(${motionTokens.blur.subtle}px)` }
          "
          :transition="{
            duration: prefersReduced ? 0 : motionTokens.duration.standard,
            ease: [...motionTokens.ease.enter],
            delay: 0.05,
          }"
        >
          {{ description }}
        </motion.p>
      </AnimatePresence>
    </div>

    <div v-if="$slots.action" :class="styles.action">
      <slot name="action" />
    </div>
  </div>
</template>

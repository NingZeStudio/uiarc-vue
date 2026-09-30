<script setup lang="ts">
import { ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./expandable-card.module.css";

export interface ExpandableCardProps {
  title: string;
  description?: string;
  defaultExpanded?: boolean;
  width?: number;
  expandedWidth?: number;
  class?: any;
}

const props = withDefaults(defineProps<ExpandableCardProps>(), {
  defaultExpanded: false,
});

const prefersReduced = useReducedMotion();
const expanded = ref(props.defaultExpanded);

function toggle() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <div :class="[styles.track, props.class]">
    <motion.article
      :class="styles.card"
      :data-expanded="expanded ? '' : undefined"
      :animate="{
        width: expanded && expandedWidth ? `${expandedWidth}px` : width ? `${width}px` : '100%',
      }"
      :transition="prefersReduced ? { duration: 0 } : motionTokens.spring.smooth"
    >
      <header :class="styles.header">
        <button
          type="button"
          :class="styles.trigger"
          :aria-expanded="expanded"
          @click="toggle"
        >
          <div :class="styles.summary">
            <h3 :class="styles.title">{{ title }}</h3>
            <p v-if="description" :class="styles.description">{{ description }}</p>
          </div>
          <motion.span
            :class="styles.indicator"
            :animate="{ rotate: expanded ? 180 : 0 }"
            :transition="prefersReduced ? { duration: 0 } : motionTokens.spring.snappy"
          >
            <ChevronDown :size="16" aria-hidden="true" />
          </motion.span>
        </button>
      </header>

      <AnimatePresence>
        <motion.div
          v-if="expanded"
          :class="styles.body"
          :initial="{ opacity: 0, height: 0 }"
          :animate="{
            opacity: 1,
            height: 'auto',
            transition: prefersReduced
              ? { duration: 0.1 }
              : {
                  height: motionTokens.spring.smooth,
                  opacity: {
                    duration: motionTokens.duration.standard,
                    ease: [...motionTokens.ease.standard],
                    delay: 0.08,
                  },
                },
          }"
          :exit="{
            opacity: 0,
            height: 0,
            transition: {
              height: motionTokens.spring.smooth,
              opacity: { duration: 0.1 },
            },
          }"
        >
          <div :class="styles.content">
            <slot />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.article>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import AnimatedCounter from "@/registry/components/animated-counter/AnimatedCounter.vue";
import styles from "./metric-card.module.css";

export interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  context: string;
  change?: string;
  class?: any;
}

const props = defineProps<MetricCardProps>();
const prefersReduced = useReducedMotion();

const isUp = computed(() => props.change && /^[+]/.test(props.change));
const isDown = computed(() => props.change && /^[-−]/.test(props.change));
</script>

<template>
  <article :class="[styles.card, props.class]">
    <div :class="styles.top">
      <span :class="styles.label">{{ label }}</span>

      <AnimatePresence>
        <motion.small
          v-if="change"
          key="change"
          :class="styles.changeBadge"
          :data-trend="isUp ? 'up' : isDown ? 'down' : undefined"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="
            prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
          "
        >
          {{ change }}
        </motion.small>
      </AnimatePresence>
    </div>

    <div :class="styles.valueRow">
      <AnimatedCounter :value="value" :suffix="suffix" />
    </div>

    <p :class="styles.context">{{ context }}</p>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Check } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./progress.module.css";

export interface ProgressProps {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  max: 100,
  showValue: false,
});

const prefersReduced = useReducedMotion();
const safeMax = computed(() => (props.max > 0 ? props.max : 100));
const safeValue = computed(() =>
  Math.min(Math.max(props.value, 0), safeMax.value)
);
const percentage = computed(() =>
  Math.round((safeValue.value / safeMax.value) * 100)
);
const isComplete = computed(() => percentage.value >= 100);

const displayPercent = ref(percentage.value);

let rafId: number | null = null;
watch(percentage, (target) => {
  if (prefersReduced.value) {
    displayPercent.value = target;
    return;
  }
  const start = displayPercent.value;
  const startTime = performance.now();
  const duration = 400;

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    displayPercent.value = Math.round(start + (target - start) * ease);

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    }
  }

  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(step);
});
</script>

<template>
  <div
    :class="[styles.progress, props.class]"
    :data-complete="isComplete ? '' : undefined"
    role="progressbar"
    :aria-label="label ?? 'Progress'"
    :aria-valuemin="0"
    :aria-valuemax="safeMax"
    :aria-valuenow="safeValue"
    :aria-valuetext="`${percentage}%`"
  >
    <div v-if="label || showValue" :class="styles.meta">
      <span v-if="label" :class="styles.label">
        <AnimatePresence mode="popLayout" :initial="false">
          <motion.span
            :key="label"
            :class="styles.line"
            :initial="prefersReduced ? { opacity: 0 } : { opacity: 0, y: '0.3em', filter: `blur(${motionTokens.blur.soft}px)` }"
            :animate="{ opacity: 1, y: '0em', filter: 'blur(0px)' }"
            :exit="prefersReduced ? { opacity: 0 } : { opacity: 0, y: '-0.3em', filter: `blur(${motionTokens.blur.subtle}px)` }"
            :transition="{
              duration: prefersReduced ? 0 : motionTokens.duration.standard,
              ease: [...motionTokens.ease.enter],
            }"
          >
            {{ label }}
          </motion.span>
        </AnimatePresence>
      </span>
      <span v-else />

      <span v-if="showValue" :class="styles.value">
        <AnimatePresence :initial="false">
          <motion.span
            v-if="isComplete"
            key="done"
            :class="styles.done"
            :initial="prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: `blur(${motionTokens.blur.subtle}px)` }"
            :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
            :exit="{ opacity: 0, scale: 0.6 }"
            :transition="
              prefersReduced
                ? { duration: 0 }
                : { ...motionTokens.spring.snappy, delay: 0.15 }
            "
          >
            <Check :size="14" :stroke-width="2" aria-hidden="true" />
          </motion.span>
        </AnimatePresence>
        <span :class="styles.count">{{ displayPercent }}%</span>
      </span>
    </div>

    <div :class="styles.track">
      <motion.span
        :class="styles.fill"
        :animate="{ x: `${percentage - 100}%` }"
        :transition="
          prefersReduced ? { duration: 0 } : motionTokens.spring.smooth
        "
      />
    </div>
  </div>
</template>

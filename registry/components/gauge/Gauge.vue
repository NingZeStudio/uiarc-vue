<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./gauge.module.css";

export type GaugeTone = "accent" | "success" | "warning" | "danger";

export interface GaugeThreshold {
  from: number;
  tone: GaugeTone;
  label: string;
}

export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  detail?: string;
  tone?: GaugeTone;
  thresholds?: GaugeThreshold[];
  class?: any;
}

const props = withDefaults(defineProps<GaugeProps>(), {
  min: 0,
  max: 100,
  tone: "accent",
});

const prefersReduced = useReducedMotion();
const safeMax = computed(() => (props.max > props.min ? props.max : props.min + 1));
const percentage = computed(() =>
  Math.min(1, Math.max(0, (props.value - props.min) / (safeMax.value - props.min)))
);
const displayValue = computed(() => Math.round(percentage.value * 100));

const radius = 42;
const startAngle = -135;
const spanAngle = 270;

function arcFor(sweep: number) {
  const end = startAngle + spanAngle * Math.min(1, Math.max(0, sweep));
  const at = (angle: number) =>
    `${(50 + radius * Math.sin((angle * Math.PI) / 180)).toFixed(3)} ${(
      50 -
      radius * Math.cos((angle * Math.PI) / 180)
    ).toFixed(3)}`;
  return `M ${at(startAngle)} A ${radius} ${radius} 0 ${
    end - startAngle > 180 ? 1 : 0
  } 1 ${at(end)}`;
}

const trackD = arcFor(1);
const fillD = computed(() => arcFor(percentage.value));

const activeTone = computed(() => {
  if (!props.thresholds || props.thresholds.length === 0) return props.tone;
  const sorted = [...props.thresholds].sort((a, b) => a.from - b.from);
  const match = sorted.filter((t) => props.value >= t.from).pop();
  return match?.tone || props.tone;
});
</script>

<template>
  <div :class="[styles.gauge, styles[activeTone], props.class]">
    <div :class="styles.visual">
      <svg
        viewBox="0 0 100 100"
        :class="styles.svg"
        fill="none"
        stroke-linecap="round"
      >
        <!-- Background Track -->
        <path :d="trackD" :class="styles.track" stroke-width="8" />

        <!-- Dynamic Value Arc -->
        <motion.path
          :d="fillD"
          :class="styles.fill"
          stroke-width="8"
          :initial="prefersReduced ? false : { pathLength: 0 }"
          :animate="{ pathLength: 1 }"
          :transition="
            prefersReduced ? { duration: 0 } : motionTokens.spring.smooth
          "
        />
      </svg>

      <div :class="styles.centerText">
        <span :class="styles.number">{{ displayValue }}</span>
        <span :class="styles.unit">%</span>
      </div>
    </div>

    <div :class="styles.meta">
      <h4 :class="styles.label">{{ label }}</h4>
      <p v-if="detail" :class="styles.detail">{{ detail }}</p>
    </div>
  </div>
</template>

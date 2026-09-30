<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./animated-counter.module.css";

export interface AnimatedCounterProps {
  value: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
}

const props = withDefaults(defineProps<AnimatedCounterProps>(), {
  decimals: 0,
  locale: "en-US",
});

const prefersReduced = useReducedMotion();

const formattedParts = computed(() => {
  const formatter = new Intl.NumberFormat(props.locale, {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
    useGrouping: true,
  });

  const parts = formatter.formatToParts(props.value);
  let place = parts.reduce(
    (count, part) => count + (part.type === "integer" ? part.value.length : 0),
    0
  );
  let fraction = 0;

  return parts.flatMap((part, index) => {
    if (part.type === "integer") {
      return [...part.value].map((char) => ({
        key: `i-${--place}-${char}`,
        char,
        isDigit: true,
      }));
    }
    if (part.type === "fraction") {
      return [...part.value].map((char) => ({
        key: `f-${fraction++}-${char}`,
        char,
        isDigit: true,
      }));
    }
    return [
      {
        key: `sym-${part.type}-${index}`,
        char: part.value,
        isDigit: false,
      },
    ];
  });
});

const digitVariants = {
  enter: {
    y: "0.5em",
    opacity: 0,
    filter: `blur(${motionTokens.blur.soft}px)`,
  },
  center: {
    y: "0em",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      ...motionTokens.spring.snappy,
    },
  },
  exit: {
    y: "-0.5em",
    opacity: 0,
    filter: `blur(${motionTokens.blur.soft}px)`,
    transition: {
      duration: motionTokens.duration.fast,
      ease: [...motionTokens.ease.standard],
    },
  },
};
</script>

<template>
  <div :class="styles.counter">
    <span v-if="label" :class="styles.label">{{ label }}</span>

    <span :class="styles.value">
      <span v-if="prefix" :class="styles.affix">{{ prefix }}</span>

      <template v-for="item in formattedParts" :key="item.key">
        <span v-if="item.isDigit" :class="styles.column">
          <span :class="styles.sizer">0</span>
          <AnimatePresence mode="popLayout" :initial="false">
            <motion.span
              :key="item.char"
              :class="styles.glyph"
              :variants="prefersReduced ? undefined : digitVariants"
              initial="enter"
              animate="center"
              exit="exit"
            >
              {{ item.char }}
            </motion.span>
          </AnimatePresence>
        </span>
        <span v-else :class="styles.symbol">{{ item.char }}</span>
      </template>

      <span v-if="suffix" :class="styles.affix">{{ suffix }}</span>
    </span>
  </div>
</template>

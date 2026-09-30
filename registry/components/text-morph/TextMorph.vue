<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./text-morph.module.css";

export interface TextMorphProps {
  text?: string;
  as?: "span" | "div" | "p" | "strong" | "h1" | "h2" | "h3";
  class?: any;
}

const props = withDefaults(defineProps<TextMorphProps>(), {
  as: "span",
  text: "",
});

const prefersReduced = useReducedMotion();

const glyphs = computed(() => {
  const seen = new Map<string, number>();
  return Array.from(props.text).map((char) => {
    const count = seen.get(char) ?? 0;
    seen.set(char, count + 1);
    return { char, key: `${char}-${count}` };
  });
});
</script>

<template>
  <component :is="as" :class="[styles.morph, props.class]">
    <span :class="styles.track">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          v-for="(glyph, idx) in glyphs"
          :key="glyph.key"
          :class="styles.glyph"
          :initial="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: 4, filter: `blur(${motionTokens.blur.soft}px)` }
          "
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : { opacity: 0, y: -4, filter: `blur(${motionTokens.blur.subtle}px)` }
          "
          :transition="{
            duration: prefersReduced ? 0 : motionTokens.duration.standard,
            ease: [...motionTokens.ease.enter],
            delay: idx * motionTokens.stagger.char,
          }"
        >
          {{ glyph.char }}
        </motion.span>
      </AnimatePresence>
    </span>
  </component>
</template>

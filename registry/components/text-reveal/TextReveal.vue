<script setup lang="ts">
import { computed, type CSSProperties } from "vue";
import { motionTokens } from "@/registry/motion-tokens";
import styles from "./text-reveal.module.css";

export interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  class?: any;
}

const props = withDefaults(defineProps<TextRevealProps>(), {
  as: "h2",
  delay: 0,
});

const MAX_STAGGER = motionTokens.duration.considered;

const lines = computed(() =>
  props.text.split("\n").map((line) => line.split(" ").filter(Boolean))
);

const totalWordCount = computed(() =>
  lines.value.reduce((total, words) => total + words.length, 0)
);

const step = computed(() =>
  Math.min(
    motionTokens.stagger.word,
    MAX_STAGGER / Math.max(totalWordCount.value, 1)
  )
);

const blurAmount = computed(() =>
  props.as === "p" ? motionTokens.blur.soft : motionTokens.blur.text
);
</script>

<template>
  <component
    :is="as"
    :class="[styles.reveal, props.class]"
    :style="{ '--reveal-blur': `${blurAmount}px` } as CSSProperties"
  >
    <span :class="styles.srOnly">{{ text.replace(/\n/g, ' ') }}</span>
    <template v-for="(words, lineIndex) in lines" :key="lineIndex">
      <span :class="styles.line" aria-hidden="true">
        <template v-for="(word, wordIndex) in words" :key="`${word}-${wordIndex}`">
          <span :class="styles.clip">
            <span
              :class="styles.word"
              :style="{
                '--reveal-delay': `${delay + (lineIndex * words.length + wordIndex) * step}s`,
              } as CSSProperties"
            >
              {{ word }}
            </span>
          </span>
          <span v-if="wordIndex < words.length - 1">&nbsp;</span>
        </template>
      </span>
      <span v-if="lineIndex < lines.length - 1"><br /></span>
    </template>
  </component>
</template>

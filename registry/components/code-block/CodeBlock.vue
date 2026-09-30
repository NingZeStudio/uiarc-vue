<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./copy-button.module.css";



interface CodeBlockProps {
  /** Source shown in the block and copied by the action. */
  code: string;
  /** File name displayed in the header. */
  filename?: string;
  /** Used for the header label and lightweight syntax highlighting. */
  language?: string;
  /** Collapse longer sources to this many lines, with a toggle that expands the rest in place. */
  maxLines?: number;
}

const props = withDefaults(defineProps<CodeBlockProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.code_block || '']">
    <slot />
  </div>
</template>

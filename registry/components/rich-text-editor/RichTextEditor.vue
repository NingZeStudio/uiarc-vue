<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./rich-text-editor.module.css";

export type BlockType = "p" | "h1" | "h2" | "h3" | "ul" | "ol" | "blockquote" | "pre" | "hr";

interface RichTextEditorProps {
  /** Controlled HTML. The editor only rewrites its content when this differs from what it last emitted. */
  value?: string;
  defaultValue?: string;
  /** Initial content as Markdown, used when no HTML value is given. */
  defaultMarkdown?: string;
  onChange?: (value: RichTextValue) => void;
  /** Reports whether undo and redo are available, for your own toolbar. */
  onHistoryChange?: (state: { canUndo: boolean; canRedo: boolean }

const props = withDefaults(defineProps<RichTextEditorProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.rich_text_editor || '']">
    <slot />
  </div>
</template>

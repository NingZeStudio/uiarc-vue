<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./file-upload.module.css";

export type FileUploadItem = { id: string;

interface FileUploadProps {
  accept?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  multiple?: boolean;
  maxSize?: number;
  value?: FileUploadItem[];
  onChange?: (files: FileUploadItem[]) => void;
  /** Uploads each accepted file. Report progress from 0 to 100, resolve when done, or reject to mark the file as failed. Removing a file aborts its signal. */
  onUpload?: (file: File, options: { onProgress: (percent: number) => void; signal: AbortSignal }

const props = withDefaults(defineProps<FileUploadProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.file_upload || '']">
    <slot />
  </div>
</template>

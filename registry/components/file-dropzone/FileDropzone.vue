<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./file-dropzone.module.css";

export type FileDropzoneStatus = "uploading" | "uploaded" | "failed";
export type FileDropzoneItem = { id: string;
export type FileDropzoneUpload = (item: FileDropzoneItem, options: { onProgress: (percent: number) => void;
export type FileDropzoneProps = {
  accept?: string;

interface FileDropzoneProps {
  class?: any;
}

const props = withDefaults(defineProps<FileDropzoneProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.file_dropzone || '']">
    <slot />
  </div>
</template>

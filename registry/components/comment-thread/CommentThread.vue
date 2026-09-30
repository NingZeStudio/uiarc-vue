<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./comment-thread.module.css";



interface CommentThreadProps {
  comments?: ThreadComment[];
  defaultComments?: ThreadComment[];
  onCommentsChange?: (comments: ThreadComment[], event: CommentThreadEvent) => void;
  /** The person writing. Their comments can be edited and deleted. */
  currentUser: CommentAuthor;
  /** People who can be mentioned. Defaults to everyone in the thread. */
  people?: CommentAuthor[];
  resolved?: boolean;
  defaultResolved?: boolean;
  onResolvedChange?: (resolved: boolean) => void;
  /** What the thread is about, shown in its header, such as "Hero headline". */
  title?: ReactNode;
  /** Emoji offered by the reaction picker. */
  reactions?: string[];
  placeholder?: string;
  /** Replies deeper than this attach to the deepest allowed parent. Defaults to 2. */
  maxDepth?: number;
  /** Label for comments written now. */
  nowLabel?: string;
  className?: string;
}

const props = withDefaults(defineProps<CommentThreadProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.comment_thread || '']">
    <slot />
  </div>
</template>

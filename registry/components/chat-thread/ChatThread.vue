<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./chat-thread.module.css";

export type ChatMessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

interface ChatThreadProps {
  participants: ChatParticipant[];
  currentUserId: string;
  /** Controlled messages, oldest first. Leave it out to let the thread keep its own list. */
  messages?: ChatMessage[];
  defaultMessages?: ChatMessage[];
  /** Participant ids currently typing. */
  typing?: string[];
  /** The last message each participant has read, by participant id. Their avatar sits under that message and glides as it moves. */
  readBy?: Record<string, string>;
  /** Called with the composer's text and files. Uncontrolled threads also append the message themselves. */
  onSend?: (draft: ChatDraft) => void | Promise<void>;
  onReact?: (messageId: string, emoji: string) => void;
  onRetry?: (messageId: string) => void;
  /** Emoji offered by the reaction picker. */
  reactions?: string[];
  placeholder?: string;
  /** Show the composer. Defaults to true. */
  composer?: boolean;
  allowAttachments?: boolean;
  /** File types the attach button offers, as for `<input accept>`. */
  accept?: string;
  /** Messages from one person closer together than this, in ms, share a group. Defaults to five minutes. */
  groupWindow?: number;
  locale?: string;
  /** Accessible name of the message log. */
  label?: string;
  className?: string;
}

const props = withDefaults(defineProps<ChatThreadProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.chat_thread || '']">
    <slot />
  </div>
</template>

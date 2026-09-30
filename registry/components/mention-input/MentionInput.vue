<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./mention-input.module.css";

export type MentionKind = "person" | "channel";

interface MentionInputProps {
  value?: MentionValue;
  defaultValue?: MentionValue;
  onChange?: (value: MentionValue) => void;
  /** People offered after `@`. Leave it out to turn person mentions off. */
  people?: MentionPerson[];
  /** Channels offered after `#`. Leave it out to turn channel mentions off. */
  channels?: MentionChannel[];
  /** Called when a suggestion becomes a mention. */
  onMentionAdd?: (mention: Mention) => void;
  /** With `submitOnEnter`, Enter submits and Shift+Enter adds a line. */
  onSubmit?: (value: MentionValue) => void;
  submitOnEnter?: boolean;
  placeholder?: string;
  minRows?: number;
  /** The field grows to this many rows, then scrolls. */
  maxRows?: number;
  /** Where suggestions open. `auto` flips above when there is no room below. */
  placement?: "auto" | "top" | "bottom";
  maxSuggestions?: number;
  disabled?: boolean;
  name?: string;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
}

const props = withDefaults(defineProps<MentionInputProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.mention_input || '']">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./announcement-bar.module.css";



interface AnnouncementBarProps {
  messages: Announcement[];
  /** Remembers dismissal under this id. Change the id to show a new campaign to everyone again. */
  id?: string;
  /** Whether the bar is shown. Leave it out to let the component manage it. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Index of the visible message. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Milliseconds each message stays before the next one. Defaults to 6000. */
  interval?: number;
  /** Rotate automatically. Pauses on hover, focus, or a hidden tab, and is turned off when the visitor prefers reduced motion. Defaults to true. */
  autoPlay?: boolean;
  /** Show previous, next, and pause controls when there are several messages. Defaults to false: only the close button shows. */
  controls?: boolean;
  dismissible?: boolean;
  tone?: "neutral" | "inverted";
  onAction?: (announcement: Announcement) => void;
  onCountdownEnd?: (announcement: Announcement) => void;
  /** Accessible name of the region. */
  label?: string;
  className?: string;
}

const props = withDefaults(defineProps<AnnouncementBarProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.announcement_bar || '']">
    <slot />
  </div>
</template>

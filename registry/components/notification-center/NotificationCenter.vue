<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./avatar.module.css";



interface NotificationCenterProps {
  notifications: NotificationItem[];
  label?: string;
  onReadChange?: (notification: NotificationItem, read: boolean) => void;
  onDismiss?: (notification: NotificationItem) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  avoidCollisions?: boolean;
}

const props = withDefaults(defineProps<NotificationCenterProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.notification_center || '']">
    <slot />
  </div>
</template>

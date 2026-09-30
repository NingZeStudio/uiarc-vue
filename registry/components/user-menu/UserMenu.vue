<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./user-menu.module.css";

export type UserStatus = "available" | "busy" | "away";
export type ThemePreference = "light" | "dark" | "system";

interface UserMenuProps {
  user: UserMenuUser;
  /** Presence status. Passing `status` or `onStatusChange` shows the presence dot and an inline status switch. */
  status?: UserStatus;
  defaultStatus?: UserStatus;
  onStatusChange?: (status: UserStatus) => void;
  theme?: ThemePreference;
  defaultTheme?: ThemePreference;
  /** Reports the choice. Applying it to the page is up to the app. */
  onThemeChange?: (theme: ThemePreference) => void;
  /** Shows the inline light, dark, and system switch. */
  showTheme?: boolean;
  /** Account destinations with optional shortcut hints, such as ["⌘", ","]. Keep it to three or four. */
  items?: UserMenuItem[];
  onSignOut?: () => void | Promise<unknown>;
  signOutKeys?: string[];
  align?: "start" | "center" | "end";
  /** Shows the name and a chevron beside the avatar from 640px up. */
  showName?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Renders the desktop panel in a portal on the body. Pass false to keep it inside the trigger's wrapper. */
  portal?: boolean;
  /** The trigger button, for returning focus after the menu is swapped out. */
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

const props = withDefaults(defineProps<UserMenuProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.user_menu || '']">
    <slot />
  </div>
</template>

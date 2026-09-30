<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./filter-toolbar.module.css";



interface FilterMenuProps {
  fields: FilterField[];
  /** Receives a chip whose id is the field id, so a second pick for a field replaces the first. */
  onSelect: (filter: FilterChip, field: FilterField) => void;
  /** Applied filters. Each field shows its current value and the value step marks it. */
  active?: FilterChip[];
  label?: string;
  /** The trigger edge the panel lines up with. It flips or shifts when the viewport, or a clipping ancestor, has no room. */
  align?: "start" | "end";
}

const props = withDefaults(defineProps<FilterToolbarProps>(), {});
const emit = defineEmits<{
  (e: "change", val: any): void;
}>();

const prefersReduced = useReducedMotion();
</script>

<template>
  <div :class="[styles?.root || styles?.container || styles?.filter_toolbar || '']">
    <slot />
  </div>
</template>

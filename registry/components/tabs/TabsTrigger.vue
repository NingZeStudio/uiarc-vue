<script setup lang="ts">
import { inject, computed, onMounted, type Ref } from "vue";
import { motion } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./tabs.module.css";

interface TabsContextType {
  active: Ref<string>;
  direction: Ref<number>;
  updateActive: (val: string) => void;
  registerTab: (val: string) => void;
}

const props = defineProps<{
  value: string;
  class?: any;
}>();

const prefersReduced = useReducedMotion();
const context = inject<TabsContextType>("tabsContext");

onMounted(() => {
  context?.registerTab(props.value);
});

const isSelected = computed(() => context?.active.value === props.value);

function handleClick() {
  context?.updateActive(props.value);
}
</script>

<template>
  <button
    type="button"
    role="tab"
    :aria-selected="isSelected"
    :data-state="isSelected ? 'active' : 'inactive'"
    :class="[styles.trigger, props.class]"
    @click="handleClick"
  >
    <motion.span
      v-if="isSelected"
      :class="styles.selection"
      layout-id="tab-selection"
      :transition="
        prefersReduced ? { duration: 0 } : motionTokens.spring.morph
      "
      aria-hidden="true"
    />
    <span :class="styles.triggerLabel">
      <slot />
    </span>
  </button>
</template>

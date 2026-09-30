<script setup lang="ts">
import { ref, provide, watch, computed } from "vue";
import styles from "./tabs.module.css";

export interface TabsProps {
  modelValue?: string;
  defaultValue?: string;
  class?: any;
}

const props = withDefaults(defineProps<TabsProps>(), {
  defaultValue: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "change", val: string): void;
}>();

const internalValue = ref(props.modelValue ?? props.defaultValue);
const direction = ref(1);
const tabOrder = ref<string[]>([]);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== internalValue.value) {
      updateActive(val);
    }
  }
);

function registerTab(value: string) {
  if (!tabOrder.value.includes(value)) {
    tabOrder.value.push(value);
    if (!internalValue.value) {
      internalValue.value = value;
    }
  }
}

function updateActive(next: string) {
  const from = tabOrder.value.indexOf(internalValue.value);
  const to = tabOrder.value.indexOf(next);
  if (from >= 0 && to >= 0 && from !== to) {
    direction.value = to > from ? 1 : -1;
  }
  internalValue.value = next;
  emit("update:modelValue", next);
  emit("change", next);
}

provide("tabsContext", {
  active: internalValue,
  direction,
  updateActive,
  registerTab,
});
</script>

<template>
  <div :class="[styles.root, props.class]">
    <slot />
  </div>
</template>

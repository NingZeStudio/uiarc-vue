<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./switch.module.css";

export interface SwitchProps {
  modelValue?: boolean;
  disabled?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "change", val: boolean): void;
}>();

const prefersReduced = useReducedMotion();
const travelDistance = 18;

const isChecked = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit("update:modelValue", val);
    emit("change", val);
  },
});

const toggle = () => {
  if (props.disabled) return;
  isChecked.value = !isChecked.value;
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    toggle();
  }
};
</script>

<template>
  <button
    type="button"
    role="switch"
    :class="styles.switch"
    :aria-checked="isChecked"
    :data-state="isChecked ? 'checked' : 'unchecked'"
    :disabled="disabled"
    @click="toggle"
    @keydown="handleKeyDown"
  >
    <span :class="styles.track">
      <!-- 物理质感平滑滑动的圆形 Thumb，并在滑动瞬间发生微拉伸 -->
      <motion.span
        :class="styles.thumb"
        :animate="
          prefersReduced
            ? { x: isChecked ? travelDistance : 0 }
            : {
                x: isChecked ? travelDistance : 0,
                scaleX: [1, 1.15, 1],
              }
        "
        :transition="{
          type: 'spring',
          stiffness: 500,
          damping: 34,
          scaleX: { duration: 0.28, ease: [...motionTokens.ease.standard] },
        }"
      />
    </span>

    <span v-if="label || $slots.default" :class="styles.label">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

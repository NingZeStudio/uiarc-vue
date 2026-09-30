<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./checkbox.module.css";

export type CheckedState = boolean | "indeterminate";

export interface CheckboxProps {
  modelValue?: CheckedState;
  disabled?: boolean;
  label?: string;
  description?: string;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: CheckedState): void;
  (e: "change", val: CheckedState): void;
}>();

const prefersReduced = useReducedMotion();

const isChecked = computed({
  get: () => props.modelValue,
  set: (val: CheckedState) => {
    emit("update:modelValue", val);
    emit("change", val);
  },
});

const isOn = computed(() => isChecked.value !== false);
const isIndeterminate = computed(() => isChecked.value === "indeterminate");

const checkPath = "M4.25 9.25 L7.25 12.25 L13.75 5.75";
const dashPath = "M4.75 9 L9 9 L13.25 9";

const toggle = () => {
  if (props.disabled) return;
  if (isChecked.value === false) {
    isChecked.value = true;
  } else {
    isChecked.value = false;
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    toggle();
  }
};
</script>

<template>
  <label
    :class="styles.field"
    :data-disabled="disabled ? 'true' : undefined"
    @click.prevent="toggle"
  >
    <button
      type="button"
      role="checkbox"
      :class="styles.box"
      :aria-checked="isIndeterminate ? 'mixed' : isOn"
      :disabled="disabled"
      @keydown="handleKeyDown"
    >
      <motion.span
        :class="styles.visual"
        :while-tap="
          disabled
            ? undefined
            : {
                scale: 0.9,
                transition: { duration: motionTokens.duration.instant },
              }
        "
      >
        <!-- 激活时的背景填充色平滑显现 -->
        <AnimatePresence>
          <motion.span
            v-if="isOn"
            :class="styles.fill"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: motionTokens.duration.instant }"
          />
        </AnimatePresence>

        <!-- 矢量对勾动态绘制路径 -->
        <svg
          :class="styles.mark"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <motion.path
            v-if="isOn"
            :d="isIndeterminate ? dashPath : checkPath"
            :initial="prefersReduced ? { opacity: 1 } : { pathLength: 0, opacity: 0 }"
            :animate="prefersReduced ? { opacity: 1 } : { pathLength: 1, opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{
              pathLength: { duration: 0.22, ease: [...motionTokens.ease.standard] },
              opacity: { duration: motionTokens.duration.instant },
            }"
          />
        </svg>
      </motion.span>
    </button>

    <span v-if="label || description || $slots.default" :class="styles.labelWrapper">
      <span v-if="label || $slots.default" :class="styles.label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="description" :class="styles.description">
        {{ description }}
      </span>
    </span>
  </label>
</template>

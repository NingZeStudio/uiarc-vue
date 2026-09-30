<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./textarea.module.css";

export interface TextareaProps {
  modelValue?: string;
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  class?: any;
}

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: "",
  rows: 3,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "change", e: Event): void;
}>();

const prefersReduced = useReducedMotion();
const isFocused = ref(false);

function handleInput(event: Event) {
  const val = (event.target as HTMLTextAreaElement).value;
  emit("update:modelValue", val);
}
</script>

<template>
  <div :class="[styles.field, props.class]">
    <label v-if="label" :class="styles.label">{{ label }}</label>
    <div
      :class="styles.shell"
      :data-focused="isFocused ? '' : undefined"
      :data-error="error ? '' : undefined"
      :data-disabled="disabled ? '' : undefined"
    >
      <textarea
        :class="styles.textarea"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @input="handleInput"
      />
    </div>

    <!-- Description or Error message with spring open height and subtle blur -->
    <AnimatePresence>
      <motion.div
        v-if="error || description"
        :key="error ? 'err' : 'desc'"
        :class="styles.messageSlot"
        :initial="
          prefersReduced
            ? false
            : { height: 0, opacity: 0 }
        "
        :animate="{ height: 'auto', opacity: 1 }"
        :exit="{
          height: 0,
          opacity: 0,
          transition: prefersReduced
            ? { duration: 0 }
            : {
                height: motionTokens.spring.smooth,
                opacity: { duration: motionTokens.duration.instant },
              },
        }"
        :transition="
          prefersReduced
            ? { duration: 0 }
            : {
                height: motionTokens.spring.smooth,
                opacity: { duration: motionTokens.duration.fast },
              }
        "
      >
        <span
          :class="[styles.message, error ? styles.error : styles.hint]"
          :role="error ? 'alert' : undefined"
        >
          {{ error || description }}
        </span>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

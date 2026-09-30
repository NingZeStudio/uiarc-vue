<script setup lang="ts">
import { ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./password-field.module.css";

export interface PasswordFieldProps {
  modelValue?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<PasswordFieldProps>(), {
  modelValue: "",
  label: "Password",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
}>();

const prefersReduced = useReducedMotion();
const visible = ref(false);
const toggled = ref(false);

function toggleVisible() {
  visible.value = !visible.value;
  toggled.value = true;
}

function handleInput(event: Event) {
  const val = (event.target as HTMLInputElement).value;
  emit("update:modelValue", val);
}
</script>

<template>
  <div :class="[styles.field, props.class]">
    <label v-if="label" :class="styles.label">{{ label }}</label>
    <div :class="styles.shell">
      <input
        :type="visible ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="styles.input"
        :data-reveal="toggled ? (visible ? 'shown' : 'hidden') : undefined"
        @input="handleInput"
      />
      <button
        type="button"
        :class="styles.toggle"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        :aria-pressed="visible"
        @click="toggleVisible"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
          />
          <circle cx="12" cy="12" r="3" />
          <motion.path
            d="M2 2l20 20"
            :initial="false"
            :animate="{
              pathLength: visible ? 1 : 0,
              opacity: visible ? 1 : 0,
            }"
            :transition="
              prefersReduced
                ? { duration: 0 }
                : {
                    pathLength: {
                      duration: motionTokens.duration.standard,
                      ease: [...motionTokens.ease.standard],
                    },
                    opacity: { duration: motionTokens.duration.instant },
                  }
            "
          />
        </svg>
      </button>
    </div>

    <!-- Description or Hint -->
    <AnimatePresence>
      <motion.div
        v-if="description"
        :class="styles.messageSlot"
        :initial="{ height: 0, opacity: 0 }"
        :animate="{ height: 'auto', opacity: 1 }"
        :exit="{ height: 0, opacity: 0 }"
      >
        <span :class="styles.hint">{{ description }}</span>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

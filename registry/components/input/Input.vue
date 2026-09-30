<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./input.module.css";

export interface InputProps {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  type?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: "",
  type: "text",
  disabled: false,
  clearable: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "clear"): void;
}>();

const prefersReduced = useReducedMotion();

const currentValue = computed({
  get: () => String(props.modelValue ?? ""),
  set: (val: string) => emit("update:modelValue", val),
});

const handleClear = () => {
  currentValue.value = "";
  emit("clear");
};

const messageVariants = {
  enter: {
    opacity: 0,
    y: "0.3em",
    filter: `blur(${motionTokens.blur.soft}px)`,
  },
  center: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: {
      duration: motionTokens.duration.fast,
      ease: [...motionTokens.ease.enter],
    },
  },
  exit: {
    opacity: 0,
    y: "-0.2em",
    filter: `blur(${motionTokens.blur.subtle}px)`,
    transition: {
      duration: motionTokens.duration.instant,
    },
  },
};
</script>

<template>
  <div :class="styles.field">
    <label v-if="label" :class="styles.label">{{ label }}</label>

    <div :class="styles.inputWrapper">
      <span v-if="$slots.prefix" :class="styles.prefix">
        <slot name="prefix" />
      </span>

      <input
        v-model="currentValue"
        :type="type"
        :class="[
          styles.input,
          $slots.prefix && styles.hasPrefix,
          ($slots.suffix || (clearable && currentValue)) && styles.hasSuffix,
        ]"
        :placeholder="placeholder"
        :disabled="disabled"
        :data-invalid="!!error || undefined"
      />

      <!-- 一键清空微动效按钮 -->
      <AnimatePresence>
        <motion.button
          v-if="clearable && currentValue && !disabled"
          type="button"
          :class="styles.clearButton"
          aria-label="Clear input"
          :initial="{ opacity: 0, scale: 0.7 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.7 }"
          :transition="{ duration: motionTokens.duration.instant }"
          @click="handleClear"
        >
          <X :size="12" />
        </motion.button>
      </AnimatePresence>

      <span v-if="$slots.suffix && !(clearable && currentValue)" :class="styles.suffix">
        <slot name="suffix" />
      </span>
    </div>

    <!-- 描述与错误提示微动效行 -->
    <div v-if="error || description" :class="styles.messageRow">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          v-if="error"
          key="error"
          :class="styles.error"
          :variants="prefersReduced ? undefined : messageVariants"
          initial="enter"
          animate="center"
          exit="exit"
        >
          {{ error }}
        </motion.span>
        <motion.span
          v-else-if="description"
          key="desc"
          :class="styles.description"
          :variants="prefersReduced ? undefined : messageVariants"
          initial="enter"
          animate="center"
          exit="exit"
        >
          {{ description }}
        </motion.span>
      </AnimatePresence>
    </div>
  </div>
</template>

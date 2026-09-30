<script setup lang="ts">
import { ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Search, X as Xmark } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./search-field.module.css";

export interface SearchFieldProps {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<SearchFieldProps>(), {
  modelValue: "",
  label: "Search",
  placeholder: "Search...",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "clear"): void;
}>();

const prefersReduced = useReducedMotion();
const inputRef = ref<HTMLInputElement | null>(null);

function handleInput(event: Event) {
  const val = (event.target as HTMLInputElement).value;
  emit("update:modelValue", val);
}

function clear() {
  emit("update:modelValue", "");
  emit("clear");
  inputRef.value?.focus();
}
</script>

<template>
  <div :class="[styles.field, props.class]">
    <label v-if="label" :class="styles.label">{{ label }}</label>
    <div :class="styles.shell" :data-filled="modelValue ? 'true' : undefined">
      <Search :size="16" :class="styles.searchIcon" aria-hidden="true" />
      <input
        ref="inputRef"
        type="search"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="styles.input"
        @input="handleInput"
      />
      <span :class="styles.clearSlot">
        <AnimatePresence :initial="false">
          <motion.button
            v-if="modelValue"
            key="clear"
            type="button"
            :class="styles.clearButton"
            aria-label="Clear search"
            :initial="
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.8, filter: `blur(${motionTokens.blur.subtle}px)` }
            "
            :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
            :exit="
              prefersReduced
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.8,
                    filter: `blur(${motionTokens.blur.subtle}px)`,
                    transition: {
                      duration: motionTokens.duration.instant,
                      ease: [...motionTokens.ease.standard],
                    },
                  }
            "
            :transition="
              prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
            "
            @click="clear"
          >
            <Xmark :size="14" aria-hidden="true" />
          </motion.button>
        </AnimatePresence>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./radio-group.module.css";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  modelValue?: string;
  name?: string;
  class?: any;
}

const props = defineProps<RadioGroupProps>();
const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "change", val: string): void;
}>();

const prefersReduced = useReducedMotion();

function select(val: string) {
  emit("update:modelValue", val);
  emit("change", val);
}
</script>

<template>
  <fieldset :class="[styles.group, props.class]">
    <legend :class="styles.legend">{{ label }}</legend>
    <div :class="styles.options">
      <label
        v-for="opt in options"
        :key="opt.value"
        :class="[
          styles.option,
          modelValue === opt.value ? styles.selected : undefined,
        ]"
        @click="select(opt.value)"
      >
        <motion.span
          v-if="modelValue === opt.value"
          :class="styles.highlight"
          layout-id="radio-highlight"
          :transition="
            prefersReduced ? { duration: 0 } : motionTokens.spring.morph
          "
          aria-hidden="true"
        />

        <input
          type="radio"
          :name="name || label"
          :value="opt.value"
          :checked="modelValue === opt.value"
          :class="styles.input"
        />

        <span :class="styles.mark" aria-hidden="true">
          <motion.span
            :class="styles.dot"
            :animate="{
              scale: modelValue === opt.value ? 1 : 0.4,
              opacity: modelValue === opt.value ? 1 : 0,
            }"
            :transition="
              prefersReduced ? { duration: 0 } : motionTokens.spring.snappy
            "
          />
        </span>

        <span :class="styles.content">
          <strong :class="styles.optLabel">{{ opt.label }}</strong>
          <small v-if="opt.description" :class="styles.optDesc">
            {{ opt.description }}
          </small>
        </span>
      </label>
    </div>
  </fieldset>
</template>

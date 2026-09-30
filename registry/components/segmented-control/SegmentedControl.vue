<script setup lang="ts">
import { ref } from "vue";
import { motion } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./segmented-control.module.css";

export interface Segment {
  value: string;
  label: string;
  accessory?: any;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  modelValue?: string;
  options: Segment[];
  label?: string;
  /** 全局唯一的 layoutId，用于区分多个分段组件 */
  id?: string;
}

const props = withDefaults(defineProps<SegmentedControlProps>(), {
  modelValue: "",
  label: "Segmented Control",
  id: "segment-control-thumb",
});

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "change", val: string): void;
}>();

const prefersReduced = useReducedMotion();
const trackRef = ref<HTMLDivElement | null>(null);

const selectOption = (opt: Segment) => {
  if (opt.disabled) return;
  emit("update:modelValue", opt.value);
  emit("change", opt.value);
};
</script>

<template>
  <div :class="styles.root" role="group" :aria-label="label">
    <div ref="trackRef" :class="styles.track">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        :class="styles.button"
        :data-selected="modelValue === opt.value || undefined"
        :aria-pressed="modelValue === opt.value"
        :disabled="opt.disabled"
        @click="selectOption(opt)"
      >
        <!-- 核心平滑共享滑块 (FLIP 物理弹簧变形) -->
        <motion.span
          v-if="modelValue === opt.value"
          :class="styles.selection"
          :layout-id="id"
          :transition="
            prefersReduced
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 480,
                  damping: 36,
                }
          "
        />

        <span :class="styles.label">
          <span>{{ opt.label }}</span>
          <span v-if="opt.accessory" :class="styles.accessory">
            {{ opt.accessory }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

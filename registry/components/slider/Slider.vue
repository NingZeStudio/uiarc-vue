<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./slider.module.css";

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps {
  modelValue?: number;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  marks?: (number | SliderMark)[];
  showValue?: boolean;
  disabled?: boolean;
  format?: (val: number) => string;
}

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  showValue: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: number): void;
  (e: "change", val: number): void;
}>();

const prefersReduced = useReducedMotion();
const trackRef = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);
const isHovered = ref(false);

const currentValue = computed({
  get: () => props.modelValue,
  set: (val: number) => {
    emit("update:modelValue", val);
    emit("change", val);
  },
});

const percentage = computed(() => {
  const span = props.max - props.min || 1;
  const clamped = Math.max(props.min, Math.min(props.max, currentValue.value));
  return ((clamped - props.min) / span) * 100;
});

const formattedValue = computed(() => {
  if (props.format) return props.format(currentValue.value);
  return String(currentValue.value);
});

const normalizedMarks = computed(() => {
  if (!props.marks) return [];
  const span = props.max - props.min || 1;
  return props.marks.map((m) => {
    const val = typeof m === "number" ? m : m.value;
    const lbl = typeof m === "number" ? undefined : m.label;
    const pos = ((val - props.min) / span) * 100;
    return { value: val, label: lbl, position: pos };
  });
});

const updateValueFromPointer = (clientX: number) => {
  if (!trackRef.value || props.disabled) return;
  const rect = trackRef.value.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const rawValue = props.min + ratio * (props.max - props.min);
  const steppedValue = Math.round((rawValue - props.min) / props.step) * props.step + props.min;
  const clamped = Math.max(props.min, Math.min(props.max, steppedValue));
  currentValue.value = Number(clamped.toFixed(2));
};

const handlePointerDown = (e: PointerEvent) => {
  if (props.disabled) return;
  isDragging.value = true;
  updateValueFromPointer(e.clientX);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
};

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return;
  updateValueFromPointer(e.clientX);
};

const onPointerUp = () => {
  isDragging.value = false;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
};

onUnmounted(() => {
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (props.disabled) return;
  let next = currentValue.value;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    next = Math.min(props.max, currentValue.value + props.step);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    next = Math.max(props.min, currentValue.value - props.step);
  } else if (e.key === "Home") {
    next = props.min;
  } else if (e.key === "End") {
    next = props.max;
  } else {
    return;
  }
  e.preventDefault();
  currentValue.value = Number(next.toFixed(2));
};
</script>

<template>
  <div
    :class="styles.field"
    :data-disabled="disabled ? 'true' : undefined"
  >
    <div v-if="label || showValue" :class="styles.head">
      <span v-if="label" :class="styles.label">{{ label }}</span>
      <span v-if="showValue" :class="styles.valueText">{{ formattedValue }}</span>
    </div>

    <div
      ref="trackRef"
      :class="styles.trackWrapper"
      @pointerdown="handlePointerDown"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div :class="styles.track">
        <!-- 填充高亮激活轨道 -->
        <div
          :class="styles.fill"
          :style="{ width: `${percentage}%` }"
        />

        <!-- 刻度点 -->
        <template v-for="mark in normalizedMarks" :key="mark.value">
          <span
            :class="styles.tick"
            :style="{ left: `${mark.position}%` }"
          />
        </template>
      </div>

      <!-- 可拖拽滑块 Thumb 与悬浮浮动气泡 -->
      <div
        :class="styles.thumbSlot"
        :style="{ left: `${percentage}%` }"
      >
        <button
          type="button"
          role="slider"
          :class="styles.thumb"
          :aria-valuenow="currentValue"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-label="label"
          :disabled="disabled"
          tabindex="0"
          @keydown="handleKeyDown"
        />

        <!-- 拖拽/悬浮时平滑弹出的气泡 Bubble -->
        <AnimatePresence>
          <motion.div
            v-if="isDragging || isHovered"
            :class="styles.bubble"
            :initial="{ opacity: 0, y: 4, scale: 0.85 }"
            :animate="{ opacity: 1, y: -10, scale: 1 }"
            :exit="{ opacity: 0, y: 2, scale: 0.85 }"
            :transition="{ duration: motionTokens.duration.instant }"
          >
            {{ formattedValue }}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
</template>

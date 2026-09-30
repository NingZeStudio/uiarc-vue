<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Plus, Minus } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./number-field.module.css";

export type NumberFieldSize = "sm" | "md" | "lg";

export interface NumberFieldProps {
  modelValue?: number;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  size?: NumberFieldSize;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<NumberFieldProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  size: "md",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: number): void;
  (e: "change", val: number): void;
}>();

const prefersReduced = useReducedMotion();
const controlRef = ref<HTMLElement | null>(null);
const limitMessage = ref<string | null>(null);
let limitTimer: any = null;

// 边界撞击反弹阻尼震颤动画触发器
const bumpKey = ref(0);
const bumpDirection = ref<"left" | "right">("right");

const currentValue = computed({
  get: () => props.modelValue,
  set: (val: number) => {
    emit("update:modelValue", val);
    emit("change", val);
  },
});

const isAtMin = computed(() => currentValue.value <= props.min);
const isAtMax = computed(() => currentValue.value >= props.max);

// 触发边界提示与弹簧反弹
const triggerLimitFeedback = (type: "min" | "max") => {
  bumpDirection.value = type === "max" ? "right" : "left";
  bumpKey.value++;
  limitMessage.value = type === "max" ? `Max ${props.max}` : `Min ${props.min}`;

  clearTimeout(limitTimer);
  limitTimer = setTimeout(() => {
    limitMessage.value = null;
  }, 1600);
};

const increment = () => {
  if (props.disabled) return;
  if (isAtMax.value) {
    triggerLimitFeedback("max");
    return;
  }
  const next = Math.min(props.max, currentValue.value + props.step);
  currentValue.value = Number(next.toFixed(2));
};

const decrement = () => {
  if (props.disabled) return;
  if (isAtMin.value) {
    triggerLimitFeedback("min");
    return;
  }
  const prev = Math.max(props.min, currentValue.value - props.step);
  currentValue.value = Number(prev.toFixed(2));
};

// 将当前数字拆分为各位数与符号，以驱动数字滚轮
const formattedDigits = computed(() => {
  const str = String(currentValue.value);
  return str.split("").map((char, index) => ({
    key: `col-${index}-${char}`,
    char,
    isDigit: /\d/.test(char),
  }));
});

// 数字轮盘位移动画参数
const digitVariants = {
  enter: {
    y: "0.4em",
    opacity: 0,
    filter: `blur(${motionTokens.blur.soft}px)`,
  },
  center: {
    y: "0em",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      ...motionTokens.spring.snappy,
    },
  },
  exit: {
    y: "-0.4em",
    opacity: 0,
    filter: `blur(${motionTokens.blur.soft}px)`,
    transition: {
      duration: motionTokens.duration.fast,
      ease: [...motionTokens.ease.standard],
    },
  },
};
</script>

<template>
  <div :class="styles.field" :data-size="size">
    <div v-if="label || limitMessage" :class="styles.head">
      <span v-if="label" :class="styles.label">{{ label }}</span>
      <AnimatePresence>
        <motion.span
          v-if="limitMessage"
          :class="styles.limit"
          :initial="{ opacity: 0, y: 2 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: -2 }"
          :transition="{ duration: motionTokens.duration.fast }"
        >
          {{ limitMessage }}
        </motion.span>
      </AnimatePresence>
    </div>

    <!-- 容器带有撞击边界时的微反弹动效 -->
    <motion.div
      ref="controlRef"
      :key="bumpKey"
      :class="styles.control"
      :data-warn="limitMessage ? 'true' : undefined"
      :animate="
        bumpKey === 0 || prefersReduced
          ? {}
          : {
              x: bumpDirection === 'right' ? [0, 5, -3, 1.5, 0] : [0, -5, 3, -1.5, 0],
              transition: { duration: 0.35, ease: [...motionTokens.ease.standard] },
            }
      "
    >
      <motion.button
        type="button"
        :class="styles.stepButton"
        :disabled="disabled || isAtMin"
        :while-tap="
          disabled || isAtMin
            ? undefined
            : {
                scale: 0.88,
                transition: { duration: motionTokens.duration.instant },
              }
        "
        aria-label="Decrease value"
        @click="decrement"
      >
        <Minus :size="size === 'sm' ? 13 : size === 'lg' ? 17 : 15" />
      </motion.button>

      <div :class="styles.valueContainer">
        <span :class="styles.valueWrapper">
          <span v-if="prefix" :class="styles.affix">{{ prefix }}</span>

          <template v-for="item in formattedDigits" :key="item.key">
            <span v-if="item.isDigit" :class="styles.column">
              <span :class="styles.sizer">0</span>
              <AnimatePresence mode="popLayout" :initial="false">
                <motion.span
                  :key="item.char"
                  :class="styles.glyph"
                  :variants="prefersReduced ? undefined : digitVariants"
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {{ item.char }}
                </motion.span>
              </AnimatePresence>
            </span>
            <span v-else :class="styles.symbol">{{ item.char }}</span>
          </template>

          <span v-if="suffix" :class="styles.affix">{{ suffix }}</span>
        </span>
      </div>

      <motion.button
        type="button"
        :class="styles.stepButton"
        :disabled="disabled || isAtMax"
        :while-tap="
          disabled || isAtMax
            ? undefined
            : {
                scale: 0.88,
                transition: { duration: motionTokens.duration.instant },
              }
        "
        aria-label="Increase value"
        @click="increment"
      >
        <Plus :size="size === 'sm' ? 13 : size === 'lg' ? 17 : 15" />
      </motion.button>
    </motion.div>
  </div>
</template>

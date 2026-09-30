<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./billing-toggle.module.css";

export interface BillingToggleOption {
  value: string;
  label: string;
  /** 折扣提示文案，例如 "Save 20%" */
  badge?: string;
  /** 选中后的激活文案，例如 "You save $48"，默认取 badge */
  activeBadge?: string;
}

export interface BillingToggleProps {
  modelValue?: string;
  options?: BillingToggleOption[];
  label?: string;
  size?: "md" | "lg";
}

const DEFAULT_OPTIONS: BillingToggleOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", badge: "Save 20%" },
];

const props = withDefaults(defineProps<BillingToggleProps>(), {
  modelValue: "monthly",
  options: () => DEFAULT_OPTIONS,
  label: "Billing period",
  size: "md",
});

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "change", val: string): void;
}>();

const prefersReduced = useReducedMotion();
const rootRef = ref<HTMLDivElement | null>(null);
const optionRefs = ref<Array<HTMLButtonElement | null>>([]);
const thumb = ref<{ x: number; width: number } | null>(null);

const selectedIndex = computed(() => {
  const idx = props.options.findIndex((opt) => opt.value === props.modelValue);
  return idx >= 0 ? idx : 0;
});

const updateThumbPosition = () => {
  const currentEl = optionRefs.value[selectedIndex.value];
  if (!currentEl) return;
  thumb.value = {
    x: currentEl.offsetLeft,
    width: currentEl.offsetWidth,
  };
};

watch(
  () => [props.modelValue, props.options],
  async () => {
    await nextTick();
    updateThumbPosition();
  }
);

onMounted(() => {
  nextTick(() => {
    updateThumbPosition();
  });
});

const selectOption = (val: string) => {
  emit("update:modelValue", val);
  emit("change", val);
};

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  let step = 0;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") step = 1;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") step = -1;

  if (step !== 0) {
    event.preventDefault();
    const nextIndex = (index + step + props.options.length) % props.options.length;
    const target = props.options[nextIndex];
    selectOption(target.value);
    optionRefs.value[nextIndex]?.focus();
  }
};

// 文案平滑交叉淡入淡出动效
const swapVariants = {
  hidden: {
    opacity: 0,
    y: "0.4em",
    filter: `blur(${motionTokens.blur.subtle}px)`,
  },
  shown: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: {
      duration: motionTokens.duration.standard,
      ease: [...motionTokens.ease.enter],
    },
  },
  gone: {
    opacity: 0,
    y: "-0.4em",
    filter: `blur(${motionTokens.blur.subtle}px)`,
    transition: {
      duration: motionTokens.duration.fast,
      ease: [...motionTokens.ease.standard],
    },
  },
};
</script>

<template>
  <div
    ref="rootRef"
    role="radiogroup"
    :aria-label="label"
    :class="styles.root"
    :data-size="size"
  >
    <!-- 滑动 Thumb 背景 -->
    <motion.span
      v-if="thumb"
      :class="styles.thumb"
      aria-hidden="true"
      :animate="{ x: thumb.x, width: thumb.width }"
      :transition="
        prefersReduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 450, damping: 35 }
      "
    />

    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="(el) => { optionRefs[index] = el as HTMLButtonElement }"
      type="button"
      role="radio"
      :aria-checked="index === selectedIndex"
      :tabindex="index === selectedIndex ? 0 : -1"
      :class="styles.option"
      :data-selected="index === selectedIndex || undefined"
      @click="selectOption(option.value)"
      @keydown="(e) => handleKeyDown(e, index)"
    >
      <span :class="styles.content">
        <span :class="styles.label">{{ option.label }}</span>

        <!-- 折扣胶囊标签 -->
        <span
          v-if="option.badge"
          :class="styles.badge"
          :data-active="index === selectedIndex || undefined"
        >
          <span :class="styles.swap">
            <span :class="styles.swapSizer" aria-hidden="true">
              {{ option.activeBadge ?? option.badge }}
            </span>
            <AnimatePresence mode="popLayout" :initial="false">
              <motion.span
                :key="index === selectedIndex ? (option.activeBadge ?? option.badge) : option.badge"
                :class="styles.swapText"
                :variants="prefersReduced ? undefined : swapVariants"
                initial="hidden"
                animate="shown"
                exit="gone"
              >
                {{ index === selectedIndex ? (option.activeBadge ?? option.badge) : option.badge }}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </span>
    </button>
  </div>
</template>

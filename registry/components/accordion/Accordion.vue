<script setup lang="ts">
import { ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./accordion.module.css";

export interface AccordionItem {
  id: string | number;
  title: string;
  content?: string;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** 默认展开项的 id */
  defaultOpen?: (string | number)[] | string | number;
  /** 是否允许同时展开多项，默认 false */
  multiple?: boolean;
}

const props = withDefaults(defineProps<AccordionProps>(), {
  multiple: false,
});

const prefersReduced = useReducedMotion();

const getInitialOpen = (): Set<string | number> => {
  if (props.defaultOpen === undefined) return new Set();
  if (Array.isArray(props.defaultOpen)) return new Set(props.defaultOpen);
  return new Set([props.defaultOpen]);
};

const openIds = ref<Set<string | number>>(getInitialOpen());

const toggle = (id: string | number, disabled?: boolean) => {
  if (disabled) return;
  const isOpened = openIds.value.has(id);
  if (props.multiple) {
    if (isOpened) openIds.value.delete(id);
    else openIds.value.add(id);
  } else {
    openIds.value.clear();
    if (!isOpened) openIds.value.add(id);
  }
};

const isOpen = (id: string | number) => openIds.value.has(id);
</script>

<template>
  <div :class="styles.accordion">
    <div
      v-for="item in items"
      :key="item.id"
      :class="styles.item"
    >
      <h3 :class="styles.header">
        <button
          type="button"
          :class="styles.trigger"
          :aria-expanded="isOpen(item.id)"
          :disabled="item.disabled"
          @click="toggle(item.id, item.disabled)"
        >
          <span>{{ item.title }}</span>
          <span
            :class="styles.icon"
            :style="{
              transform: isOpen(item.id) ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
          >
            <ChevronDown :size="16" />
          </span>
        </button>
      </h3>

      <AnimatePresence :initial="false">
        <motion.div
          v-if="isOpen(item.id)"
          :class="styles.panel"
          :initial="prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }"
          :animate="{ height: 'auto', opacity: 1 }"
          :exit="prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }"
          :transition="{
            height: { duration: 0.28, ease: [...motionTokens.ease.standard] },
            opacity: { duration: motionTokens.duration.fast },
          }"
        >
          <motion.div
            :class="styles.content"
            :initial="prefersReduced ? {} : { y: -6, filter: `blur(${motionTokens.blur.subtle}px)` }"
            :animate="{ y: 0, filter: 'blur(0px)' }"
            :transition="{ duration: 0.24, ease: [...motionTokens.ease.enter] }"
          >
            <slot :name="`item-${item.id}`" :item="item">
              {{ item.content }}
            </slot>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
</template>

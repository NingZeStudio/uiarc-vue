<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence, type Variants } from "motion-v";
import { X } from "lucide-vue-next";
import { motionTokens } from "../motion-tokens";
import { useReducedMotion } from "../use-reduced-motion";
import styles from "./card.module.css";

export interface CardProps {
  title: string;
  description?: string;
  media?: string;
  status?: string;
  details?: string;
  open?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<CardProps>(), {
  open: false,
});

const emit = defineEmits<{
  (e: "update:open", val: boolean): void;
}>();

const prefersReduced = useReducedMotion();
const isOpen = ref(props.open);
const isHovered = ref(false);

const wordMotion: Variants = {
  enter: { opacity: 0, y: "0.3em", filter: `blur(${motionTokens.blur.soft}px)` },
  center: (order: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionTokens.duration.standard,
      ease: [...motionTokens.ease.enter],
      delay: order * motionTokens.stagger.word,
    },
  }),
};

function toggleOpen(val: boolean) {
  isOpen.value = val;
  emit("update:open", val);
}
</script>

<template>
  <div
    :class="[styles.card, props.class]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Media section with subtle zoom motion -->
    <div v-if="media || $slots.media" :class="styles.mediaWrap">
      <motion.div
        :class="styles.media"
        :animate="{ scale: isHovered && !prefersReduced ? 1.04 : 1 }"
        :transition="{
          duration: motionTokens.duration.considered * 2,
          ease: [...motionTokens.ease.standard],
        }"
      >
        <slot name="media">
          <img v-if="media" :src="media" alt="" :class="styles.image" />
        </slot>
      </motion.div>
    </div>

    <!-- Header section -->
    <div :class="styles.header">
      <div :class="styles.titleGroup">
        <h3 :class="styles.title">{{ title }}</h3>
        <p v-if="description || $slots.description" :class="styles.description">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div v-if="$slots.action" :class="styles.action">
        <slot name="action" />
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="$slots.default" :class="styles.content">
      <slot />
    </div>

    <!-- Footer with status rolling words and meta -->
    <div v-if="status || $slots.avatar || $slots.meta" :class="styles.footer">
      <div v-if="$slots.avatar" :class="styles.avatar">
        <slot name="avatar" />
      </div>
      <div :class="styles.meta">
        <slot name="meta" />
        <span v-if="status" :class="styles.status" role="status">
          <span :class="styles.roll" aria-hidden="true">
            <AnimatePresence mode="popLayout" :initial="false">
              <motion.span :key="status" :class="styles.line">
                <motion.span
                  v-for="(part, idx) in status.split(/(\s+/)"
                  :key="idx"
                  :class="styles.word"
                  :custom="idx / 2"
                  :variants="wordMotion"
                  initial="enter"
                  animate="center"
                >
                  {{ part }}
                </motion.span>
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </div>
    </div>

    <!-- Quick Look Overlay Dialog if details provided -->
    <AnimatePresence v-if="details || $slots.details">
      <div
        v-if="isOpen"
        :class="styles.overlay"
        @click.self="toggleOpen(false)"
      >
        <motion.div
          :class="styles.panel"
          :initial="{ opacity: 0, scale: 0.95, y: 10 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95, y: 10 }"
          :transition="prefersReduced ? { duration: 0.1 } : motionTokens.spring.smooth"
        >
          <div :class="styles.panelHeader">
            <h4>{{ title }}</h4>
            <button
              type="button"
              :class="styles.close"
              aria-label="Close"
              @click="toggleOpen(false)"
            >
              <X :size="16" />
            </button>
          </div>
          <div :class="styles.panelBody">
            <slot name="details">{{ details }}</slot>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  </div>
</template>

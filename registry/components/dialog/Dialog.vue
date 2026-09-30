<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./dialog.module.css";

export interface DialogProps {
  modelValue?: boolean;
  title?: string;
  description?: string;
  closeOnOutsideClick?: boolean;
}

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  closeOnOutsideClick: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "close"): void;
}>();

const prefersReduced = useReducedMotion();

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.modelValue) {
    close();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <AnimatePresence>
      <div v-if="modelValue">
        <!-- 背景毛玻璃柔和遮罩 -->
        <motion.div
          :class="styles.overlay"
          aria-hidden="true"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: motionTokens.duration.fast }"
          @click="closeOnOutsideClick && close()"
        />

        <!-- 弹窗核心面板（物理微弹入与微模糊解出） -->
        <motion.div
          role="dialog"
          aria-modal="true"
          :class="styles.content"
          :initial="
            prefersReduced
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 0.94,
                  y: 8,
                  filter: `blur(${motionTokens.blur.deep}px)`,
                }
          "
          :animate="{
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
          }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 0.96,
                  y: 6,
                  filter: `blur(${motionTokens.blur.soft}px)`,
                }
          "
          :transition="motionTokens.spring.snappy"
        >
          <button
            type="button"
            :class="styles.closeButton"
            aria-label="Close dialog"
            @click="close"
          >
            <X :size="16" />
          </button>

          <div v-if="title || description || $slots.header" :class="styles.head">
            <slot name="header">
              <h2 v-if="title" :class="styles.title">{{ title }}</h2>
              <p v-if="description" :class="styles.description">{{ description }}</p>
            </slot>
          </div>

          <slot />

          <div v-if="$slots.footer" :class="styles.footer">
            <slot name="footer" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  </Teleport>
</template>

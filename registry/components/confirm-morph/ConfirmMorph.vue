<script setup lang="ts">
import { ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { onClickOutside } from "@vueuse/core";
import { motionTokens } from "@/registry/motion-tokens";
import { useMorphWidth } from "@/registry/composables/use-morph-width";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./confirm-morph.module.css";

export type ConfirmMorphState = "idle" | "confirming" | "pending" | "done" | "error";

export interface ConfirmMorphProps {
  label?: string;
  prompt?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pendingLabel?: string;
  doneLabel?: string;
  undoLabel?: string;
  tone?: "danger" | "neutral";
  confirmTimeout?: number;
  onConfirm?: () => Promise<unknown> | void;
  onUndo?: () => Promise<unknown> | void;
}

const props = withDefaults(defineProps<ConfirmMorphProps>(), {
  label: "Delete",
  prompt: "Are you sure?",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  pendingLabel: "Deleting...",
  doneLabel: "Deleted",
  undoLabel: "Undo",
  tone: "danger",
  confirmTimeout: 4000,
});

const emit = defineEmits<{
  (e: "stateChange", state: ConfirmMorphState): void;
}>();

const prefersReduced = useReducedMotion();
const rootRef = ref<HTMLDivElement | null>(null);
const surfaceRef = ref<HTMLDivElement | null>(null);
const currentState = ref<ConfirmMorphState>("idle");
let timeoutTimer: any = null;

const setState = (next: ConfirmMorphState) => {
  currentState.value = next;
  emit("stateChange", next);

  clearTimeout(timeoutTimer);
  if (next === "confirming" && props.confirmTimeout > 0) {
    timeoutTimer = setTimeout(() => {
      if (currentState.value === "confirming") {
        setState("idle");
      }
    }, props.confirmTimeout);
  }
};

onClickOutside(rootRef, () => {
  if (currentState.value === "confirming") {
    setState("idle");
  }
});

const handleTriggerClick = () => {
  setState("confirming");
};

const handleCancel = () => {
  setState("idle");
};

const handleConfirm = async () => {
  setState("pending");
  try {
    if (props.onConfirm) {
      await props.onConfirm();
    }
    setState("done");
  } catch {
    setState("error");
  }
};

const handleUndo = async () => {
  setState("pending");
  try {
    if (props.onUndo) {
      await props.onUndo();
    }
    setState("idle");
  } catch {
    setState("error");
  }
};

// 尺寸自适应平滑拉伸
const morphWidth = useMorphWidth(
  surfaceRef,
  () => currentState.value,
  { disabled: prefersReduced }
);

const faceVariants = {
  hidden: {
    opacity: 0,
    y: "0.3em",
    filter: `blur(${motionTokens.blur.subtle}px)`,
  },
  shown: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: {
      duration: motionTokens.duration.fast,
      ease: [...motionTokens.ease.enter],
    },
  },
  gone: {
    opacity: 0,
    y: "-0.3em",
    filter: `blur(${motionTokens.blur.subtle}px)`,
    transition: {
      duration: motionTokens.duration.instant,
    },
  },
};
</script>

<template>
  <div
    ref="rootRef"
    :class="styles.root"
    :data-tone="tone"
    :data-state="currentState"
  >
    <div
      ref="surfaceRef"
      :class="styles.surface"
      :style="{ width: morphWidth === 'auto' ? 'auto' : morphWidth }"
    >
      <AnimatePresence mode="popLayout" :initial="false">
        <!-- 1. 静止态 (Idle) -->
        <motion.div
          v-if="currentState === 'idle'"
          key="idle"
          :class="styles.face"
          :variants="prefersReduced ? undefined : faceVariants"
          initial="hidden"
          animate="shown"
          exit="gone"
        >
          <button type="button" :class="styles.btn" @click="handleTriggerClick">
            <slot>{{ label }}</slot>
          </button>
        </motion.div>

        <!-- 2. 询问态 (Confirming) -->
        <motion.div
          v-else-if="currentState === 'confirming'"
          key="confirming"
          :class="styles.face"
          :variants="prefersReduced ? undefined : faceVariants"
          initial="hidden"
          animate="shown"
          exit="gone"
        >
          <span>{{ prompt }}</span>
          <button type="button" :class="styles.btn" @click="handleCancel">
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            :class="[styles.btn, styles.confirmBtn]"
            @click="handleConfirm"
          >
            {{ confirmLabel }}
          </button>
        </motion.div>

        <!-- 3. 进行态 (Pending) -->
        <motion.div
          v-else-if="currentState === 'pending'"
          key="pending"
          :class="styles.face"
          :variants="prefersReduced ? undefined : faceVariants"
          initial="hidden"
          animate="shown"
          exit="gone"
        >
          <span :class="styles.spinner" />
          <span>{{ pendingLabel }}</span>
        </motion.div>

        <!-- 4. 完成态带撤销 (Done with Undo) -->
        <motion.div
          v-else-if="currentState === 'done'"
          key="done"
          :class="styles.face"
          :variants="prefersReduced ? undefined : faceVariants"
          initial="hidden"
          animate="shown"
          exit="gone"
        >
          <span>{{ doneLabel }}</span>
          <button
            v-if="onUndo"
            type="button"
            :class="[styles.btn, styles.undoBtn]"
            @click="handleUndo"
          >
            {{ undoLabel }}
          </button>
        </motion.div>

        <!-- 5. 异常态 (Error) -->
        <motion.div
          v-else-if="currentState === 'error'"
          key="error"
          :class="styles.face"
          :variants="prefersReduced ? undefined : faceVariants"
          initial="hidden"
          animate="shown"
          exit="gone"
        >
          <span>Action failed</span>
          <button type="button" :class="styles.btn" @click="handleCancel">
            Close
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./shortcut-recorder.module.css";

export interface ShortcutRecorderProps {
  modelValue?: string;
  defaultShortcut?: string;
  disabled?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<ShortcutRecorderProps>(), {
  modelValue: "",
  defaultShortcut: "",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "change", val: string): void;
}>();

const prefersReduced = useReducedMotion();
const isRecording = ref(false);

function startRecording() {
  if (props.disabled) return;
  isRecording.value = true;
}

function handleKeydown(e: KeyboardEvent) {
  if (!isRecording.value) return;
  e.preventDefault();
  e.stopPropagation();

  if (e.key === "Escape") {
    isRecording.value = false;
    return;
  }

  const parts: string[] = [];
  if (e.ctrlKey) parts.push("Ctrl");
  if (e.metaKey) parts.push("Cmd");
  if (e.altKey) parts.push("Alt");
  if (e.shiftKey) parts.push("Shift");

  if (!["Control", "Meta", "Alt", "Shift"].includes(e.key)) {
    parts.push(e.key.toUpperCase());
    const shortcut = parts.join("+");
    emit("update:modelValue", shortcut);
    emit("change", shortcut);
    isRecording.value = false;
  }
}

function reset() {
  emit("update:modelValue", props.defaultShortcut);
  emit("change", props.defaultShortcut);
  isRecording.value = false;
}
</script>

<template>
  <div
    :class="[
      styles.recorder,
      isRecording ? styles.recording : undefined,
      disabled ? styles.disabled : undefined,
      props.class,
    ]"
    tabindex="0"
    @click="startRecording"
    @keydown="handleKeydown"
  >
    <div :class="styles.badge">
      <span v-if="isRecording" :class="styles.recordingText">
        Press keys...
      </span>
      <span v-else-if="modelValue" :class="styles.shortcutText">
        {{ modelValue }}
      </span>
      <span v-else :class="styles.placeholder">Click to record</span>
    </div>

    <button
      v-if="modelValue && defaultShortcut && modelValue !== defaultShortcut"
      type="button"
      :class="styles.resetButton"
      aria-label="Reset shortcut"
      @click.stop="reset"
    >
      <RotateCcw :size="12" />
    </button>
  </div>
</template>

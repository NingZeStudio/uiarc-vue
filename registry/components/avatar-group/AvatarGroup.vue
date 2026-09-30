<script setup lang="ts">
import { ref, computed, watch, type CSSProperties } from "vue";
import { motion, AnimatePresence, type Variants } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import Avatar from "@/registry/components/avatar/Avatar.vue";
import styles from "./avatar-group.module.css";

export interface AvatarGroupMember {
  name: string;
  src?: string;
  status?: "online" | "offline";
}

export interface AvatarGroupProps {
  members: AvatarGroupMember[];
  max?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  class?: any;
}

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  max: 4,
  size: "md",
  label: "Team members",
});

const prefersReduced = useReducedMotion();

const visible = computed(() => {
  return props.members.slice(0, Math.max(0, props.max));
});

const overflow = computed(() => {
  return Math.max(0, props.members.length - visible.value.length);
});

const transition = computed(() => {
  return prefersReduced.value ? { duration: 0 } : motionTokens.spring.morph;
});

const countState = ref({
  overflow: overflow.value,
  direction: 1,
});

watch(overflow, (newVal) => {
  if (countState.value.overflow !== newVal) {
    countState.value = {
      overflow: newVal,
      direction: newVal < countState.value.overflow ? -1 : 1,
    };
  }
});

const rise: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    y: `${0.4 * direction}em`,
    filter: `blur(${motionTokens.blur.subtle}px)`,
  }),
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionTokens.duration.standard,
      ease: [...motionTokens.ease.enter],
    },
  },
  gone: (direction: number) => ({
    opacity: 0,
    y: `${-0.4 * direction}em`,
    filter: `blur(${motionTokens.blur.subtle}px)`,
    transition: {
      duration: motionTokens.duration.fast,
      ease: [...motionTokens.ease.standard],
    },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0, y: 0, filter: "blur(0px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: motionTokens.duration.instant },
  },
  gone: {
    opacity: 0,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: motionTokens.duration.instant },
  },
};

const slotVariants = {
  initial: { width: 0, opacity: 0, scale: 0.9 },
  animate: { width: "auto", opacity: 1, scale: 1 },
  exit: { width: 0, opacity: 0, scale: 0.9 },
};
</script>

<template>
  <div
    :class="[styles.group, styles[size], props.class]"
    role="group"
    :aria-label="label"
    :style="{ '--count': visible.length + (overflow > 0 ? 1 : 0) } as CSSProperties"
  >
    <AnimatePresence :initial="false">
      <motion.span
        v-for="(member, index) in visible"
        :key="member.name"
        :class="styles.slot"
        :style="{ '--index': index } as CSSProperties"
        :initial="slotVariants.initial"
        :animate="slotVariants.animate"
        :exit="slotVariants.exit"
        :transition="transition"
      >
        <span :class="styles.lift">
          <Avatar
            :class="styles.avatar"
            :name="member.name"
            :src="member.src"
            :status="member.status"
            :size="size"
          />
          <span :class="styles.tip" aria-hidden="true">{{ member.name }}</span>
        </span>
      </motion.span>

      <motion.span
        v-if="overflow > 0"
        key="overflow"
        :class="styles.slot"
        :style="{ '--index': visible.length } as CSSProperties"
        :initial="slotVariants.initial"
        :animate="slotVariants.animate"
        :exit="slotVariants.exit"
        :transition="transition"
      >
        <span
          :class="[styles.lift, styles.overflow, styles[size]]"
          role="img"
          :aria-label="`${overflow} more ${label.toLowerCase()}`"
        >
          <AnimatePresence mode="popLayout" :initial="false" :custom="countState.direction">
            <motion.span
              :key="overflow"
              :class="styles.count"
              :custom="countState.direction"
              :variants="prefersReduced ? fade : rise"
              initial="hidden"
              animate="shown"
              exit="gone"
              aria-hidden="true"
            >
              +{{ overflow }}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.span>
    </AnimatePresence>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { ChevronRight } from "lucide-vue-next";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./breadcrumb.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: (event: MouseEvent) => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  ariaLabel?: string;
  class?: any;
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  ariaLabel: "Breadcrumb",
});

const prefersReduced = useReducedMotion();
const pathKey = computed(() => props.items.map((i) => i.label).join("/"));
</script>

<template>
  <nav :aria-label="ariaLabel" :class="props.class">
    <ol :class="styles.list">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.li
          v-for="(item, index) in items"
          :key="`${item.label}-${index}`"
          :class="styles.item"
          :initial="
            prefersReduced
              ? false
              : { opacity: 0, x: -8, filter: `blur(${motionTokens.blur.subtle}px)` }
          "
          :animate="{ opacity: 1, x: 0, filter: 'blur(0px)' }"
          :exit="
            prefersReduced
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  x: -4,
                  filter: `blur(${motionTokens.blur.subtle}px)`,
                  transition: {
                    duration: motionTokens.duration.instant,
                    ease: [...motionTokens.ease.standard],
                  },
                }
          "
          :transition="
            prefersReduced
              ? { duration: 0 }
              : {
                  duration: motionTokens.duration.standard,
                  ease: [...motionTokens.ease.enter],
                }
          "
        >
          <ChevronRight
            v-if="index > 0"
            :size="14"
            :class="styles.separator"
            aria-hidden="true"
          />

          <a
            v-if="index < items.length - 1 && item.href"
            :href="item.href"
            :class="styles.link"
            :data-label="item.label"
            @click="item.onClick"
          >
            {{ item.label }}
          </a>
          <button
            v-else-if="index < items.length - 1 && item.onClick"
            type="button"
            :class="styles.button"
            :data-label="item.label"
            @click="item.onClick"
          >
            {{ item.label }}
          </button>
          <span
            v-else
            :class="styles.current"
            aria-current="page"
            :data-label="item.label"
          >
            {{ item.label }}
          </span>
        </motion.li>
      </AnimatePresence>
    </ol>
  </nav>
</template>

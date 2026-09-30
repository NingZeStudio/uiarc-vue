<script setup lang="ts">
import { computed } from "vue";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./activity-heatmap.module.css";

export interface ActivityDay {
  date: string;
  count: number;
}

export interface ActivityHeatmapProps {
  days: ActivityDay[];
  label: string;
  period: string;
  thresholds?: [number, number, number];
  class?: any;
}

const props = withDefaults(defineProps<ActivityHeatmapProps>(), {
  thresholds: () => [2, 5, 8],
});

const emit = defineEmits<{
  (e: "select", date: string): void;
}>();

const prefersReduced = useReducedMotion();

const total = computed(() =>
  props.days.reduce((sum, d) => sum + d.count, 0)
);

function getLevel(count: number) {
  if (count <= 0) return 0;
  if (count <= props.thresholds[0]) return 1;
  if (count <= props.thresholds[1]) return 2;
  if (count <= props.thresholds[2]) return 3;
  return 4;
}
</script>

<template>
  <div :class="[styles.container, props.class]">
    <div :class="styles.header">
      <div :class="styles.info">
        <h4 :class="styles.label">{{ label }}</h4>
        <span :class="styles.summary">
          <strong>{{ total.toLocaleString() }}</strong> in {{ period }}
        </span>
      </div>
      <div v-if="$slots.actions" :class="styles.actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Grid of Days -->
    <div :class="styles.gridWrap">
      <div :class="styles.grid" role="grid" :aria-label="label">
        <button
          v-for="d in days"
          :key="d.date"
          type="button"
          :class="[styles.cell, styles[`level${getLevel(d.count)}`]]"
          :aria-label="`${d.count} activities on ${d.date}`"
          @click="emit('select', d.date)"
        />
      </div>
    </div>

    <!-- Legend -->
    <div :class="styles.footer">
      <span :class="styles.legendText">Less</span>
      <div :class="styles.legendCells">
        <span :class="[styles.cell, styles.level0]" />
        <span :class="[styles.cell, styles.level1]" />
        <span :class="[styles.cell, styles.level2]" />
        <span :class="[styles.cell, styles.level3]" />
        <span :class="[styles.cell, styles.level4]" />
      </div>
      <span :class="styles.legendText">More</span>
    </div>
  </div>
</template>

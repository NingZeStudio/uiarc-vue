<script setup lang="ts">
import { ref, computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";
import { useReducedMotion } from "@/registry/composables/use-reduced-motion";
import styles from "./donut-chart.module.css";

export interface DonutChartDatum {
  key: string;
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutChartDatum[];
  label?: string;
  unit?: string;
  totalLabel?: string;
  size?: number;
  thickness?: number;
  legend?: boolean;
}

const props = withDefaults(defineProps<DonutChartProps>(), {
  label: "Donut Chart",
  totalLabel: "Total",
  size: 200,
  thickness: 28,
  legend: true,
});

const prefersReduced = useReducedMotion();
const activeKey = ref<string | null>(null);

const DEFAULT_PALETTE = [
  "oklch(62% 0.16 250)",  // Calm Blue
  "oklch(65% 0.14 150)",  // Calm Green
  "oklch(68% 0.15 75)",   // Calm Amber
  "oklch(60% 0.16 295)",  // Calm Violet
  "oklch(55% 0.12 30)",   // Calm Coral
  "oklch(50% 0 0)",       // Neutral Slate
];

const totalValue = computed(() => {
  return props.data.reduce((acc, cur) => acc + cur.value, 0);
});

// 计算每个切片的起始与终止弧度
interface ComputedSlice extends DonutChartDatum {
  startTurn: number;
  endTurn: number;
  share: number;
  fillColor: string;
  path: string;
}

const TAU = Math.PI * 2;
const GAP = 3;
const CORNER = 4;

function sector(
  c: number,
  R: number,
  r: number,
  t0: number,
  t1: number,
  gap: number,
  corner: number
) {
  const turns = t1 - t0;
  if (turns <= 1e-5) return "";
  const at = (radius: number, angle: number) =>
    `${(c + radius * Math.cos(angle)).toFixed(2)} ${(c + radius * Math.sin(angle)).toFixed(2)}`;

  if (turns >= 1 - 1e-5) {
    return `M${at(R, -Math.PI / 2)} A${R} ${R} 0 1 1 ${at(R, Math.PI / 2)} A${R} ${R} 0 1 1 ${at(R, -Math.PI / 2)} Z M${at(r, -Math.PI / 2)} A${r} ${r} 0 1 0 ${at(r, Math.PI / 2)} A${r} ${r} 0 1 0 ${at(r, -Math.PI / 2)} Z`;
  }

  const p = Math.min(gap / 2, ((1 - turns) * TAU * R) / 2);
  const a0 = t0 * TAU - Math.PI / 2;
  const a1 = t1 * TAU - Math.PI / 2;
  const half = (a1 - a0) / 2;
  const s = Math.sin(Math.min(half, Math.PI / 2));
  if (s * R <= p + 1e-5) return "";

  const side = (t: number, angle: number, sign: number) =>
    `${(c + t * Math.cos(angle) - sign * p * Math.sin(angle)).toFixed(2)} ${(c + t * Math.sin(angle) + sign * p * Math.cos(angle)).toFixed(2)}`;

  const band = (R - r) / 2;
  const ro = Math.max(0, Math.min(corner, band, (s * R - p) / (1 + s)));
  const dO = Math.asin(Math.min(1, (p + ro) / (R - ro)));
  const tO = Math.sqrt(Math.max(0, (R - ro) ** 2 - (p + ro) ** 2));
  const bigO = a1 - a0 - 2 * dO > Math.PI ? 1 : 0;

  let d = `M${side(tO, a0, 1)}`;
  if (ro > 0.01) d += ` A${ro.toFixed(2)} ${ro.toFixed(2)} 0 0 1 ${at(R, a0 + dO)}`;
  d += ` A${R} ${R} 0 ${bigO} 1 ${at(R, a1 - dO)}`;
  if (ro > 0.01) d += ` A${ro.toFixed(2)} ${ro.toFixed(2)} 0 0 1 ${side(tO, a1, -1)}`;

  if (s * r > p + 1e-5) {
    const ri = Math.max(0, Math.min(corner, band, (s * r - p) / (1 - s)));
    const dI = Math.asin(Math.min(1, (p + ri) / (r + ri)));
    const tI = Math.sqrt(Math.max(0, (r + ri) ** 2 - (p + ri) ** 2));
    const bigI = a1 - a0 - 2 * dI > Math.PI ? 1 : 0;
    d += ` L${side(tI, a1, -1)}`;
    if (ri > 0.01) d += ` A${ri.toFixed(2)} ${ri.toFixed(2)} 0 0 1 ${at(r, a1 - dI)}`;
    d += ` A${r} ${r} 0 ${bigI} 0 ${at(r, a0 + dI)}`;
    if (ri > 0.01) d += ` A${ri.toFixed(2)} ${ri.toFixed(2)} 0 0 1 ${side(tI, a0, 1)}`;
  } else {
    d += ` L${at(p / s, (a0 + a1) / 2)}`;
  }
  return `${d} Z`;
}

const slices = computed<ComputedSlice[]>(() => {
  const tot = totalValue.value || 1;
  const c = props.size / 2;
  const R = props.size / 2 - 4;
  const r = R - props.thickness;

  let currentTurn = 0;
  return props.data.map((item, index) => {
    const share = item.value / tot;
    const startTurn = currentTurn;
    const endTurn = currentTurn + share;
    currentTurn = endTurn;

    const fillColor = item.color || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
    const path = sector(c, R, r, startTurn, endTurn, GAP, CORNER);

    return {
      ...item,
      startTurn,
      endTurn,
      share,
      fillColor,
      path,
    };
  });
});

const activeSlice = computed(() => {
  if (!activeKey.value) return null;
  return slices.value.find((s) => s.key === activeKey.value) ?? null;
});

const centerDisplay = computed(() => {
  if (activeSlice.value) {
    return {
      label: activeSlice.value.label,
      value: activeSlice.value.value,
      percent: `${(activeSlice.value.share * 100).toFixed(0)}%`,
    };
  }
  return {
    label: props.totalLabel,
    value: totalValue.value,
    percent: null,
  };
});
</script>

<template>
  <figure :class="styles.figure" :data-legend="legend">
    <div
      :class="styles.ring"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <svg
        :class="styles.svg"
        :viewBox="`0 0 ${size} ${size}`"
        :aria-label="label"
      >
        <path
          v-for="s in slices"
          :key="s.key"
          :class="styles.segment"
          :d="s.path"
          :fill="s.fillColor"
          :data-dim="activeKey && activeKey !== s.key ? 'true' : undefined"
          :style="{
            transform: activeKey === s.key ? 'scale(1.03)' : 'scale(1)',
          }"
          @mouseenter="activeKey = s.key"
          @mouseleave="activeKey = null"
        />
      </svg>

      <!-- 环形中心数据指标 -->
      <div :class="styles.center">
        <span :class="styles.centerLabel">{{ centerDisplay.label }}</span>
        <span :class="styles.centerValue">
          {{ centerDisplay.value.toLocaleString() }}
        </span>
        <span v-if="centerDisplay.percent" :class="styles.centerUnit">
          {{ centerDisplay.percent }}
        </span>
        <span v-else-if="unit" :class="styles.centerUnit">{{ unit }}</span>
      </div>
    </div>

    <!-- 关联交互图例 -->
    <div v-if="legend" :class="styles.legend">
      <button
        v-for="s in slices"
        :key="s.key"
        type="button"
        :class="styles.legendItem"
        :data-active="activeKey === s.key ? 'true' : undefined"
        @mouseenter="activeKey = s.key"
        @mouseleave="activeKey = null"
      >
        <div :class="styles.legendLeft">
          <span
            :class="styles.legendDot"
            :style="{ backgroundColor: s.fillColor }"
          />
          <span :class="styles.legendLabel">{{ s.label }}</span>
        </div>
        <div :class="styles.legendRight">
          <span :class="styles.legendValue">
            {{ s.value.toLocaleString() }}
          </span>
          <span :class="styles.legendPercent">
            {{ (s.share * 100).toFixed(0) }}%
          </span>
        </div>
      </button>
    </div>
  </figure>
</template>

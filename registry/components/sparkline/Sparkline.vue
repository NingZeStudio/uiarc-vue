<script setup lang="ts">
import { ref, computed } from "vue";
import { motion } from "motion-v";
import { motionTokens } from "../motion-tokens";
import { useReducedMotion } from "../use-reduced-motion";
import styles from "./sparkline.module.css";

export type SparklineTone = "accent" | "success" | "warning" | "danger";

export interface SparklineProps {
  data: number[];
  label?: string;
  value?: string;
  change?: string;
  tone?: SparklineTone;
  width?: number;
  height?: number;
  area?: boolean;
  interactive?: boolean;
  class?: any;
}

const props = withDefaults(defineProps<SparklineProps>(), {
  label: "",
  tone: "accent",
  width: 280,
  height: 60,
  area: true,
  interactive: true,
});

const prefersReduced = useReducedMotion();
const svgRef = ref<SVGSVGElement | null>(null);
const activeIndex = ref<number | null>(null);

// 单调三次样条插值平滑曲线算法
type Point = [number, number];
const curvePoints = computed<Point[]>(() => {
  const data = props.data;
  if (!data || data.length < 2) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const ys = data.map((v) => (v - min) / span);
  const last = ys.length - 1;
  const step = 1 / last;

  const slopes = ys.slice(1).map((y, i) => (y - ys[i]) / step);
  const tangents = ys.map((_, i) => {
    if (i === 0 || i === last) return slopes[0];
    const sPrev = slopes[i - 1];
    const sNext = slopes[i];
    if (sPrev * sNext <= 0) return 0;
    return (
      (Math.sign(sPrev) + Math.sign(sNext)) *
        Math.min(Math.abs(sPrev), Math.abs(sNext), Math.abs(sPrev + sNext) / 4) || 0
    );
  });

  const samples = Math.max(1, Math.min(16, Math.round(128 / last)));
  const points: Point[] = [];

  for (let i = 0; i < last; i++) {
    for (let s = 0; s < samples; s++) {
      const t = s / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      const y =
        (2 * t3 - 3 * t2 + 1) * ys[i] +
        (t3 - 2 * t2 + t) * step * tangents[i] +
        (3 * t2 - 2 * t3) * ys[i + 1] +
        (t3 - t2) * step * tangents[i + 1];
      const x = (i + t) * step;
      points.push([x, y]);
    }
  }
  points.push([1, ys[last]]);
  return points;
});

// 将单位化点映射到 SVG viewBox 坐标
const padding = 6;
const svgPath = computed(() => {
  const pts = curvePoints.value;
  if (pts.length === 0) return "";

  const w = props.width - padding * 2;
  const h = props.height - padding * 2;

  const coords = pts.map(([x, y]) => {
    const px = padding + x * w;
    const py = props.height - padding - y * h;
    return `${px.toFixed(2)},${py.toFixed(2)}`;
  });

  return `M${coords.join("L")}`;
});

const areaPath = computed(() => {
  const line = svgPath.value;
  if (!line) return "";
  const startX = padding;
  const endX = props.width - padding;
  const bottomY = props.height;
  return `${line} L${endX},${bottomY} L${startX},${bottomY} Z`;
});

// 手势滑动吸附
const handlePointerMove = (e: PointerEvent) => {
  if (!props.interactive || !svgRef.value) return;
  const rect = svgRef.value.getBoundingClientRect();
  const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const idx = Math.round(relX * (props.data.length - 1));
  activeIndex.value = idx;
};

const handlePointerLeave = () => {
  activeIndex.value = null;
};

const displayValue = computed(() => {
  if (activeIndex.value !== null) {
    return String(props.data[activeIndex.value]);
  }
  return props.value ?? String(props.data[props.data.length - 1] ?? "");
});

const cursorCoords = computed(() => {
  if (activeIndex.value === null) return null;
  const idx = activeIndex.value;
  const min = Math.min(...props.data);
  const max = Math.max(...props.data);
  const span = max - min || 1;
  const x = padding + (idx / (props.data.length - 1)) * (props.width - padding * 2);
  const y = props.height - padding - ((props.data[idx] - min) / span) * (props.height - padding * 2);
  return { x, y };
});
</script>

<template>
  <figure :class="[styles.figure, props.class]">
    <figcaption v-if="label || value || change" :class="styles.caption">
      <span v-if="label" :class="styles.label">{{ label }}</span>
      <strong v-if="displayValue">{{ displayValue }}</strong>
      <small v-if="change" :class="styles[tone]">{{ change }}</small>
    </figcaption>

    <div
      :class="styles.plot"
      :data-interactive="interactive"
      @pointermove="handlePointerMove"
      @pointerleave="handlePointerLeave"
    >
      <svg
        ref="svgRef"
        :class="[styles.chart, styles[tone]]"
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <!-- 面积填充 -->
        <path
          v-if="area && areaPath"
          :class="styles.area"
          :d="areaPath"
        />

        <!-- 贝塞尔拟合平滑走势折线 -->
        <motion.path
          v-if="svgPath"
          :class="styles.line"
          :d="svgPath"
          :initial="prefersReduced ? false : { pathLength: 0 }"
          :animate="{ pathLength: 1 }"
          :transition="{ duration: 0.65, ease: [...motionTokens.ease.inOut] }"
        />

        <!-- 手势吸附指示线与指示点 -->
        <template v-if="cursorCoords">
          <line
            :class="styles.cursorLine"
            :x1="cursorCoords.x"
            :y1="0"
            :x2="cursorCoords.x"
            :y2="height"
          />
          <circle
            :class="styles.cursorPoint"
            :cx="cursorCoords.x"
            :cy="cursorCoords.y"
            r="3.5"
          />
        </template>
      </svg>
    </div>
  </figure>
</template>

/**
 * Arc UI 核心物理动效常量定义
 * 供 motion-v 组件及自适应尺寸动画统一使用
 */
export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.16,
    exit: 0.18,
    standard: 0.24,
    considered: 0.48,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1] as const,
    exit: [0.7, 0, 0.84, 0] as const,
    standard: [0.22, 1, 0.36, 1] as const,
    /** 用于元素在屏幕已有位置上的平滑移动 */
    inOut: [0.65, 0, 0.35, 1] as const,
  },
  spring: {
    responsive: { type: "spring", stiffness: 520, damping: 38, mass: 1 },
    gentle: { type: "spring", stiffness: 340, damping: 34, mass: 1 },
    /** 按压态、开关滑块、拇指与小指示标。快速平息并带有细腻回弹 */
    snappy: { type: "spring", stiffness: 450, damping: 35, mass: 1 },
    /** 用于撞击边界时的微反弹反馈 */
    bounce: { type: "spring", stiffness: 580, damping: 26, mass: 1 },
  },
  blur: {
    subtle: 2,
    soft: 4,
    deep: 8,
  },
} as const;

export type MotionTokens = typeof motionTokens;

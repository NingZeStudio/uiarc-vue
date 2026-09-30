import { ref, watch, nextTick, type Ref } from "vue";
import { animate } from "motion-v";
import { motionTokens } from "@/registry/motion-tokens";

/**
 * 当监听的 key 或状态变化时，自动测算子内容目标宽度，
 * 并以 spring 弹簧物理动画驱动容器宽度平滑拉伸，杜绝界面瞬间闪跳。
 *
 * @param containerRef 容器元素引用
 * @param triggerWatch 触发拉伸的依赖源（如文字 key 或 loading 状态）
 * @param options 可选参数：是否禁用动画、自定义弹簧配置
 */
export function useMorphWidth(
  containerRef: Ref<HTMLElement | null>,
  triggerWatch: () => any,
  options?: {
    disabled?: Ref<boolean> | boolean;
    spring?: typeof motionTokens.spring.snappy;
  }
) {
  const currentWidth = ref<string | number>("auto");
  let activeAnimation: { stop: () => void } | null = null;

  watch(triggerWatch, async () => {
    const el = containerRef.value;
    if (!el) return;

    const isDisabled =
      typeof options?.disabled === "boolean"
        ? options.disabled
        : options?.disabled?.value ?? false;

    if (isDisabled) {
      currentWidth.value = "auto";
      return;
    }

    // 1. 记录当前实际像素宽度
    const prevWidth = el.offsetWidth;
    currentWidth.value = `${prevWidth}px`;

    // 2. DOM 渲染新内容后，测量新内容的自然尺寸
    await nextTick();
    if (!containerRef.value) return;

    el.style.width = "auto";
    const nextWidth = el.offsetWidth;
    el.style.width = `${prevWidth}px`;

    if (prevWidth === nextWidth) {
      currentWidth.value = "auto";
      return;
    }

    // 3. 停止当前正在执行的过渡动画（若有）
    if (activeAnimation) {
      activeAnimation.stop();
    }

    // 4. 调用 motion-v 弹簧动画进行平滑插值拉伸
    activeAnimation = animate(prevWidth, nextWidth, {
      ...(options?.spring ?? motionTokens.spring.snappy),
      onUpdate: (latest: number) => {
        currentWidth.value = `${latest}px`;
      },
      onComplete: () => {
        currentWidth.value = "auto";
        activeAnimation = null;
      },
    });
  });

  return currentWidth;
}

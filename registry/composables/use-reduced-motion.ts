import { ref, onMounted, onUnmounted } from "vue";

/**
 * 监听用户系统是否启用了“减弱动态效果”无障碍偏好
 */
export function useReducedMotion() {
  const prefersReduced = ref(false);

  let mediaQuery: MediaQueryList | null = null;

  const updatePreference = (event: MediaQueryListEvent | MediaQueryList) => {
    prefersReduced.value = event.matches;
  };

  onMounted(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      prefersReduced.value = mediaQuery.matches;
      mediaQuery.addEventListener("change", updatePreference);
    }
  });

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener("change", updatePreference);
    }
  });

  return prefersReduced;
}

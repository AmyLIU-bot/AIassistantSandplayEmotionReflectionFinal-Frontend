import { useEffect, useRef, useState } from "react";

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visibility, setVisibility] = useState<"hidden" | "entering" | "active" | "exiting">("hidden");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.4) setVisibility("active");
        else if (ratio >= 0.1) setVisibility(entry.isIntersecting ? "entering" : "exiting");
        else setVisibility("hidden");
      },
      { threshold: [0, 0.1, 0.2, 0.4, 0.6, 0.8] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visibility };
}

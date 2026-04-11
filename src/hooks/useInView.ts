"use client";

import { useEffect, useState } from "react";

export default function useInView<T extends Element = Element>(ref: React.RefObject<T | null>, options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        setInView(true);
        observer.unobserve(node);
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, options]);

  return inView;
}

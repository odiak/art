import { useEffect, useState } from "react";

type ViewportSize = {
  width: number;
  height: number;
};

const initialViewportSize: ViewportSize = { width: 0, height: 0 };

function readViewportSize(): ViewportSize {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useViewportSize() {
  const [viewportSize, setViewportSize] = useState(initialViewportSize);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize(readViewportSize());
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

  return viewportSize;
}

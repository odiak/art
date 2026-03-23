import { range } from "@odiak/iterate";
import { useEffect, useRef } from "react";
import { useViewportSize } from "../hooks/useViewportSize";

export function Untitled1() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width, height } = useViewportSize();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || width === 0 || height === 0) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const imageData = new ImageData(width, height);
    for (const x of range(width)) {
      for (const y of range(height)) {
        const i = (x + y * width) * 4;
        imageData.data[i + 0] = 255;
        imageData.data[i + 1] = 255;
        imageData.data[i + 2] = 255;
        imageData.data[i + 3] = 255;
      }
    }
    context.putImageData(imageData, 0, 0);

    const timerId = window.setInterval(() => {
      const { x: x0, y: y0, w, h } = randomXYAndSize(width, height);
      const fill = Math.random() < 0.3;

      if (fill) {
        const [r, g, b] = range(3)
          .map(() => Math.floor(Math.random() * 256))
          .toArray();

        for (const x of range(x0, x0 + w)) {
          for (const y of range(y0, y0 + h)) {
            const i = (x + y * width) * 4;
            imageData.data[i + 0] = r;
            imageData.data[i + 1] = g;
            imageData.data[i + 2] = b;
          }
        }
      } else {
        for (const x of range(x0, x0 + w)) {
          for (const y of range(y0, y0 + h)) {
            const i = (x + y * width) * 4;
            imageData.data[i + 0] = 255 - imageData.data[i + 0];
            imageData.data[i + 1] = 255 - imageData.data[i + 1];
            imageData.data[i + 2] = 255 - imageData.data[i + 2];
          }
        }
      }

      context.putImageData(imageData, 0, 0);
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [width, height]);

  if (width === 0 || height === 0) {
    return null;
  }

  return <canvas ref={ref} width={width} height={height} />;
}

function randomXYAndSize(
  width: number,
  height: number,
): { x: number; y: number; w: number; h: number } {
  const x1 = Math.floor(Math.random() * width);
  const x2 = Math.floor(Math.random() * width);
  const y1 = Math.floor(Math.random() * height);
  const y2 = Math.floor(Math.random() * height);
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const w = Math.abs(x1 - x2);
  const h = Math.abs(y1 - y2);
  return { x, y, w, h };
}

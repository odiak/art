import React, { FC, useRef, useMemo, useLayoutEffect } from 'react'
import { range } from '@odiak/iterate'

export const Untitled1: FC<{}> = () => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const [width, height] = useMemo(() => [window.innerWidth, window.innerHeight], [])

  useLayoutEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const im = new ImageData(width, height)
    for (const x of range(width)) {
      for (const y of range(height)) {
        const i = (x + y * width) * 4
        im.data[i + 0] = 255
        im.data[i + 1] = 255
        im.data[i + 2] = 255
        im.data[i + 3] = 255
      }
    }
    ctx.putImageData(im, 0, 0)

    const t = setInterval(() => {
      const { x: x0, y: y0, w, h } = randomXYAndSize(width, height)
      const fill = Math.random() < 0.3
      if (fill) {
        const [r, g, b] = range(3)
          .map(() => Math.floor(Math.random() * 256))
          .toArray()
        for (const x of range(x0, x0 + w)) {
          for (const y of range(y0, y0 + h)) {
            const i = (x + y * width) * 4
            im.data[i + 0] = r
            im.data[i + 1] = g
            im.data[i + 2] = b
          }
        }
      } else {
        for (const x of range(x0, x0 + w)) {
          for (const y of range(y0, y0 + h)) {
            const i = (x + y * width) * 4
            im.data[i + 0] = 255 - im.data[i + 0]
            im.data[i + 1] = 255 - im.data[i + 1]
            im.data[i + 2] = 255 - im.data[i + 2]
          }
        }
      }
      ctx.putImageData(im, 0, 0)
    }, 1000)

    return () => {
      clearInterval(t)
    }
  }, [ref, width, height])

  return (
    <>
      <canvas ref={ref} width={width} height={height} />
    </>
  )
}

function randomXYAndSize(
  width: number,
  height: number
): { x: number; y: number; w: number; h: number } {
  let x1 = Math.floor(Math.random() * width)
  let x2 = Math.floor(Math.random() * width)
  let y1 = Math.floor(Math.random() * height)
  let y2 = Math.floor(Math.random() * height)
  const x = Math.min(x1, x2)
  const y = Math.min(y1, y2)
  const w = Math.abs(x1 - x2)
  const h = Math.abs(y1 - y2)
  return { x, y, w, h }
}

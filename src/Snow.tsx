import React, { FC, useMemo, useEffect, useReducer } from 'react'
import { updateArray } from './utils/updateArray'
import { range } from '@odiak/iterate'

type Snow = {
  x: number
  y: number
  speed: number
}

type State = {
  width: number
  height: number
  snowsInAir: Array<Snow>
  snowHeights: Array<number>
}

type Action =
  | {
      type: 'init'
      payload: { width: number; height: number }
    }
  | { type: 'pullDownAndAdd' }

const initialState: State = { width: 0, height: 0, snowsInAir: [], snowHeights: [] }

function rand(n: number): number {
  let r = 0
  for (const _ of range(n)) {
    r += Math.random()
  }
  return r / n
}

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'init': {
      return {
        ...action.payload,
        snowsInAir: [],
        snowHeights: new Array<number>(action.payload.width).fill(0)
      }
    }

    case 'pullDownAndAdd': {
      let newSnows: Snow[] = state.snowsInAir.map(({ x, y, speed }) => ({
        x: x + (rand(5) * 2 - 1) * 0.7,
        y: y + speed,
        speed
      }))
      let newHeights = state.snowHeights
      newSnows = newSnows.filter(({ x, y }) => {
        const i = Math.floor(x)
        const settled = y >= state.height - newHeights[i]
        if (settled) {
          newHeights = updateArray(newHeights, i, (h) => h + 1)
        }
        return !settled
      })
      newSnows = newSnows.concat(
        range(3)
          .map(() => ({
            y: 0,
            x: Math.round(rand(2) * state.width),
            speed: (Math.random() * 2 + 1) * 0.9
          }))
          .toArray()
      )

      return { ...state, snowsInAir: newSnows, snowHeights: newHeights }
    }

    default:
      return state
  }
}

export const Snow: FC<{}> = () => {
  const [width, height] = useMemo(() => [window.innerWidth, window.innerHeight], [])
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: 'init', payload: { width, height } })

    let cancelled = false

    const tick = () => {
      if (cancelled) return
      dispatch({ type: 'pullDownAndAdd' })
      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)

    return () => {
      cancelled = true
    }
  }, [width, height])

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill="#000" />
      {state.snowsInAir.map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width={1} height={1} fill="#fff" />
      ))}
      {state.snowHeights.map((h, x) =>
        h === 0 ? null : (
          <rect
            key={x}
            x={x}
            y={state.height - state.snowHeights[x]}
            width={1}
            height={state.snowHeights[x]}
            fill="#fff"
          />
        )
      )}
    </svg>
  )
}

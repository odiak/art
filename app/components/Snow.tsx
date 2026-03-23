import { range } from "@odiak/iterate";
import { useEffect, useReducer } from "react";
import { useViewportSize } from "../hooks/useViewportSize";
import { updateArray } from "../utils/updateArray";

type Snowflake = {
  x: number;
  y: number;
  speed: number;
};

type State = {
  width: number;
  height: number;
  snowsInAir: Snowflake[];
  snowHeights: number[];
};

type Action =
  | {
      type: "init";
      payload: { width: number; height: number };
    }
  | { type: "pullDownAndAdd" };

const initialState: State = { width: 0, height: 0, snowsInAir: [], snowHeights: [] };

function rand(n: number): number {
  let r = 0;
  for (const _ of range(n)) {
    r += Math.random();
  }
  return r / n;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init":
      return {
        ...action.payload,
        snowsInAir: [],
        snowHeights: new Array<number>(action.payload.width).fill(0),
      };

    case "pullDownAndAdd": {
      let newSnows: Snowflake[] = state.snowsInAir.map(({ x, y, speed }) => ({
        x: x + (rand(5) * 2 - 1) * 0.7,
        y: y + speed,
        speed,
      }));
      let newHeights = state.snowHeights;

      newSnows = newSnows.filter(({ x, y }) => {
        const i = Math.floor(x);
        const settled = y >= state.height - newHeights[i];
        if (settled) {
          newHeights = updateArray(newHeights, i, (h) => h + 1);
        }
        return !settled;
      });

      newSnows = newSnows.concat(
        range(3)
          .map(() => ({
            y: 0,
            x: Math.round(rand(2) * state.width),
            speed: (Math.random() * 2 + 1) * 0.9,
          }))
          .toArray(),
      );

      return { ...state, snowsInAir: newSnows, snowHeights: newHeights };
    }

    default:
      return state;
  }
}

export function Snow() {
  const { width, height } = useViewportSize();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (width === 0 || height === 0) {
      return;
    }

    dispatch({ type: "init", payload: { width, height } });

    let cancelled = false;
    let frameId = 0;

    const tick = () => {
      if (cancelled) {
        return;
      }
      dispatch({ type: "pullDownAndAdd" });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [width, height]);

  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill="#000" />
      {state.snowsInAir.map((snow, i) => (
        <rect key={i} x={snow.x} y={snow.y} width={1} height={1} fill="#fff" />
      ))}
      {state.snowHeights.map((snowHeight, x) =>
        snowHeight === 0 ? null : (
          <rect
            key={x}
            x={x}
            y={state.height - snowHeight}
            width={1}
            height={snowHeight}
            fill="#fff"
          />
        ),
      )}
    </svg>
  );
}

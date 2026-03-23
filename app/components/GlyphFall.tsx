import styled from "@emotion/styled";
import { Center, OrbitControls, Text3D } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import {
  Suspense,
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import fontUrl from "three/examples/fonts/helvetiker_regular.typeface.json?url";

type GlyphDrop = {
  id: number;
  char: string;
  color: string;
  box: [number, number, number];
  position: [number, number, number];
};

const FALL_COLORS = [
  "#d95f43",
  "#f0a202",
  "#2f7d6b",
  "#4f6bed",
  "#2f3d57",
  "#8a4fff",
] as const;

const GLYPH_SIZE = 1.75;
const GLYPH_DEPTH = 1;
const FLOOR_WIDTH = 17;
const FLOOR_DEPTH = 14;

let measureContext: CanvasRenderingContext2D | null = null;

function normalizeKey(key: string): string | null {
  return /^[a-z0-9]$/i.test(key) ? key.toUpperCase() : null;
}

function getMeasureContext() {
  if (typeof document === "undefined") {
    return null;
  }

  if (!measureContext) {
    measureContext = document.createElement("canvas").getContext("2d");
  }

  return measureContext;
}

function estimateGlyphBox(char: string): [number, number, number] {
  const context = getMeasureContext();
  if (!context) {
    return [1.55, 2.1, GLYPH_DEPTH];
  }

  const fontSize = 160;
  context.font = `900 ${fontSize}px Helvetica, Arial, sans-serif`;

  const metrics = context.measureText(char);
  const width = Math.max(1.05, (metrics.width / fontSize) * GLYPH_SIZE * 1.18);
  const visualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  const height = Math.max(1.55, (visualHeight / fontSize) * GLYPH_SIZE * 1.55);

  return [width, height, GLYPH_DEPTH];
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createGlyphDrop(id: number, char: string): GlyphDrop {
  return {
    id,
    char,
    color: FALL_COLORS[id % FALL_COLORS.length],
    box: estimateGlyphBox(char),
    position: [randomBetween(-4.4, 4.4), randomBetween(11, 15), randomBetween(-2.4, 2.4)],
  };
}

function Floor() {
  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[FLOOR_WIDTH / 2, 0.5, FLOOR_DEPTH / 2]} position={[0, -0.5, 0]} />
        <CuboidCollider args={[0.75, 8, FLOOR_DEPTH / 2]} position={[-FLOOR_WIDTH / 2 - 0.75, 7.5, 0]} />
        <CuboidCollider args={[0.75, 8, FLOOR_DEPTH / 2]} position={[FLOOR_WIDTH / 2 + 0.75, 7.5, 0]} />
        <CuboidCollider args={[FLOOR_WIDTH / 2, 8, 0.75]} position={[0, 7.5, -FLOOR_DEPTH / 2 - 0.75]} />
        <CuboidCollider args={[FLOOR_WIDTH / 2, 8, 0.75]} position={[0, 7.5, FLOOR_DEPTH / 2 + 0.75]} />
      </RigidBody>

      <mesh position={[0, -0.52, 0]} receiveShadow>
        <boxGeometry args={[FLOOR_WIDTH, 1, FLOOR_DEPTH]} />
        <meshStandardMaterial color="#e7dcc7" roughness={0.96} metalness={0.02} />
      </mesh>
    </>
  );
}

function GlyphBody({ glyph }: { glyph: GlyphDrop }) {
  return (
    <RigidBody
      colliders={false}
      position={glyph.position}
      rotation={[0, 0, 0]}
      friction={0.9}
      restitution={0.05}
      angularDamping={0.75}
      linearDamping={0.2}
      lockRotations
      ccd
    >
      <CuboidCollider
        args={[glyph.box[0] / 2, glyph.box[1] / 2, glyph.box[2] / 2]}
        friction={1}
        restitution={0.02}
      />
      <Center>
        <Text3D
          font={fontUrl}
          size={GLYPH_SIZE}
          height={GLYPH_DEPTH}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.06}
          bevelSize={0.035}
          bevelSegments={5}
          castShadow
          receiveShadow
        >
          {glyph.char}
          <meshStandardMaterial color={glyph.color} roughness={0.34} metalness={0.14} />
        </Text3D>
      </Center>
    </RigidBody>
  );
}

function Scene({ glyphs }: { glyphs: GlyphDrop[] }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 8.5, 18], fov: 42 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#f7f1e3"]} />
      <fog attach="fog" args={["#f7f1e3", 18, 32]} />
      <ambientLight intensity={1.1} />
      <hemisphereLight args={["#fff7df", "#8d7154", 1.1]} />
      <directionalLight
        castShadow
        intensity={1.6}
        position={[9, 14, 7]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      <Suspense fallback={null}>
        <Physics gravity={[0, -8.5, 0]} colliders={false} timeStep={1 / 60}>
          <Floor />
          {glyphs.map((glyph) => (
            <GlyphBody key={glyph.id} glyph={glyph} />
          ))}
        </Physics>
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={12}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2.02}
      />
    </Canvas>
  );
}

const Shell = styled.main`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.85), transparent 42%),
    linear-gradient(180deg, #fff8eb 0%, #f4ebda 48%, #e8dcc6 100%);
`;

const Hud = styled.section`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  max-width: min(440px, calc(100vw - 40px));
  padding: 16px 18px;
  border: 1px solid rgba(47, 61, 87, 0.14);
  border-radius: 18px;
  background: rgba(255, 252, 245, 0.82);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 40px rgba(78, 57, 32, 0.12);

  p {
    margin: 0;
    font-size: clamp(1rem, 2vw, 1.2rem);
    color: #4d5b72;
    line-height: 1.5;
  }
`;

export function GlyphFall() {
  const [ready, setReady] = useState(false);
  const [glyphs, setGlyphs] = useState<GlyphDrop[]>([]);
  const nextIdRef = useRef(0);

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    const char = normalizeKey(event.key);
    if (!char) {
      return;
    }

    event.preventDefault();

    startTransition(() => {
      const id = nextIdRef.current++;
      setGlyphs((current) => current.concat(createGlyphDrop(id, char)));
    });
  });

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown, ready]);

  return (
    <Shell>
      <Hud>
        <p>キーをタイプして</p>
      </Hud>
      {ready ? <Scene glyphs={glyphs} /> : null}
    </Shell>
  );
}

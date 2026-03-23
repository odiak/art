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
const GLYPH_LIFETIME_MS = 60_000;

function normalizeKey(key: string): string | null {
  return /^[a-z0-9]$/i.test(key) ? key.toUpperCase() : null;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createGlyphDrop(id: number, char: string): GlyphDrop {
  return {
    id,
    char,
    color: FALL_COLORS[id % FALL_COLORS.length],
    position: [randomBetween(-4.4, 4.4), randomBetween(8.5, 11.5), randomBetween(-2.4, 2.4)],
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
  const [hasLanded, setHasLanded] = useState(false);

  return (
    <RigidBody
      colliders="hull"
      position={glyph.position}
      rotation={[0, 0, 0]}
      friction={0.82}
      restitution={0.05}
      angularDamping={0.3}
      linearDamping={0.1}
      enabledRotations={hasLanded ? [true, true, true] : [false, false, false]}
      additionalSolverIterations={2}
      onCollisionEnter={() => {
        setHasLanded(true);
      }}
      ccd
    >
      <Center>
        <Text3D
          font={fontUrl}
          size={GLYPH_SIZE}
          height={GLYPH_DEPTH}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.06}
          bevelSize={0.035}
          bevelSegments={3}
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
      dpr={[1, 1.5]}
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
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      <Suspense fallback={null}>
        <Physics
          gravity={[0, -8.5, 0]}
          colliders={false}
          timeStep={1 / 60}
          numSolverIterations={8}
        >
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
  const timeoutIdsRef = useRef<number[]>([]);

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

      const timeoutId = window.setTimeout(() => {
        setGlyphs((current) => current.filter((glyph) => glyph.id !== id));
        timeoutIdsRef.current = timeoutIdsRef.current.filter((currentId) => currentId !== timeoutId);
      }, GLYPH_LIFETIME_MS);

      timeoutIdsRef.current.push(timeoutId);
    });
  });

  useEffect(() => {
    setReady(true);

    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutIdsRef.current = [];
    };
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

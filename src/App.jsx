import { useRef } from 'react';
import { DirectionalLightHelper } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, OrbitControls, useHelper } from '@react-three/drei';
import { useControls } from 'leva';

const TaurusKnot = ({ position, args }) => {
  const { color, radius } = useControls({
    color: 'lightblue',
    radius: {
      value: 1,
      min: 0,
      max: 10,
      step: 0.5,
    },
  });

  const ref = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta;
      ref.current.rotation.y += delta;
      ref.current.position.z = Math.sin(state.clock.getElapsedTime()) * 2;
    }
  });

  return (
    <mesh position={position} ref={ref}>
      <torusKnotGeometry args={[radius, ...args]} />
      <MeshWobbleMaterial factor={5} speed={2} color={color} />
    </mesh>
  );
};

const Scene = () => {
  const directionalLightRef = useRef(null);

  const { lightColor, lightIntensity } = useControls({
    lightColor: 'white',
    lightIntensity: {
      value: 0.5,
      min: 0,
      max: 5,
      step: 0.1,
    },
  });

  useHelper(directionalLightRef, DirectionalLightHelper, 0.8, 'red');

  return (
    <>
      <color attach="background" args={['#f5efe6']} />
      <directionalLight
        position={[0, 0, 2]}
        ref={directionalLightRef}
        color={lightColor}
        intensity={lightIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight intensity={0.5} />
      <TaurusKnot position={[0, 0, 0]} args={[0.1, 1000, 50]} />
      <OrbitControls enableZoom={false} />
    </>
  );
};

function App() {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
}

export default App;

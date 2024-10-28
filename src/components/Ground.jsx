import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import floorTexture from "../assets/images/floor.png";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

const wallPositions = [
  // Define las posiciones de las paredes (X, Y, Z)
  [0, 0, -50],
  [0, 0, -25],
  [0, 0, 0],
  [0, 0, 25],
  [0, 0, 50],
  [50, 0, 0],
  [25, 0, 0],
  [-50, 0, 0],
  [-25, 0, 0],
];

export const Ground = () => {
  const texture = useTexture(floorTexture);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh receiveShadow position={[0, -5, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#3a2" map={texture} map-repeat={[160, 160]} />
      </mesh>
      <CuboidCollider args={[500, 500, 0.1]} position={[0, -2, 0]} />

      {wallPositions.map((position, index) => (
        <mesh key={index} position={position} receiveShadow castShadow>
          <boxGeometry args={[5, 300, 5]} /> {/* Tamaño de las paredes */}
          <meshNormalMaterial/> {/* Color de las paredes */}
          <CuboidCollider args={[5, 30, 5]} />
        </mesh>
      ))}
    </RigidBody>
  );
};

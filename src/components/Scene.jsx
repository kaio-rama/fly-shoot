import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Sky } from '@react-three/drei';
import { Ground } from './Ground';
import { Physics, RigidBody } from '@react-three/rapier';
import { Player } from './Player';
import { Buildings } from './Buildings';
import { create } from 'zustand'
import { Lights } from './Lights';

export const usePointerLockControlsStore = create(() => ({
  isPointerLocked: false, 
}));


function Scene() {
  const PointerLockControlsHandler = () => {
    usePointerLockControlsStore.setState({ isPointerLocked: true });
  }
  const PointerUnlockControlsHandler = () => {
    usePointerLockControlsStore.setState({ isPointerLocked: false });
  }


  return (
    <Canvas camera={{ fov: 45 }} shadows>
      <PointerLockControls onLock={PointerLockControlsHandler} onUnlock={PointerUnlockControlsHandler} />
        <Sky 
                distance={4500} 
                sunPosition={[1400, 50, 150]}
                mieCoefficient={0.005} 
                mieDirectionalG={0.8} 
            />
      <Lights />
      <Physics gravity={[0, -25, 0]}>
        <Player position={[100, 100, 0]} />
        <Buildings />
        <Buildings />
        <Buildings />
        <Buildings />
        <Buildings />
        <Buildings />
        <Buildings />
        
           
            <RigidBody>
                <Ground />
            </RigidBody>
      </Physics>
    </Canvas>
  );
};

export default Scene;
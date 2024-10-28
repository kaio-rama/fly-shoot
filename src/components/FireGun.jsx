import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { usePointerLockControlsStore } from "./Scene.jsx";
import flashShootImage from "../assets/images/flash_shoot.png"; 

const SHOOT_BUTTON = Number(import.meta.env.VITE_SHOOT_BUTTON);
const AIM_BUTTON = Number(import.meta.env.VITE_AIM_BUTTON);

export const FireGun = (props) => {
    const [isAiming, setIsAiming] = useState(false);
    const weaponRef = useRef();
    const [isShooting, setIsShooting] = useState(false);
    const [flashShootOpacity, setFlashShootOpacity] = useState(0);
    const recoilAmount = 0.1; // Cantidad máxima de retroceso
    const aimingRecoilAmount = 0.05; // Retroceso menor cuando está apuntando
    const originalPosition = useRef(new THREE.Vector3());
    const aimPosition = new THREE.Vector3(0, 0, -1);
    const aimRotation = new THREE.Euler(0, 0.11, 0);
    const timeRef = useRef(0);
    const texture = useLoader(THREE.TextureLoader, flashShootImage);

    useEffect(() => {
        if (weaponRef.current) originalPosition.current.copy(weaponRef.current.position);

        const handleMouseDown = (button) => {
            if (!usePointerLockControlsStore.getState().isPointerLocked) return;

            switch (button.button) {
                case SHOOT_BUTTON:
                    setIsShooting(true);
                    setFlashShootOpacity(0.8); // Activa el flash al disparar
                    break;
                case AIM_BUTTON:
                    setIsAiming((prevIsAiming) => !prevIsAiming);
                    break;
            }
        };

        const handleMouseUp = () => {
            setIsShooting(false);
            fadeOutFlash(); // Iniciar fade out cuando se suelta el botón
        };

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const fadeOutFlash = () => {
        const fadeInterval = setInterval(() => {
            setFlashShootOpacity((prevOpacity) => {
                if (prevOpacity <= 0) {
                    clearInterval(fadeInterval);
                    return 0; // Asegúrate de que la opacidad no sea menor que 0
                }
                return prevOpacity - 0.05; // Disminuye la opacidad
            });
        }, 10); // Ajusta el tiempo de intervalo para un efecto más rápido o más lento
    };

    useFrame(() => {
        if (!weaponRef.current) return;

        if (isAiming) {
            weaponRef.current.position.lerp(aimPosition, 0.1);
            weaponRef.current.rotation.y -= (aimRotation.y - 0.055);
            weaponRef.current.rotation.x += (aimRotation.x - weaponRef.current.rotation.x) * 0.1;
            weaponRef.current.rotation.y += (aimRotation.y - weaponRef.current.rotation.y) * 0.1;
            weaponRef.current.rotation.z += (aimRotation.z - weaponRef.current.rotation.z) * 2.1;

            if (isShooting) {
                const aimingRecoil = new THREE.Vector3(
                    (Math.random() - 0.5) * aimingRecoilAmount,
                    (Math.random() - 0.5) * aimingRecoilAmount,
                    (Math.random() - 0.5) * aimingRecoilAmount
                );
                weaponRef.current.position.add(aimingRecoil);
            }
        } else {
            if (isShooting) {
                const randomRecoil = new THREE.Vector3(
                    (Math.random() - 0.5) * recoilAmount,
                    (Math.random() - 0.5) * recoilAmount,
                    (Math.random() - 0.5) * recoilAmount
                );
                weaponRef.current.position.add(randomRecoil);
            } else {
                timeRef.current += 0.002;
                const subtleMovement = Math.sin(timeRef.current) * 0.01;
                weaponRef.current.position.y -= subtleMovement;
            }

            weaponRef.current.position.lerp(originalPosition.current, 0.1);
            weaponRef.current.rotation.x *= 0.9;
            weaponRef.current.rotation.y *= 0.9;
            weaponRef.current.rotation.z *= 0.9;
        }
    });

    const gun = props.gun;

    
    return (
        <group {...props}>
            <group ref={weaponRef}>
                <mesh position={[2, 0.5, -0.1]} scale={[1, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial 
                        attach={"material"}
                        transparent={true}
                        map={texture} 
                        opacity={flashShootOpacity} 
                    />
                </mesh>
                {gun}
            </group>
        </group>
    );
};

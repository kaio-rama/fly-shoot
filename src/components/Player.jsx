import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import * as TWEEN from "@tweenjs/tween.js";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { usePersonControls } from "../hooks/hooks.js";
import { useFrame } from "@react-three/fiber";
import { FireGun } from "./FireGun.jsx";
import { Ak47 } from "./Ak47.jsx";
import { LegoAk47 } from "./LegoAk47.jsx";

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();

export const Player = () => {
    const playerRef = useRef();
    const { forward, backward, left, right, jump, run, switchGunLeft, switchGunRight } = usePersonControls();
    const objectInHandRef = useRef();

    const swayingObjectRef = useRef();
    const [swayingAnimation, setSwayingAnimation] = useState(null);
    const [swayingBackAnimation, setSwayingBackAnimation] = useState(null);
    const [isSwayingAnimationFinished, setIsSwayingAnimationFinished] = useState(true);
    const [currentGun, setCurrentGun] = useState(<Ak47 />); // Estado inicial para el arma
    const rapier = useRapier();

    useFrame((state) => {
        if (!playerRef.current) return;

        // Mover el jugador
        const velocity = playerRef.current.linvel();
        frontVector.set(0, 0, backward - forward);
        sideVector.set(left - right, 0, 0);
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(MOVE_SPEED)
            .applyEuler(state.camera.rotation);

        playerRef.current.wakeUp();
        playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });

        // Correr
        if (run) playerRef.current.setLinvel({ x: direction.x * 2, y: velocity.y, z: direction.z * 2 });

        // Salto
        const world = rapier.world;
        const ray = world.castRay(new RAPIER.Ray(playerRef.current.translation(), { x: 0, y: -1, z: 0 }));
        const grounded = ray || (ray.collider && Math.abs(ray.toi) <= 0.5);

        if (jump && grounded) doJump();

        // Mover cámara y objeto en mano
        const { x, y, z } = playerRef.current.translation();
        state.camera.position.set(x, y, z);

        // Solo actualizar la posición del objeto en mano (sin afectar el arma FireGun directamente)
        objectInHandRef.current.rotation.copy(state.camera.rotation);
        objectInHandRef.current.position.copy(state.camera.position).add(state.camera.getWorldDirection(rotation));

        const isMoving = direction.length() > 0;
        if (isMoving && isSwayingAnimationFinished) {
            setIsSwayingAnimationFinished(false);
            swayingAnimation.start();
        }

        // Alternar entre armas
        if (switchGunLeft){ 
            setCurrentGun(<Ak47 />)             
            document.getElementById("akSkin").style.opacity = 1;
            setTimeout(() => {
                document.getElementById("akSkin").style.opacity = .0;
            }, 300);
            }
        if (switchGunRight){ 
            setCurrentGun(<LegoAk47 />)
            document.getElementById("legoSkin").style.opacity = 1;
            setTimeout(() => {
                document.getElementById("legoSkin").style.opacity = .0;
            }, 300);    
        }
    });

    const doJump = () => {
        playerRef.current.setLinvel({ x: 0, y: 8, z: 0 });
    };

    const initSwayingObjectAnimation = () => {
        const currentPosition = new THREE.Vector3(0, 0, 0);
        const initialPosition = new THREE.Vector3(0, 0, 0);
        const newPosition = new THREE.Vector3(-0.05, 0, 0);
        const animationDuration = 300;
        const easing = TWEEN.Easing.Quadratic.Out;
        const twSwayingAnimation = new TWEEN.Tween(currentPosition)
            .to(newPosition, animationDuration)
            .easing(easing)
            .onUpdate(() => {
                swayingObjectRef.current.position.copy(currentPosition);
            });
        const twSwayingBackAnimation = new TWEEN.Tween(currentPosition)
            .to(initialPosition, animationDuration)
            .easing(easing)
            .onUpdate(() => {
                swayingObjectRef.current.position.copy(currentPosition);
            })
            .onComplete(() => {
                setIsSwayingAnimationFinished(true);
            });
        twSwayingAnimation.chain(twSwayingBackAnimation);
        setSwayingAnimation(twSwayingAnimation);
        setSwayingBackAnimation(twSwayingBackAnimation);
    };

    useEffect(() => {
        initSwayingObjectAnimation();
    }, []);

    return (
        <group>
            <RigidBody colliders={false} mass={1} ref={playerRef} lockRotations>
                <mesh castShadow>
                    <capsuleGeometry args={[0.5, 0.5]} />
                    <CapsuleCollider args={[0.75, 0.5]} />
                </mesh>
            </RigidBody>
            <group ref={objectInHandRef}>
                <group ref={swayingObjectRef}>
                    <FireGun position={[0.35, -0.15, 0.4]} scale={0.23} rotation={[0, 90, 0]} gun={currentGun} />
                </group>
            </group>
        </group>
    );
};

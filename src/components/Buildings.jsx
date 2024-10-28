import * as THREE from "three";
import {RigidBody} from "@react-three/rapier"; 
import texture from "../assets/images/metal-textura.jpg";

const cubes = [ [0, 0, -7], [2, 0, -7], [4, 0, -7], [6, 0, -7], [8, 0, -7], [10, 0, -7],  ]

export const Buildings = () => {
    return cubes.map((coords, index) => <Cube key={index} position={coords} />); } 

    const textura = new THREE.TextureLoader().load(texture);
    textura.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: textura });
    
    const Cube = (props) => { return (     
            <RigidBody {...props}> 
                <mesh castShadow receiveShadow material={material}>
                    <meshStandardMaterial map={textura} />
                    <boxGeometry /> 
                </mesh> 
            </RigidBody> ); }
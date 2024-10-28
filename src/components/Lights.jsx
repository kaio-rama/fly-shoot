import React from 'react'

export function Lights () {
  const shadowOffset = 50;
  return (
    <>
    <ambientLight intensity={0.9} />
    <directionalLight castShadow 
                      intensity={.9}
                      shadow-mapSize={4096}
                      shadow-camera-top={shadowOffset}
                      shadow-camera-bottom={-shadowOffset}
                      shadow-camera-left={shadowOffset}
                      shadow-camera-right={-shadowOffset}
                      position={[50, 50, 0]}
                  />
    </>
  )
}

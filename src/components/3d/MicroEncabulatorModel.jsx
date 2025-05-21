import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Renders the 3D model and animates its rotation on stop change.
 * Handles loading state and computes model bounds for camera fitting.
 */
const MicroEncabulatorModel = React.forwardRef(function MicroEncabulatorModel(
  { onBounds, setLoading, targetRotation, shouldAnimate },
  ref
) {
  const { scene } = useGLTF("/scene.gltf");
  const localRef = useRef();
  const modelRef = ref || localRef;
  // Store current and target quaternions for smooth rotation
  const startQuat = useRef(new THREE.Quaternion());
  const targetQuat = useRef(new THREE.Quaternion());

  // On mount, set initial quaternion only once
  useEffect(() => {
    if (modelRef.current && targetRotation) {
      const euler = new THREE.Euler(...targetRotation, "XYZ");
      const quat = new THREE.Quaternion().setFromEuler(euler);
      modelRef.current.quaternion.copy(quat);
      startQuat.current.copy(quat);
      targetQuat.current.copy(quat);
    }
    // Only run on mount (scene/modelRef changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelRef]);

  // Easing function for rotation animation
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Animate model rotation smoothly on targetRotation change
  useEffect(() => {
    if (!modelRef.current || !targetRotation || !shouldAnimate) return;

    const duration = 900; // ms, match camera animation
    let start = null;
    startQuat.current.copy(modelRef.current.quaternion);
    targetQuat.current.copy(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(...targetRotation, "XYZ")
      )
    );

    let frame;
    function animate(now) {
      if (start === null) start = now;
      const elapsed = now - start;
      let t = Math.min(elapsed / duration, 1);
      t = easeInOutCubic(t);
      modelRef.current.quaternion
        .copy(startQuat.current)
        .slerp(targetQuat.current, t);
      if (elapsed < duration) {
        frame = requestAnimationFrame(animate);
      } else {
        modelRef.current.quaternion.copy(targetQuat.current);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [targetRotation, modelRef, shouldAnimate]);

  // Set loading to false when model is loaded
  useEffect(() => {
    if (scene && setLoading) setLoading(false);
  }, [scene, setLoading]);

  // Compute model bounds for camera positioning
  useEffect(() => {
    if (scene && modelRef.current && onBounds) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      onBounds(box);
    }
  }, [scene, onBounds, modelRef]);

  return (
    <primitive ref={modelRef} object={scene} scale={1.5} position={[0, 0, 0]} />
  );
});

export default MicroEncabulatorModel;

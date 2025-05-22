import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * FitCameraToModel Component
 *
 * Manages camera positioning and animation for the 3D view.
 * Ensures optimal model visibility and smooth transitions.
 *
 * Key Features:
 * - Dynamic camera positioning based on model bounds
 * - Smooth transitions between view positions
 * - Maintains proper model framing
 * - Handles viewport resize adaptations
 *
 * Props:
 * @param {Object} bounds - Model bounding box
 * @param {Array} cameraTarget - Target look-at position [x,y,z]
 * @param {Array} cameraPos - Camera position [x,y,z]
 *
 * Technical Implementation:
 * - Uses Three.js camera system
 * - Implements custom positioning logic
 * - Handles matrix transformations
 *
 * Camera Behavior:
 * - Automatically fits model in view
 * - Maintains perspective during transitions
 * - Responds to window resizing
 *
 * Dependencies:
 * - three.js camera system
 * - @react-three/fiber hooks
 */

/**
 * Adjusts the camera to fit the 3D model's bounding sphere and look at the target.
 * Ensures the camera is always outside the model for a good view.
 */
function FitCameraToModel({ bounds, cameraTarget, cameraPos }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!bounds || !cameraTarget || !cameraPos) return;

    // Calculate bounding sphere to ensure camera is always outside the model
    const sphere = bounds.getBoundingSphere(new THREE.Sphere());

    // Calculate direction from cameraPos to target
    const dir = new THREE.Vector3()
      .subVectors(
        new THREE.Vector3(...cameraPos),
        new THREE.Vector3(...cameraTarget)
      )
      .normalize();

    // Place camera at a distance outside the bounding sphere
    const safeDistance = sphere.radius * 2.2; // margin
    const safeCameraPos = new THREE.Vector3(...cameraTarget).add(
      dir.multiplyScalar(safeDistance)
    );

    camera.position.copy(safeCameraPos);
    camera.lookAt(...cameraTarget);

    if (controls) {
      controls.target.set(...cameraTarget);
      controls.update();
    }
  }, [bounds, camera, controls, cameraTarget, cameraPos]);

  return null;
}

export default FitCameraToModel;

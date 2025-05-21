import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Component that adjusts the camera to fit the 3D model.
 * It ensures the camera is outside the model's bounding sphere
 * and points at the desired target.
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

import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";
import ModelLabel from "./components/ModelLabel";
import TouchNavControls from "./components/TouchNavControls";

const INITIAL_DESCRIPTION =
  "An nano-instrument currently used in the operation of microscopic milford trenions.  It not only provides inverse reactive current, for use in unilateral phase detractors, but is also capable of automatically synchronizing cardinal grammeters.  Power is produced by the modial interaction of magneto-reluctance and capacitive diractance.";

const INITIAL_STOP = {
  name: "Micro-encabulator",
  desc: INITIAL_DESCRIPTION,
  rotation: [0, -0.7, 0.3], // rotate 90 degrees from previous (side view)
  cameraTarget: [0, 0, 0],
  cameraPos: [-12, 0, 0], // move camera to the other side for a long-side view
  labelPos: { x: 0, y: 0, z: 0 },
  lineTo: { x: 0, y: 0, z: 0 },
  lineAnchor: "right",
};

const STOPS = [
  {
    ...INITIAL_STOP,
    lineAnchor: "left",
    line2D: { startX: 120, startY: 400, endX: 220, endY: 300 },
  },
  {
    name: "Panametric Fan",
    desc: "Regulates the modial interaction of magneto-reluctance and capacitive diractance, ensuring phase stability.",
    rotation: [Math.PI / 6, Math.PI / 3, Math.PI],
    cameraTarget: [0, -2, 0],
    cameraPos: [8, -8, 8],
    labelPos: { x: 10, y: 2, z: 0 }, // fix: move labelPos to right and up for visibility
    lineTo: { x: 2, y: 2, z: 0 },
    lineAnchor: "top",
    line2D: { startX: 200, startY: 180, endX: 300, endY: 100 },
  },
  {
    name: "Spurving Bearings",
    desc: "Provide seamless support for the ambifacient lunar waneshaft, preventing side fumbling.",
    rotation: [0.5, Math.PI, 0.2],
    cameraTarget: [0, -2, 0],
    cameraPos: [-10, 4, 10],
    labelPos: { x: -10, y: 2, z: 0 }, // fix: move labelPos closer to model
    lineTo: { x: 40, y: 20, z: -50 },
    modalClass: "spurving-modal",
    lineAnchor: "top",
    line2D: { startX: 100, startY: 220, endX: 60, endY: 100 },
  },
  {
    name: "Ambifacient Lunar Waneshaft",
    desc: "Transmits inverse reactive current to the 'up' end of the cardinal grammeters with minimal loss.",
    rotation: [0.2, -Math.PI / 3, 0.1],
    cameraTarget: [0, 0, 0],
    cameraPos: [12, 6, 6],
    labelPos: { x: -2, y: 6, z: 0 }, // fix: move labelPos up for visibility
    lineTo: { x: 80, y: 20, z: 130 },
    lineAnchor: "top",
    line2D: { startX: 180, startY: 120, endX: 250, endY: 60 },
  },
  {
    name: "Hydrocoptic Marzlevanes",
    desc: "Six marzlevanes fitted to optimize sinusoidal repleneration and reduce vibrational artifacts when employed in conjunction with a drawn reciprocation dingle arm.",
    rotation: [0.7, -0.9, 0.5],
    cameraTarget: [0, -3, 0],
    cameraPos: [0, -10, -12],
    labelPos: { x: 8, y: 8, z: -6 }, // fix: move labelPos to right and up
    lineTo: { x: 0, y: -2, z: -2 },
    modalClass: "marzlevanes-modal",
    lineAnchor: "bottom",
    line2D: { startX: 300, startY: 400, endX: 350, endY: 500 },
  },
  {
    name: "Lotus-o-Delta Main Winding",
    desc: "Panendermic semi-boloid slots house the main winding, enhancing differential girdle spring efficiency.",
    rotation: [0.2, Math.PI / 2, -0.2],
    cameraTarget: [0, 2, 0],
    cameraPos: [-8, 8, 8],
    labelPos: { x: 10, y: 0, z: 0 }, // fix: move labelPos to right
    lineTo: { x: 2, y: 0, z: 0 },
    modalClass: "lotus-modal",
    lineAnchor: "bottom",
    line2D: { startX: 400, startY: 300, endX: 500, endY: 350 },
  },
  {
    name: "Non-reversible Tremie Pipe",
    desc: "Connects every seventh conductor to the differential girdle spring, ensuring unidirectional flow.",
    rotation: [0.3, 0.2, 0],
    cameraTarget: [0, 0, 0],
    cameraPos: [7, 6, 14],
    labelPos: { x: -10, y: -2, z: 4 }, // fix: move labelPos left and down
    lineTo: { x: 1, y: -1, z: 1 },
    modalClass: "tremie-modal",
    lineAnchor: "bottom",
    line2D: { startX: 120, startY: 500, endX: 200, endY: 600 },
  },
  {
    name: "Cardinal Grammeters",
    desc: "Synchronizes the entire system, automatically adjusting for flourescent skor motion.",
    rotation: [0.1, 0.2, Math.PI / 2],
    cameraTarget: [0, 4, 0],
    cameraPos: [0, 14, 8],
    labelPos: { x: -10, y: 10, z: 0 }, // fix: move labelPos left and up
    lineTo: { x: -50, y: -51, z: -80 },
    modalClass: "grammeters-modal",
    lineAnchor: "bottom",
    line2D: { startX: 80, startY: 80, endX: 40, endY: 40 },
  },
];

// Responsive label positions for each stop
const getResponsiveLabelPos = (stop, size) => {
  // Example breakpoints (customize as needed)
  if (size.width < 600) {
    // Mobile: move labels further out, higher/lower, or shrink
    return stop.labelPosMobile || stop.labelPos || { x: 0, y: 0, z: 0 };
  } else if (size.width < 1000) {
    // Tablet: slightly different
    return stop.labelPosTablet || stop.labelPos || { x: 0, y: 0, z: 0 };
  } else {
    // Desktop
    return stop.labelPos || { x: 0, y: 0, z: 0 };
  }
};

function getDeviceType() {
  // Check for iPad specifically since newer iPads may not show up in user agent
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const platform = (navigator.platform || "").toLowerCase();
  const isMacOS = platform.startsWith("mac");

  // Use user agent detection first
  const isMobileUA = /android|iphone|ipod|opera mini|iemobile|mobile/i.test(ua);
  const isTabletUA = /ipad|tablet|kindle|playbook|silk/i.test(ua);

  // Then check screen size as a fallback
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const smallerDimension = Math.min(screenWidth, screenHeight);
  const largerDimension = Math.max(screenWidth, screenHeight);

  // iPad detection: either in UA or MacOS + touch + tablet-like dimensions
  const isTablet =
    isTabletUA ||
    (isMacOS && isTouch && smallerDimension >= 768 && largerDimension <= 1366);

  // Phone detection: either in UA or touch + phone-like dimensions
  const isMobile = isMobileUA || (isTouch && smallerDimension < 768);

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  return "desktop";
}

function getOrientation(width, height) {
  return width > height ? "l" : "p";
}

const MicroEncabulatorModel = React.forwardRef(function MicroEncabulatorModel(
  { onBounds, setLoading, targetRotation, shouldAnimate },
  ref
) {
  const { scene } = useGLTF("/scene.gltf");
  const localRef = useRef();
  const modelRef = ref || localRef;
  // Store current and target quaternions
  const startQuat = useRef(new THREE.Quaternion());
  const targetQuat = useRef(new THREE.Quaternion());
  // On mount, set initial quaternion only once (not on every targetRotation change)
  useEffect(() => {
    if (modelRef.current && targetRotation) {
      const euler = new THREE.Euler(...targetRotation, "XYZ");
      const quat = new THREE.Quaternion().setFromEuler(euler);
      modelRef.current.quaternion.copy(quat);
      startQuat.current.copy(quat);
      targetQuat.current.copy(quat);
    }
    // Only run on mount (scene/modelRef changes), not on every targetRotation change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelRef]);
  // Easing function: cubic ease-in-out
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
  useEffect(() => {
    if (scene && setLoading) setLoading(false);
  }, [scene, setLoading]);
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

// Easing function: cubic ease-in-out
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function App() {
  const [stop, setStop] = useState(0);
  const [bounds, setBounds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cameraObj, setCameraObj] = useState(null);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [fade, setFade] = useState(1); // 1 = visible, 0 = hidden
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [crossfade, setCrossfade] = useState({
    prevImg: null,
    nextImg: null,
    fading: false,
    direction: null,
  });
  const stopData = STOPS[stop];
  const modalRef = useRef();
  const modelRef = useRef();
  const [showCredits, setShowCredits] = useState(false);
  const [animatedCameraPos, setAnimatedCameraPos] = useState(
    STOPS[0].cameraPos
  );
  const [animatedCameraTarget, setAnimatedCameraTarget] = useState(
    STOPS[0].cameraTarget
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = useMemo(() => ["image1.jpg", "image2.jpg", "image3.jpg"], []);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Responsive label position for current stop
  const responsiveLabelPos = getResponsiveLabelPos(stopData, canvasSize);

  // Add: Touch navigation for mobile/tablet
  const deviceType = getDeviceType();
  const orientation = getOrientation(canvasSize.width, canvasSize.height);
  const isTouchDevice = deviceType === "mobile" || deviceType === "tablet";
  const useSnapshotsOnly = isTouchDevice;

  // Never show loading spinner for snapshot mode
  useEffect(() => {
    if (useSnapshotsOnly) {
      setLoading(false);
    }
  }, [useSnapshotsOnly]);

  // Determine snapshot folder
  let snapshotFolder = null;
  if (deviceType === "mobile") snapshotFolder = `mobile-${orientation}`;
  else if (deviceType === "tablet") snapshotFolder = `tablet-${orientation}`;

  // Compute snapshot image path
  let snapshotImg = null;
  if (snapshotFolder) {
    // e.g. stop0mp.webp for mobile-p, stop0ml.webp for mobile-l, etc.
    const stopSuffix =
      deviceType === "mobile" ? `m${orientation}` : `t${orientation}`;
    snapshotImg = `/snapshots/${snapshotFolder}/stop${stop}${stopSuffix}.webp`;
  }

  // Crossfade logic for mobile/tablet
  useEffect(() => {
    if (deviceType === "desktop") return;
    setCrossfade((prev) => ({
      prevImg: prev.nextImg || snapshotImg,
      nextImg: snapshotImg,
      fading: false,
      direction: null,
    }));
  }, [deviceType, orientation, snapshotImg]);

  // Touch navigation handler (with crossfade)
  const handleTouchNav = (direction) => {
    if (loading || crossfade.fading) return; // Block during fade
    let nextStop = stop;
    if (direction === "up") {
      nextStop = stop < STOPS.length - 1 ? stop + 1 : 0;
    } else if (direction === "down") {
      nextStop = stop > 0 ? stop - 1 : STOPS.length - 1;
    }
    if (nextStop !== stop) {
      if (deviceType !== "desktop") {
        // Start crossfade
        const nextFolder =
          deviceType === "mobile"
            ? `mobile-${orientation}`
            : `tablet-${orientation}`;
        const nextSuffix =
          deviceType === "mobile" ? `m${orientation}` : `t${orientation}`;
        const nextImg = `/snapshots/${nextFolder}/stop${nextStop}${nextSuffix}.webp`;

        // First stage: fade out current image only
        setCrossfade({
          prevImg: snapshotImg,
          nextImg: nextImg,
          fading: true,
          direction,
        });

        // After current image fades out, switch to next image
        setTimeout(() => {
          setStop(nextStop);
          // Small delay before starting fade-in of new image
          setTimeout(() => {
            setCrossfade((prev) => ({
              ...prev,
              fading: false,
              prevImg: null,
            }));
          }, 50); // Small delay for better visual separation
        }, 400); // Matches CSS transition duration
      } else {
        setStop(nextStop);
      }
    }
  };

  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
      // Only set loading to true if device type is changing from mobile/tablet to desktop
      // Otherwise, keep using the model and don't trigger loading spinner
      // (This prevents spinner on every desktop resize)
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fade logic on scroll
  useEffect(() => {
    let timeout;
    const onWheel = (e) => {
      e.preventDefault(); // Prevent default scroll behavior
      if (loading) return;
      let nextStop = stop;
      if (e.deltaY > 0) {
        nextStop = stop < STOPS.length - 1 ? stop + 1 : 0; // loop to start
      } else if (e.deltaY < 0) {
        nextStop = stop > 0 ? stop - 1 : STOPS.length - 1; // loop to end
      }
      if (nextStop !== stop) {
        setFade(0); // fade out
        setShouldAnimate(false); // Prevent animation during fade out
        timeout = setTimeout(() => {
          setStop(nextStop);
          setFade(1); // fade in
          setShouldAnimate(true); // Start animation after fade in
        }, 250); // fade out duration
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(timeout);
    };
  }, [stop, loading]);

  // Animate camera position and target when stop changes
  useEffect(() => {
    const duration = 900; // ms, match model rotation duration
    const startPos = animatedCameraPos.slice();
    const endPos = stopData.cameraPos.slice();
    const startTarget = animatedCameraTarget.slice();
    const endTarget = stopData.cameraTarget.slice();
    let startTime = null;
    let frame;
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
    function animate(now) {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      let t = Math.min(elapsed / duration, 1);
      t = easeInOutCubic(t);
      setAnimatedCameraPos([
        lerp(startPos[0], endPos[0], t),
        lerp(startPos[1], endPos[1], t),
        lerp(startPos[2], endPos[2], t),
      ]);
      setAnimatedCameraTarget([
        lerp(startTarget[0], endTarget[0], t),
        lerp(startTarget[1], endTarget[1], t),
        lerp(startTarget[2], endTarget[2], t),
      ]);
      if (elapsed < duration) {
        frame = requestAnimationFrame(animate);
      } else {
        setAnimatedCameraPos(endPos);
        setAnimatedCameraTarget(endTarget);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [
    stop,
    animatedCameraPos,
    animatedCameraTarget,
    stopData.cameraPos,
    stopData.cameraTarget,
  ]);

  // Helper to project 3D to 2D
  function project3DToScreen(vec3, camera, size) {
    if (!camera) return { x: 0, y: 0 };
    const projected = vec3.clone().project(camera);
    return {
      x: ((projected.x + 1) / 2) * size.width,
      y: ((-projected.y + 1) / 2) * size.height,
    };
  }

  // Get modal position
  const [modalPos, setModalPos] = useState(null);
  useLayoutEffect(() => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setModalPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [stop, canvasSize]);

  // Project 3D point to 2D for all stops
  let lineProps = null;
  if (deviceType !== "desktop" && stopData.line2D && stop !== 0) {
    // Use fixed 2D coordinates for mobile/tablet
    lineProps = stopData.line2D;
  } else if (cameraObj && modalPos && stopData.lineTo) {
    const screen = project3DToScreen(
      new THREE.Vector3(
        stopData.lineTo.x,
        stopData.lineTo.y,
        stopData.lineTo.z
      ),
      cameraObj,
      canvasSize
    );
    // Anchor logic for modal endpoint
    let startX = modalPos.x;
    let startY = modalPos.y;
    switch (stopData.lineAnchor) {
      case "left":
        startX = modalPos.x - modalPos.width / 2;
        break;
      case "right":
        startX = modalPos.x + modalPos.width / 2;
        break;
      case "top":
        startY = modalPos.y - modalPos.height / 2;
        break;
      case "bottom":
        startY = modalPos.y + modalPos.height / 2;
        break;
      default:
        // Center (current behavior)
        break;
    }
    const endX = screen.x;
    const endY = screen.y;
    lineProps = { startX, startY, endX, endY };
  }

  // Determine modalClass for current stop
  const modalClass = stopData.modalClass || undefined;

  return (
    <div className="app-container">
      <main className="viewer-main">
        {/* Snapshots for mobile/tablet, 3D model for desktop */}
        {useSnapshotsOnly ? (
          <div className="snapshot-crossfade">
            {/* Current image (will fade out) */}
            {crossfade.prevImg && (
              <img
                src={crossfade.prevImg}
                alt=""
                className={`snapshot-img current${
                  crossfade.fading ? " fade-out" : ""
                }`}
              />
            )}
            {/* Next image (hidden until current fades out) */}
            {crossfade.nextImg && (
              <img
                src={crossfade.nextImg}
                alt=""
                className={`snapshot-img next${
                  !crossfade.prevImg ? " fade-in" : ""
                }`}
              />
            )}
            {/* SVG lines overlay, always above images */}
            {lineProps && stop !== 0 && (
              <svg
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100vw",
                  height: "100vh",
                  pointerEvents: "none",
                  zIndex: 10001, // above images and overlays
                }}
                width="100vw"
                height="100vh"
              >
                <line
                  x1={lineProps.startX}
                  y1={lineProps.startY}
                  x2={lineProps.endX}
                  y2={lineProps.endY}
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx={lineProps.startX}
                  cy={lineProps.startY}
                  r="3"
                  fill="#fff"
                  stroke="#fff"
                  strokeWidth="1.2"
                />
                <circle
                  cx={lineProps.endX}
                  cy={lineProps.endY}
                  r="3"
                  fill="#fff"
                  stroke="#fff"
                  strokeWidth="1.2"
                />
              </svg>
            )}
          </div>
        ) : deviceType !== "desktop" && !snapshotImg ? (
          <div style={{ color: "#fff", textAlign: "center", marginTop: "2em" }}>
            No image available for this device/stop.
          </div>
        ) : (
          <Canvas
            camera={{
              position: [-200, 0, 0],
              fov: 45,
              near: 0.1,
              far: 5000,
            }}
            shadows
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            }}
            onCreated={({ camera, size }) => {
              setCameraObj(camera);
              setCanvasSize({ width: size.width, height: size.height });
            }}
            onResize={({ size }) =>
              setCanvasSize({ width: size.width, height: size.height })
            }
          >
            <color attach="background" args={["#44484f"]} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 20, 20]} intensity={0.7} />
            <MicroEncabulatorModel
              ref={modelRef}
              onBounds={setBounds}
              setLoading={setLoading}
              targetRotation={stopData.rotation}
              shouldAnimate={shouldAnimate}
            />
            <FitCameraToModel
              bounds={bounds}
              cameraTarget={animatedCameraTarget}
              cameraPos={animatedCameraPos}
            />
            <Environment preset="city" />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        )}
        {/* Loading spinner overlay: only show when loading is true */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <div className="loading-text">Loading 3D model...</div>
          </div>
        )}
        {/* Title and overlays: always together and centered beneath title on all devices */}
        <div
          className="title-and-overlays"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            zIndex: 3000,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 0,
          }}
        >
          <span
            className="floating-title"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 0,
              pointerEvents: "auto",
              fontSize: "2.1rem",
              fontWeight: 700,
              letterSpacing: "0.01em",
            }}
          >
            Micro-encabulator
          </span>
          <div
            className="top-overlays"
            style={{
              textAlign: "center",
              pointerEvents: "auto",
              background: "none",
              marginTop: 8,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <span className="scroll-hint">Scroll through demo</span>
            <span
              className="credits-link"
              style={{ marginLeft: 16, cursor: "pointer" }}
              onClick={() => setShowCredits(true)}
            >
              credits
            </span>
          </div>
        </div>
        {/* Model label overlay */}
        <ModelLabel
          label={stopData.name}
          desc={stopData.desc}
          isStart={stop === 0}
          isPanametric={stop === 1}
          modalRef={modalRef}
          modalClass={modalClass}
          labelPos={responsiveLabelPos}
        />
        {/* SVG lines overlay for desktop (already handled above for mobile/tablet) */}
        {deviceType === "desktop" && lineProps && stop !== 0 && (
          <svg
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              pointerEvents: "none",
              zIndex: 10001, // higher than overlays
              width: "100vw",
              height: "100vh",
              opacity: fade,
              transition: "opacity 1.5s cubic-bezier(.4,0,.2,1)",
            }}
            width="100vw"
            height="100vh"
          >
            <line
              x1={lineProps.startX}
              y1={lineProps.startY}
              x2={lineProps.endX}
              y2={lineProps.endY}
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle
              cx={lineProps.startX}
              cy={lineProps.startY}
              r="3"
              fill="#fff"
              stroke="#fff"
              strokeWidth="1.2"
            />
            <circle
              cx={lineProps.endX}
              cy={lineProps.endY}
              r="3"
              fill="#fff"
              stroke="#fff"
              strokeWidth="1.2"
            />
          </svg>
        )}
        {/* Touch controls for mobile/tablet: always above overlays and modal */}
        {isTouchDevice && (
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 4000,
              pointerEvents: "none",
            }}
          >
            <div style={{ pointerEvents: "auto" }}>
              <TouchNavControls onNav={handleTouchNav} />
            </div>
          </div>
        )}
        {/* Bottom overlays container (fix z-index: always above modal overlay) */}
        {showCredits && (
          <div
            className="credits-modal-overlay"
            style={{ zIndex: 2000 }}
            onClick={() => setShowCredits(false)}
          >
            <div className="credits-modal" onClick={(e) => e.stopPropagation()}>
              <span
                className="credits-close"
                onClick={() => setShowCredits(false)}
              >
                close
              </span>
              <div className="credits-content">
                <div className="credits-blurb">
                  Website by David G. Smith, (c) 2025, DGS Creative, LLC
                </div>
                <div className="credits-adapted">
                  Adapted from these originals:
                </div>
                <div>
                  <a
                    href="https://www.youtube.com/watch?v=Ac7G7xOG2Ag"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Turbo encabulator
                  </a>
                </div>
                <div>
                  <a
                    href="https://www.youtube.com/watch?v=RXJKdh1KZ0w"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Retro encabulator
                  </a>
                </div>
                <div className="license-credit">
                  3d model: This work is based on{" "}
                  <a
                    href="https://sketchfab.com/3d-models/scifi-generator-bf2e1a087adb4628a376ffbed17c41ff"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    "SCIFI GENERATOR"
                  </a>{" "}
                  by{" "}
                  <a
                    href="https://sketchfab.com/LordCinn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cinnamine3D
                  </a>{" "}
                  licensed under{" "}
                  <a
                    href="http://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CC-BY-4.0
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="image-container">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="Showcase"
              className={`image ${
                index === activeImageIndex ? "visible" : "hidden"
              }`}
            />
          ))}
        </div>
        <button onClick={handleNextImage}>Next Image</button>
      </main>
    </div>
  );
}

export default App;

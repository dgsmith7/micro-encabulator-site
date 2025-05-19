import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";

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
  { ...INITIAL_STOP, lineAnchor: "left" },
  {
    name: "Panametric Fan",
    desc: "Regulates the modial interaction of magneto-reluctance and capacitive diractance, ensuring phase stability.",
    rotation: [Math.PI / 6, Math.PI / 3, Math.PI],
    cameraTarget: [0, -2, 0],
    cameraPos: [8, -8, 8],
    labelPos: { x: 10, y: 2, z: 0 }, // fix: move labelPos to right and up for visibility
    lineTo: { x: 2, y: 2, z: 0 },
    lineAnchor: "top",
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

const MicroEncabulatorModel = React.forwardRef(function MicroEncabulatorModel(
  { onBounds, userRotated, stop, setLoading, targetRotation, shouldAnimate },
  ref
) {
  const { scene } = useGLTF("/scene.gltf");
  const localRef = useRef();
  const modelRef = ref || localRef;
  // Store current and target quaternions
  const startQuat = useRef(new THREE.Quaternion());
  const targetQuat = useRef(new THREE.Quaternion());
  // On mount, set initial quaternion
  useEffect(() => {
    if (modelRef.current && targetRotation) {
      const euler = new THREE.Euler(...targetRotation, "XYZ");
      const quat = new THREE.Quaternion().setFromEuler(euler);
      modelRef.current.quaternion.copy(quat);
      startQuat.current.copy(quat);
      targetQuat.current.copy(quat);
    }
  }, []); // Only run on mount!
  // Easing function: cubic ease-in-out
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  // On targetRotation change, update target quaternion and animate
  useEffect(() => {
    if (!modelRef.current || !targetRotation || !shouldAnimate) return;
    const duration = 900; // ms, adjust for slower/faster
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

function ModelLabel({
  label,
  desc,
  isStart,
  isPanametric,
  modalRef,
  modalClass,
  labelPos,
}) {
  let className = "model-label-overlay";
  if (isStart) className += " start-modal";
  if (isPanametric) className += " panametric-modal";
  if (modalClass) className += ` ${modalClass}`;
  return (
    <div className={className} ref={modalRef}>
      <div className="model-label-title">{label}</div>
      <div className="model-label-desc">{desc}</div>
    </div>
  );
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
  const stopData = STOPS[stop];
  const modalRef = useRef();
  const modelRef = useRef();
  const [userRotated, setUserRotated] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [animatedCameraPos, setAnimatedCameraPos] = useState(
    STOPS[0].cameraPos
  );
  const [animatedCameraTarget, setAnimatedCameraTarget] = useState(
    STOPS[0].cameraTarget
  );

  // Responsive label position for current stop
  const responsiveLabelPos = getResponsiveLabelPos(stopData, canvasSize);

  // Update canvas size on resize
  useEffect(() => {
    const handleResize = () =>
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
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
  if (cameraObj && modalPos && stopData.lineTo) {
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
        <Canvas
          camera={{
            position: [-200, 0, 0], // Zoom out much further
            fov: 45,
            near: 0.1,
            far: 5000, // Increase far plane for safety
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
            userRotated={userRotated}
            onBounds={setBounds}
            stop={stop}
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
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            onStart={() => setUserRotated(true)}
            onEnd={() => setUserRotated(false)}
          />
        </Canvas>
        {/* Loading overlay with fade-out */}
        {loading && (
          <div
            className="loading-overlay"
            style={{
              opacity: fade,
              pointerEvents: fade === 0 ? "none" : "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "fixed",
              inset: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1000,
              background: "transparent",
              fontFamily: "'Julius Sans One', 'Tourney', sans-serif",
              fontSize: "1.02rem",
              color: "#e0e0e0",
              transition: "opacity 0.5s cubic-bezier(.4,0,.2,1)",
              margin: 0,
              padding: 0,
            }}
          >
            <span className="spinner" style={{ marginBottom: "1.1em" }}></span>
            <span
              className="loading-text"
              style={{
                color: "#e0e0e0",
                fontFamily: "'Julius Sans One', 'Tourney', sans-serif",
                fontSize: "1.02rem",
                background: "none",
                zIndex: 101,
                textAlign: "center",
              }}
            >
              Loading...
            </span>
          </div>
        )}
        <span className="floating-title">Micro-encabulator</span>
        <ModelLabel
          label={stopData.name}
          desc={stopData.desc}
          isStart={stop === 0}
          isPanametric={stop === 1}
          modalRef={modalRef}
          modalClass={modalClass}
          labelPos={responsiveLabelPos}
        />
        {lineProps && stop !== 0 && (
          <svg
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              pointerEvents: "none",
              zIndex: 20,
              width: "100vw",
              height: "100vh",
              opacity: fade,
              transition: "opacity 0.5s cubic-bezier(.4,0,.2,1)",
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
            {/* Add a small white dot at each end of the line (radius 3) */}
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
        {/* Bottom overlays container */}
        <div className="bottom-overlays">
          <span className="scroll-hint">Scroll through demo</span>
          <span className="credits-link" onClick={() => setShowCredits(true)}>
            credits
          </span>
        </div>
        {showCredits && (
          <div
            className="credits-modal-overlay"
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
        {/* Fade modal using opacity and transition */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap');
          body, .app-container, .viewer-main {
            background: #44484f !important;
          }
          .bottom-overlays {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-end;
            gap: 2.5rem;
            z-index: 40;
            pointer-events: none;
            padding-bottom: 2.2rem;
          }
          .bottom-overlays .scroll-hint,
          .bottom-overlays .credits-link {
            position: static !important;
            pointer-events: auto;
            margin: 0 0.5em;
            left: unset !important;
            top: unset !important;
          }
          .bottom-overlays .scroll-hint {
            font-size: 0.82rem;
            color: #e0e0e0;
            opacity: 0.85;
            user-select: none;
          }
          .bottom-overlays .credits-link {
            font-size: 0.82rem;
            color: #b0e0ff;
            text-decoration: underline;
            cursor: pointer;
            transition: color 0.2s;
          }
          .bottom-overlays .credits-link:hover {
            color: #fff;
          }
          .loading-overlay {
            /* Remove all float, margin, and padding, and force flex centering */
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 1000;
            background: transparent !important;
            font-family: 'Julius Sans One', 'Tourney', sans-serif !important;
            font-size: 1.02rem !important;
            color: #e0e0e0 !important;
            transition: opacity 0.5s cubic-bezier(.4,0,.2,1) !important;
            pointer-events: auto !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .loading-overlay .spinner {
            width: 2.2em;
            height: 2.2em;
            border: 3px solid #b0e0ff;
            border-top: 3px solid #44484f;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1.1em;
          }
          .loading-overlay .loading-text {
            color: #e0e0e0 !important;
            font-family: 'Julius Sans One', 'Tourney', sans-serif !important;
            font-size: 1.02rem !important;
            background: none !important;
            z-index: 101;
            text-align: center !important;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .model-label-overlay,
          .model-label-overlay * {
            font-family: 'Julius Sans One', 'Tourney', sans-serif !important;
          }
          .model-label-overlay {
            opacity: ${fade};
            transition: opacity 0.5s cubic-bezier(.4,0,.2,1);
          }
          .floating-title {
            font-family: 'Julius Sans One', 'Tourney', sans-serif;
            position: absolute;
            left: 2rem;
            top: 2rem;
            z-index: 30;
          }
          .credits-link,
          .scroll-hint {
            display: inline !important;
          }
          .credits-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(20, 24, 32, 0.75);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s;
          }
          .credits-modal {
            background: #23272f;
            border-radius: 12px;
            box-shadow: 0 4px 32px #000a;
            padding: 2.2rem 2.5rem 1.5rem 2.5rem;
            min-width: 340px;
            max-width: 95vw;
            font-family: 'Julius Sans One', 'Tourney', sans-serif;
            color: #e0e0e0;
            position: relative;
            text-align: left;
            animation: popIn 0.2s;
          }
          .credits-close {
            position: absolute;
            top: 1.1rem;
            right: 1.5rem;
            font-size: 1.1rem;
            color: #b0e0ff;
            cursor: pointer;
            font-family: 'Julius Sans One', 'Tourney', sans-serif;
            text-decoration: underline;
          }
          .credits-content a {
            color: #b0e0ff;
            text-decoration: underline;
            font-family: 'Julius Sans One', 'Tourney', sans-serif;
            font-size: 1rem;
          }
          .credits-content a:hover {
            color: #fff;
          }
          .credits-adapted {
            font-size: 1rem;
            color: #b0e0ff;
            font-family: 'Julius Sans One', 'Tourney', sans-serif;
            margin-bottom: 0.5em;
            margin-top: 0.2em;
            letter-spacing: 0.01em;
          }
          .license-credit {
            margin-top: 1.2em;
            font-size: 0.95rem;
            color: #b0e0ff;
            line-height: 1.5;
          }
          .credits-blurb {
            font-size: 1.08rem;
            color: #e0e0e0;
            font-family: 'Julius Sans One', 'Tourney', sans-serif;
            margin-bottom: 1.2em;
            letter-spacing: 0.01em;
          }
          .model-label-overlay.start-modal {
            font-family: 'Julius Sans One', 'Tourney', sans-serif !important;
            min-width: 420px;
            max-width: 90vw;
            padding: 2.2rem 2.8rem 2.2rem 2.8rem;
            font-size: 1.18rem;
            letter-spacing: 0.01em;
            background: transparent !important;
            border-radius: 18px;
            box-shadow: none;
            color: #e0e0e0;
            text-align: center;
            line-height: 1.6;
          }
          @media (max-width: 600px) {
            .model-label-overlay {
              font-size: 0.92rem !important;
              min-width: 180px !important;
              max-width: 90vw !important;
              padding: 1.1rem 1.2rem 1.1rem 1.2rem !important;
            }
            .floating-title {
              font-size: 1.1rem !important;
              left: 1rem !important;
              top: 1rem !important;
            }
            .bottom-overlays {
              gap: 1.2rem;
              padding-bottom: 1.1rem;
            }
            .bottom-overlays .scroll-hint,
            .bottom-overlays .credits-link {
              font-size: 0.62rem !important;
            }
            .credits-modal {
              min-width: 180px !important;
              padding: 1.1rem 1.2rem 1.1rem 1.2rem !important;
              font-size: 0.92rem !important;
            }
          }
          @media (max-width: 1000px) and (min-width: 601px) {
            .model-label-overlay {
              font-size: 1.02rem !important;
              min-width: 260px !important;
              max-width: 95vw !important;
              padding: 1.5rem 1.7rem 1.5rem 1.7rem !important;
            }
            .floating-title {
              font-size: 1.2rem !important;
              left: 1.3rem !important;
              top: 1.3rem !important;
            }
            .bottom-overlays {
              gap: 1.8rem;
              padding-bottom: 1.5rem;
            }
            .bottom-overlays .scroll-hint,
            .bottom-overlays .credits-link {
              font-size: 0.72rem !important;
            }
            .credits-modal {
              min-width: 260px !important;
              padding: 1.5rem 1.7rem 1.5rem 1.7rem !important;
              font-size: 1.02rem !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}

export default App;

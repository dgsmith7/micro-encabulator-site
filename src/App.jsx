import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";
import ModelLabel from "./components/ModelLabel";
import TouchNavControls from "./components/TouchNavControls";
import { STOPS, getResponsiveLabelPos } from "./data/stopsData";
import { getDeviceType, getOrientation } from "./utils/deviceDetection";
import { easeInOutCubic, lerp, project3DToScreen } from "./utils/animation";
import MicroEncabulatorModel from "./components/3d/MicroEncabulatorModel";
import FitCameraToModel from "./components/3d/FitCameraToModel";
import CreditsModal from "./components/CreditsModal";
import SVGLines from "./components/SVGLines";
import SnapshotDisplay from "./components/SnapshotDisplay";

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

  // Force show touch controls if device has touch capability OR deviceType is mobile/tablet
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isTouchDevice =
    deviceType === "mobile" || deviceType === "tablet" || isTouch;
  const useSnapshotsOnly = isTouchDevice;

  // Log device info to help with debugging
  useEffect(() => {
    console.log("App detected:", {
      deviceType,
      orientation,
      isTouchDevice,
      width: canvasSize.width,
      height: canvasSize.height,
    });
  }, [deviceType, orientation, canvasSize, isTouchDevice]);

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
          <SnapshotDisplay
            crossfade={{
              phase: crossfade.fading
                ? "fade-out"
                : crossfade.prevImg
                ? "idle"
                : "fade-in",
              prev: crossfade.prevImg,
              next: crossfade.nextImg,
            }}
            snapshotImg={snapshotImg}
            stop={stop}
            lineProps={lineProps}
          />
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
          deviceType={deviceType}
          orientation={orientation}
          viewportSize={canvasSize}
        />
        {/* SVG lines overlay for desktop (already handled above for mobile/tablet) */}
        {deviceType === "desktop" && lineProps && stop !== 0 && (
          <SVGLines
            lineProps={lineProps}
            visible={true}
            opacity={fade}
            isFixed={true}
          />
        )}
        {/* Touch controls for mobile/tablet: always above overlays and modal */}
        {isTouchDevice && (
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10000, // Highest z-index to ensure visibility
              pointerEvents: "none",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                pointerEvents: "auto",
                position: "absolute",
                right: "1.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                filter: "drop-shadow(0px 0px 5px rgba(0,0,0,0.5))",
              }}
            >
              <TouchNavControls onNav={handleTouchNav} />
            </div>
          </div>
        )}
        {/* Credits modal */}
        {showCredits && (
          <CreditsModal
            showCredits={showCredits}
            setShowCredits={setShowCredits}
          />
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

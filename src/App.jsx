import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
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

/**
 * Main Application Component
 *
 * Core Responsibilities:
 * 1. Device Detection & Adaptation
 *    - Determines device type (desktop/tablet/mobile)
 *    - Handles orientation changes
 *    - Manages progressive enhancement strategy
 *
 * 2. State Management
 *    - Navigation state (current stop, transitions)
 *    - Camera positions and animations
 *    - Fade transitions across components
 *
 * 3. Layout Coordination
 *    - Label positioning
 *    - SVG line connections
 *    - Touch controls placement
 *
 * 4. Performance Optimization
 *    - Conditional 3D rendering
 *    - Image sequence management
 *    - Transition timing
 *
 * Critical Dependencies:
 * - three.js: 3D rendering
 * - react-three/fiber: React Three.js bindings
 * - SVGLines: Overlay connection system
 * - ModelLabel: Information display
 * - TouchNavControls: Mobile/tablet navigation
 */

/**
 * Main application component for the Micro-encabulator interactive site.
 * Handles 3D model, snapshot mode, navigation, overlays, and responsive logic.
 */
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

  // Responsive label position for current stop
  const responsiveLabelPos = getResponsiveLabelPos(stopData, canvasSize);

  // Device and orientation detection
  const deviceType = getDeviceType();
  const orientation = getOrientation(canvasSize.width, canvasSize.height);

  // Touch device detection for navigation and snapshot mode
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isTouchDevice =
    deviceType === "mobile" || deviceType === "tablet" || isTouch;
  const useSnapshotsOnly = isTouchDevice;

  // Log device info for debugging

  // Never show loading spinner for snapshot mode
  useEffect(() => {
    if (useSnapshotsOnly) {
      setLoading(false);
    }
  }, [useSnapshotsOnly]);

  // Determine snapshot folder and image path for current stop
  let snapshotFolder = null;
  if (deviceType === "mobile") snapshotFolder = `mobile-${orientation}`;
  else if (deviceType === "tablet") snapshotFolder = `tablet-${orientation}`;

  let snapshotImg = null;
  if (snapshotFolder) {
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
    if (loading || crossfade.fading) return;
    let nextStop = stop;

    // Fade out the current overlay and lines
    setFade(0);

    if (direction === "up") {
      nextStop = stop < STOPS.length - 1 ? stop + 1 : 0;
    } else if (direction === "down") {
      nextStop = stop > 0 ? stop - 1 : STOPS.length - 1;
    }
    if (nextStop !== stop) {
      // Fade out current overlays
      setFade(0);
      setShouldAnimate(false);

      if (deviceType !== "desktop") {
        // Start crossfade after overlay fade out
        const nextFolder =
          deviceType === "mobile"
            ? `mobile-${orientation}`
            : `tablet-${orientation}`;
        const nextSuffix =
          deviceType === "mobile" ? `m${orientation}` : `t${orientation}`;
        const nextImg = `/snapshots/${nextFolder}/stop${nextStop}${nextSuffix}.webp`;

        setCrossfade({
          prevImg: snapshotImg,
          nextImg: nextImg,
          fading: true,
          direction,
        });

        setTimeout(() => {
          setStop(nextStop);
          setTimeout(() => {
            setCrossfade((prev) => ({
              ...prev,
              fading: false,
              prevImg: null,
            }));
            // Fade in the new overlay and lines
            setFade(1);
            setShouldAnimate(true);
          }, 50);
        }, 400);
      } else {
        setStop(nextStop);
      }
    }
  };

  // Update canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fade logic on scroll: fade out, change stop, fade in
  useEffect(() => {
    let timeout;
    let lastScrollTime = 0;
    const scrollDelay = 500; // Minimum time between scrolls (ms)
    const scrollThreshold = 20; // Minimum scroll delta to trigger navigation
    const fadeOutDuration = 400; // Match the CSS transition duration

    const onWheel = (e) => {
      e.preventDefault();
      if (loading) return;

      const now = Date.now();
      if (now - lastScrollTime < scrollDelay) {
        return; // Ignore scroll events that happen too quickly
      }

      // Only process scroll if the delta is above our threshold
      if (Math.abs(e.deltaY) < scrollThreshold) {
        return;
      }

      let nextStop = stop;
      if (e.deltaY > 0) {
        nextStop = stop < STOPS.length - 1 ? stop + 1 : 0;
      } else if (e.deltaY < 0) {
        nextStop = stop > 0 ? stop - 1 : STOPS.length - 1;
      }

      if (nextStop !== stop) {
        lastScrollTime = now;
        setFade(0);
        setShouldAnimate(false);

        // Wait for fade out to complete before changing stop
        timeout = setTimeout(() => {
          setStop(nextStop);
          // Wait a frame before starting fade in
          requestAnimationFrame(() => {
            setFade(1);
            setShouldAnimate(true);
          });
        }, fadeOutDuration);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(timeout);
    };
  }, [stop, loading]);

  // Animate camera position and target on stop change
  useEffect(() => {
    const duration = 900;
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

  // Get modal position for overlay line calculation
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

  // Calculate lineProps for SVG overlay (desktop) or use 2D for mobile/tablet
  let lineProps = null;
  if (deviceType !== "desktop" && stop !== 0) {
    // Device/orientation-specific overrides for mobile/tablet
    let override = null;
    if (deviceType === "mobile") {
      if (orientation === "p" && stopData.line2DMobilePortrait) {
        override = stopData.line2DMobilePortrait;
      } else if (orientation === "l" && stopData.line2DMobileLandscape) {
        override = stopData.line2DMobileLandscape;
      }
    } else if (deviceType === "tablet") {
      if (orientation === "p" && stopData.line2DTabletPortrait) {
        override = stopData.line2DTabletPortrait;
      } else if (orientation === "l" && stopData.line2DTabletLandscape) {
        override = stopData.line2DTabletLandscape;
      }
    }
    lineProps = override || stopData.line2D || null;
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
          <div className="no-image-available">
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
            className="canvas"
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
        <div className="title-and-overlays">
          <span className="floating-title">Micro-encabulator</span>
          <div className="top-overlays">
            <span className="scroll-hint">Scroll through demo</span>
            <span className="credits-link" onClick={() => setShowCredits(true)}>
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
          fade={fade}
        />
        {/* SVG lines overlay for desktop (already handled above for mobile/tablet) */}
        {deviceType === "desktop" && lineProps && (
          <SVGLines
            lineProps={lineProps}
            visible={fade === 1 && stop !== 0}
            isFixed={true}
          />
        )}
        {/* Touch controls for mobile/tablet: always above overlays and modal */}
        {isTouchDevice && (
          <div className="touch-controls-outer">
            <div className="touch-controls-inner">
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
      </main>
    </div>
  );
}

export default App;

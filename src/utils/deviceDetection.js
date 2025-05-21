/**
 * Utility functions for device type and orientation detection.
 * Used to determine whether to show 3D model or static images.
 */

/**
 * Detects the type of device being used (mobile, tablet, or desktop)
 * Uses a combination of user agent detection and screen dimension analysis
 */
export function getDeviceType() {
  // Force tablet detection for testing - REMOVE THIS AFTER TESTING
  if (localStorage.getItem("forceTablet") === "true") {
    console.log("FORCING TABLET MODE FOR TESTING");
    return "tablet";
  }

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

  // More aggressive tablet detection that prioritizes screen size
  const isTabletSize =
    isTouch && smallerDimension >= 600 && smallerDimension <= 1200;

  const isTablet =
    isTabletUA ||
    isTabletSize ||
    (isMacOS && isTouch && smallerDimension >= 768 && largerDimension <= 1366);

  // Phone detection: either in UA or touch + phone-like dimensions
  const isMobile = isMobileUA || (isTouch && smallerDimension < 600);

  // Log the detection details to the console
  console.log("Device detection:", {
    ua,
    isTouch,
    screenSize: `${screenWidth}x${screenHeight}`,
    smallerDimension,
    largerDimension,
    isMobileUA,
    isTabletUA,
    isTabletSize,
    deviceType: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
  });

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  return "desktop";
}

/**
 * Determines the orientation of the device (landscape or portrait)
 */
export function getOrientation(width, height) {
  return width > height ? "l" : "p";
}

/**
 * Helper function for easing animations
 */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

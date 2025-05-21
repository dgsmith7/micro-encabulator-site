/**
 * Device detection utilities for responsive UI logic.
 */

/**
 * Returns device type: 'mobile', 'tablet', or 'desktop'.
 * Uses user agent, screen size, and touch capability.
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

  // User agent and screen size checks
  const isMobileUA = /android|iphone|ipod|opera mini|iemobile|mobile/i.test(ua);
  const isTabletUA = /ipad|tablet|kindle|playbook|silk/i.test(ua);
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const smallerDimension = Math.min(screenWidth, screenHeight);
  const largerDimension = Math.max(screenWidth, screenHeight);
  const isTabletSize =
    isTouch && smallerDimension >= 600 && smallerDimension <= 1200;
  const isTablet =
    isTabletUA ||
    isTabletSize ||
    (isMacOS && isTouch && smallerDimension >= 768 && largerDimension <= 1366);
  const isMobile = isMobileUA || (isTouch && smallerDimension < 600);

  // Log detection details for debugging
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
 * Returns orientation: 'l' (landscape) or 'p' (portrait).
 */
export function getOrientation(width, height) {
  return width > height ? "l" : "p";
}

/**
 * Easing function for animation (duplicate, for convenience).
 */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

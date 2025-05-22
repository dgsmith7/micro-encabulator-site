/**
 * Device Detection Utilities
 *
 * Handles device type detection and orientation management.
 * Critical for progressive enhancement strategy.
 *
 * Functions:
 *
 * getDeviceType:
 * - Determines device category (desktop/tablet/mobile)
 * - Uses screen dimensions and touch capability
 * - Informs rendering strategy selection
 *
 * getOrientation:
 * - Calculates current device orientation
 * - Handles edge cases and size thresholds
 * - Triggers appropriate layout adjustments
 *
 * Usage:
 * These utilities drive the core responsive behavior
 * and ensure optimal performance across devices.
 *
 * Dependencies:
 * - Used by App.jsx for initial setup
 * - Informs SnapshotDisplay image selection
 * - Guides ModelLabel positioning
 */

/**
 * Device detection utilities for responsive UI logic.
 */

/**
 * Returns device type: 'mobile', 'tablet', or 'desktop'.
 * Uses user agent, screen size, and touch capability.
 */
export function getDeviceType() {
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

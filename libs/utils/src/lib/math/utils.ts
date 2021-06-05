export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * converts angles from RADIANS into the current angleMode
 */
export function toDegrees(rad: number) {
  return rad * 180.0 / Math.PI;
}

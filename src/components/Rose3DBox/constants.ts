export const ANIMATION_CONFIG = {
  FRAME_RATE: 30,
  TIME_SCALE: 0.5,
  PAUSE_FRAME: 20,
  BOX_ROTATION_SPEED: 0.01,
  MODEL_ROTATION_SPEED: 0.005,
} as const;

export const CAMERA_CONFIG = {
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  POSITION: { x: 0, y: 3, z: 3 },
} as const;

export const BLOOM_CONFIG = {
  STRENGTH: 1.8,
  RADIUS: 0.6,
  THRESHOLD: 0.02,
} as const;

export const LIGHT_CONFIG = {
  AMBIENT: { color: 0xffffff, intensity: 0.3 },
  DIRECTIONAL: { color: 0xffffff, intensity: 1, position: { x: 5, y: 5, z: 5 } },
  BOX_LIGHT: { color: 0xff0000, intensity: 2, distance: 10 },
} as const;

export type AnimationState = "initial" | "rotate" | "moving" | "paused" | "open" | "modelRotate";

export const MODEL_PATH = "/Ring Box1.glb";

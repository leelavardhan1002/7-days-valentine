import * as THREE from "three";
import { ANIMATION_CONFIG } from "./constants";

export const isRingSpinAnimation = (clip: THREE.AnimationClip): boolean => {
  return clip.name.toLowerCase().includes('ring') || (clip.duration > 4 && clip.duration < 6);
};

export const setupAnimationAction = (
  mixer: THREE.AnimationMixer,
  clip: THREE.AnimationClip
): THREE.AnimationAction => {
  const action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce, 1);
  action.clampWhenFinished = true;
  action.timeScale = ANIMATION_CONFIG.TIME_SCALE;
  action.play();
  return action;
};

export const calculatePauseTime = (): number => {
  return (ANIMATION_CONFIG.PAUSE_FRAME / ANIMATION_CONFIG.FRAME_RATE) / ANIMATION_CONFIG.TIME_SCALE * 1000;
};

export const areAllAnimationsFinished = (actions: THREE.AnimationAction[]): boolean => {
  return actions.every(action => action.time >= action.getClip().duration - 0.1);
};

import * as THREE from "three";
import { EffectComposer, RenderPass, UnrealBloomPass } from "three-stdlib";
import { CAMERA_CONFIG, BLOOM_CONFIG, LIGHT_CONFIG } from "./constants";

export const useSceneSetup = (container: HTMLDivElement) => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.FOV,
    window.innerWidth / window.innerHeight,
    CAMERA_CONFIG.NEAR,
    CAMERA_CONFIG.FAR
  );
  camera.position.set(CAMERA_CONFIG.POSITION.x, CAMERA_CONFIG.POSITION.y, CAMERA_CONFIG.POSITION.z);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
};

export const useBloomEffect = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    BLOOM_CONFIG.STRENGTH,
    BLOOM_CONFIG.RADIUS,
    BLOOM_CONFIG.THRESHOLD
  );
  composer.addPass(bloomPass);

  return composer;
};

export const setupLights = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(
    LIGHT_CONFIG.AMBIENT.color,
    LIGHT_CONFIG.AMBIENT.intensity
  );
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(
    LIGHT_CONFIG.DIRECTIONAL.color,
    LIGHT_CONFIG.DIRECTIONAL.intensity
  );
  directionalLight.position.set(
    LIGHT_CONFIG.DIRECTIONAL.position.x,
    LIGHT_CONFIG.DIRECTIONAL.position.y,
    LIGHT_CONFIG.DIRECTIONAL.position.z
  );
  scene.add(directionalLight);
};

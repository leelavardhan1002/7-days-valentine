import * as THREE from 'three';
import { fragmentShader, vertexShader } from './shaders';

export function createRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return renderer;
}

export function createScenes() {
  return {
    sceneShader: new THREE.Scene(),
    sceneBasic: new THREE.Scene(),
    camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10),
    clock: new THREE.Clock(),
  };
}

export function createRenderTargets() {
  return [
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
  ];
}

export function createShaderMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      u_stop_time: { value: 0 },
      u_stop_randomizer: { value: new THREE.Vector2(Math.random(), Math.random()) },
      u_cursor: { value: new THREE.Vector2(0.66, 0.3) },
      u_ratio: { value: window.innerWidth / window.innerHeight },
      u_texture: { value: null },
      u_clean: { value: 1 },
      u_theme: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });
}

export function createPlanes(shaderMaterial: THREE.ShaderMaterial) {
  const basicMaterial = new THREE.MeshBasicMaterial();
  const planeGeometry = new THREE.PlaneGeometry(2, 2);

  return {
    planeBasic: new THREE.Mesh(planeGeometry, basicMaterial),
    planeShader: new THREE.Mesh(planeGeometry, shaderMaterial),
    basicMaterial,
  };
}

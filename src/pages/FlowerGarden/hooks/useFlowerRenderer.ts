import { type RefObject, useEffect, useRef } from 'react';
import type { IUniform, Vector2, WebGLRenderer } from 'three';
import {
  createPlanes,
  createRenderer,
  createRenderTargets,
  createScenes,
  createShaderMaterial,
} from '../utils/flowerUtils/threeHelpers';

interface FlowerUniforms {
  u_cursor: IUniform<Vector2>;
  u_stop_randomizer: IUniform<Vector2>;
  u_stop_time: IUniform<number>;
  u_clean: IUniform<number>;
}

export function useFlowerRenderer(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const uniformsRef = useRef<FlowerUniforms | null>(null);
  const pointerRef = useRef({ x: 0.66, y: 0.3, clicked: true, vanishCanvas: false });

  const plantFlower = (x: number, y: number) => {
    if (!uniformsRef.current) return;
    uniformsRef.current.u_cursor.value.set(x, 1 - y);
    uniformsRef.current.u_stop_randomizer.value.set(Math.random(), Math.random());
    uniformsRef.current.u_stop_time.value = 0;
  };

  const clearGarden = () => {
    pointerRef.current.vanishCanvas = true;
    setTimeout(() => {
      pointerRef.current.vanishCanvas = false;
      pointerRef.current.x = Math.random();
      pointerRef.current.y = Math.random();
      pointerRef.current.clicked = true;
    }, 100);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const pointer = pointerRef.current;

    const renderer = createRenderer(canvas);
    rendererRef.current = renderer;

    const { sceneShader, sceneBasic, camera, clock } = createScenes();
    const renderTargets = createRenderTargets();
    const shaderMaterial = createShaderMaterial();
    const { planeBasic, planeShader, basicMaterial } = createPlanes(shaderMaterial);

    uniformsRef.current = shaderMaterial.uniforms as unknown as FlowerUniforms;

    sceneBasic.add(planeBasic);
    sceneShader.add(planeShader);

    const updateSize = () => {
      shaderMaterial.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderTargets[0].setSize(window.innerWidth, window.innerHeight);
      renderTargets[1].setSize(window.innerWidth, window.innerHeight);
    };

    updateSize();

    let animationId: number;
    const render = () => {
      shaderMaterial.uniforms.u_clean.value = pointer.vanishCanvas ? 0 : 1;
      shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;

      if (pointer.clicked) {
        shaderMaterial.uniforms.u_cursor.value.set(pointer.x, 1 - pointer.y);
        shaderMaterial.uniforms.u_stop_randomizer.value.set(Math.random(), Math.random());
        shaderMaterial.uniforms.u_stop_time.value = 0;
        pointer.clicked = false;
      }
      shaderMaterial.uniforms.u_stop_time.value += clock.getDelta();

      renderer.setRenderTarget(renderTargets[1]);
      renderer.render(sceneShader, camera);
      basicMaterial.map = renderTargets[1].texture;
      renderer.setRenderTarget(null);
      renderer.render(sceneBasic, camera);

      [renderTargets[0], renderTargets[1]] = [renderTargets[1], renderTargets[0]];
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, [canvasRef]);

  return { plantFlower, clearGarden };
}

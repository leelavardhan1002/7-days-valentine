import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { useSceneSetup, useBloomEffect, setupLights } from "./hooks";
import {
  ANIMATION_CONFIG,
  LIGHT_CONFIG,
  MODEL_PATH,
  type AnimationState,
} from "./constants";
import {
  setupAnimationAction,
  calculatePauseTime,
  areAllAnimationsFinished,
} from "./utils";
import Rose3DBoxUI from "./Rose3DBoxUI";

const Rose3DBox = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUI, setShowUI] = useState(false);
  const [boxOpened, setBoxOpened] = useState(false);
  const openBoxRef = useRef(false);

  const handleYesClick = () => {
    openBoxRef.current = true;
    setBoxOpened(true);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const { scene, camera, renderer } = useSceneSetup(containerRef.current);
    const composer = useBloomEffect(renderer, scene, camera);
    setupLights(scene);

    // Add radial gradient background
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    let gradientCenterX = 256;
    const updateGradient = () => {
      ctx.clearRect(0, 0, 512, 512);
      const gradient = ctx.createRadialGradient(
        gradientCenterX,
        256,
        0,
        gradientCenterX,
        256,
        256,
      );
      gradient.addColorStop(0, "#2a0000");
      gradient.addColorStop(0.3, "#0d0000");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      texture.needsUpdate = true;
    };
    const texture = new THREE.CanvasTexture(canvas);
    updateGradient();
    scene.background = texture;

    // Animation state
    const clock = new THREE.Clock();
    let animationState: AnimationState = "initial";
    let rotationProgress = 0;
    let mixer: THREE.AnimationMixer | null = null;
    let model: THREE.Group | null = null;
    const actions: THREE.AnimationAction[] = [];
    // let ringSpinAction: THREE.AnimationAction | null = null;
    let canOpen = false;

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      MODEL_PATH,
      (gltf) => {
        model = gltf.scene;
        scene.add(model);

        // Add box light
        const boxLight = new THREE.PointLight(
          LIGHT_CONFIG.BOX_LIGHT.color,
          LIGHT_CONFIG.BOX_LIGHT.intensity,
          LIGHT_CONFIG.BOX_LIGHT.distance,
        );
        model.add(boxLight);

        // Setup animations
        if (gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);

          gltf.animations.forEach((clip) => {
            const action = setupAnimationAction(mixer!, clip);

            actions.push(action);
          });

          // Pause all animations at frame 20
          setTimeout(() => {
            actions.forEach((action) => (action.paused = true));
            if (animationState === "initial") {
              animationState = "rotate";
            }
          }, calculatePauseTime());
        }
      },
      undefined,
      (error) => console.error("GLB load error:", error),
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Initial animation state
      if (mixer && animationState === "initial") {
        mixer.update(delta);
      }

      // Box rotation state
      if (model && animationState === "rotate") {
        model.rotation.y += ANIMATION_CONFIG.BOX_ROTATION_SPEED;
        rotationProgress += ANIMATION_CONFIG.BOX_ROTATION_SPEED;

        if (rotationProgress >= Math.PI * 2) {
          animationState = "moving";
        }
      }

      // Move to right state
      if (model && animationState === "moving") {
        const targetX = 2;
        const startGradientX = 256;
        const targetGradientX = 340;
        const moveSpeed = 0.02;

        if (model.position.x < targetX) {
          model.position.x += moveSpeed;
          // Calculate gradient position proportionally to model position
          const progress = model.position.x / targetX;
          gradientCenterX =
            startGradientX + (targetGradientX - startGradientX) * progress;
          updateGradient();
        } else {
          model.position.x = targetX;
          gradientCenterX = targetGradientX;
          updateGradient();
          animationState = "paused";
          canOpen = true;
          setShowUI(true);
        }
      }

      // Check if Yes button clicked
      if (openBoxRef.current && canOpen && animationState === "paused") {
        animationState = "open";
        actions.forEach((action) => (action.paused = false));
        canOpen = false;
      }

      // Open animation state
      if (mixer && animationState === "open") {
        mixer.update(delta);

        if (areAllAnimationsFinished(actions)) {
          animationState = "modelRotate";
          setBoxOpened(true);
        }
      }

      // Model rotation state
      if (animationState === "modelRotate" && model) {
        model.rotation.y += ANIMATION_CONFIG.MODEL_ROTATION_SPEED;
      }

      composer.render();
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        background: "radial-gradient(circle at center, #000 0%, #DC143C 100%)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <Rose3DBoxUI
        hideUI={!showUI}
        onYesClick={handleYesClick}
        boxOpened={boxOpened}
      />
    </div>
  );
};

export default Rose3DBox;

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Self-hosted 3D wave (three.js, GPU shader) — watermark-free, grey/blue.
// Displacement + edge/depth fade happen in the vertex shader, so every border of
// the plane dissolves to transparent (no sharp cropped edges) and it's cheap.
const VERT = `
  uniform float uTime;
  uniform float uHalfW;
  uniform float uHalfH;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float z = sin(p.x * 0.18 + uTime * 0.9) * 1.2
            + cos(p.y * 0.22 + uTime * 0.7) * 1.0
            + sin((p.x + p.y) * 0.12 + uTime * 1.1) * 0.7;
    p.z = z;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    gl_Position = clip;
    // fade by SCREEN position (normalised device coords) so the viewport-clipped
    // edges dissolve — no sharp cut wherever the plane crosses the screen border.
    float behind = step(0.0001, clip.w);            // 0 for verts behind the camera
    float ndcx = clip.x / max(clip.w, 0.0001);
    float ndcy = clip.y / max(clip.w, 0.0001);
    float sx = 1.0 - smoothstep(0.40, 0.84, abs(ndcx));
    float sy = 1.0 - smoothstep(0.40, 0.88, abs(ndcy));
    float df = 1.0 - smoothstep(12.0, 55.0, -mv.z);
    vAlpha = sx * sy * df * behind;
  }
`;
const FRAG = `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float a = clamp(vAlpha, 0.0, 1.0) * uOpacity;
    if (a <= 0.002) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

export default function Wave3D({ color = 0x9fb0d8, opacity = 0.5 }: { color?: number; opacity?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 1;
    let height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 300);
    camera.position.set(0, 7, 15);
    camera.lookAt(0, -3, -14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const W = 220, H = 150;
    const geo = new THREE.PlaneGeometry(W, H, 104, 72);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHalfW: { value: W / 2 },
        uHalfH: { value: H / 2 },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      wireframe: true,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2.3;
    mesh.position.y = -4;
    scene.add(mesh);

    const start = performance.now();
    let raf = 0;
    const animate = () => {
      mat.uniforms.uTime.value = (performance.now() - start) * 0.001;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const ro = new ResizeObserver(() => {
      width = mount.clientWidth || 1;
      height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [color, opacity]);

  return <div ref={mountRef} className="w-full h-full" />;
}

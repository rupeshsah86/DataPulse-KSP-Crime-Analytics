'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Crime3DPoint } from '@/utils/mapDataProcessor';
import { Badge } from '@/components/ui/Badge';
import { MapPin, RotateCw, ZoomIn, ZoomOut, Sparkles, Layers } from 'lucide-react';

interface CrimeMap3DProps {
  points: Crime3DPoint[];
  autoRotate: boolean;
  rotationSpeed: number;
  onSelectPoint?: (point: Crime3DPoint | null) => void;
}

export const CrimeMap3D: React.FC<CrimeMap3DProps> = ({
  points,
  autoRotate,
  rotationSpeed,
  onSelectPoint,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<Crime3DPoint | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0F172A'); // Slate 900 dark theme
    scene.fog = new THREE.FogExp2('#0F172A', 0.015);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 28, 45);
    camera.lookAt(0, 0, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#6366F1', 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueLight = new THREE.PointLight('#38BDF8', 1.5, 50);
    blueLight.position.set(-15, 10, -15);
    scene.add(blueLight);

    // 5. Ground Grid Plane
    const gridHelper = new THREE.GridHelper(80, 40, '#334155', '#1E293B');
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const planeGeo = new THREE.PlaneGeometry(80, 80);
    const planeMat = new THREE.MeshStandardMaterial({
      color: '#0F172A',
      roughness: 0.8,
      metalness: 0.2,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    // 6. Build 3D Crime Towers Group
    const towersGroup = new THREE.Group();
    const meshPointMap = new Map<THREE.Mesh, Crime3DPoint>();

    points.forEach((pt) => {
      const geo = new THREE.CylinderGeometry(pt.radius, pt.radius * 1.1, pt.height, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: pt.color,
        roughness: 0.3,
        metalness: 0.6,
        emissive: pt.color,
        emissiveIntensity: pt.severity === 'CRITICAL' ? 0.4 : 0.15,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pt.x, pt.y, pt.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      towersGroup.add(mesh);
      meshPointMap.set(mesh, pt);

      // Add base glowing ring for Critical hotspots
      if (pt.severity === 'CRITICAL') {
        const ringGeo = new THREE.RingGeometry(pt.radius * 1.3, pt.radius * 2.2, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: '#EF4444',
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = -Math.PI / 2;
        ringMesh.position.set(pt.x, 0.05, pt.z);
        towersGroup.add(ringMesh);
      }
    });

    scene.add(towersGroup);

    // 7. Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(towersGroup.children);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const pt = meshPointMap.get(hitMesh);
        if (pt) {
          setHoveredPoint(pt);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredPoint(null);
        container.style.cursor = 'default';
      }
    };

    const handleClick = () => {
      if (hoveredPoint && onSelectPoint) {
        onSelectPoint(hoveredPoint);
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleClick);

    // 8. Animation Loop
    let animationFrameId: number;
    let angle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate) {
        angle += 0.003 * rotationSpeed;
        camera.position.x = Math.sin(angle) * 45;
        camera.position.z = Math.cos(angle) * 45;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, [points, autoRotate, rotationSpeed, onSelectPoint, hoveredPoint]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-xl">
      <div ref={mountRef} className="w-full h-full" />

      {/* Hovered Tooltip Overlay */}
      {hoveredPoint && (
        <div className="absolute top-4 left-4 p-3 bg-slate-950/90 border border-slate-700 backdrop-blur-md rounded-xl text-white shadow-2xl z-20 space-y-1 max-w-[280px] pointer-events-none animate-fadeIn">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-600">
              3D Hotspot Column
            </span>
            <Badge variant={hoveredPoint.severity.toLowerCase() as any}>
              {hoveredPoint.severity}
            </Badge>
          </div>
          <h4 className="font-extrabold text-sm text-slate-100 truncate">{hoveredPoint.title}</h4>
          <p className="text-xs text-slate-400 font-medium">{hoveredPoint.category} • {hoveredPoint.district}</p>
          <div className="text-[11px] font-mono text-emerald-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Elevation: {(hoveredPoint.height * 100).toFixed(0)}m</span>
            <span>Density Score: {hoveredPoint.density}x</span>
          </div>
        </div>
      )}

      {/* Legend Badge */}
      <div className="absolute bottom-4 right-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 backdrop-blur-md space-y-1.5 z-10">
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">3D Density Elevation Legend</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Medium/Low</span>
        </div>
      </div>
    </div>
  );
};

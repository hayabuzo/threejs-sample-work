import * as THREE from 'three';
import {OrbitControls} from 'OrbitControls';

const scene    = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
      renderer.setSize(innerWidth,innerHeight);
      renderer.setPixelRatio(devicePixelRatio);
      renderer.shadowMap.enabled = true;
      // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      document.body.appendChild(renderer.domElement);

const camera   = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
      camera.position.set(15,15,5);
const orbit = new OrbitControls(camera, renderer.domElement);

const sphereRT = new THREE.WebGLCubeRenderTarget(128, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
const sphereCam = new THREE.CubeCamera(0.1, 1000, sphereRT);
const pivotCam = new THREE.Object3D();
scene.add(pivotCam)
const sphereMate = new THREE.MeshPhongMaterial({ emissive: 0xff0000, envMap: sphereRT.texture })


// --------------------------------------------------------------------------------

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
      dirLight.position.set(3,5,2);
      scene.add(dirLight);

const ambLight = new THREE.AmbientLight(0x404040, 1.0);
      scene.add(ambLight);

const poiLight = new THREE.PointLight( 0xffffff, 1, 100 );
      poiLight.position.set( 5, 10, 0 );
      poiLight.castShadow = true; 
      poiLight.shadow.bias = -0.005;
      scene.add(poiLight);

// --------------------------------------------------------------------------------

const doorWidth = 4;
const doorHeight = 10;
const doorShape = new THREE.Shape();
      drawRectShape(doorShape, doorWidth, doorHeight);

const holesNum = 5;
const holeStep = doorHeight*0.5/holesNum;
const holeWidth = doorWidth*0.7;
const holeHeight = holeStep-0.2;

let holeShape = [];
for (let i=0; i<holesNum; i++) {
  holeShape.push(new THREE.Shape());
  drawRectShape(holeShape[i], holeWidth, holeHeight, i);
  doorShape.holes.push(holeShape[i]);
}

const doorText = new THREE.TextureLoader().load('https://2.bp.blogspot.com/-Roe-pJd-73k/Vwf6Lb4pi_I/AAAAAAAARCE/T3OI1_wgHhMFtI-7QbiiesB0DKccXwybQ/s1600/seamless_cherry_wood_texture-diffuse.jpg');
      doorText.wrapS = THREE.RepeatWrapping;
      doorText.wrapT = THREE.RepeatWrapping;
      doorText.rotation = Math.PI/2;

const doorNorm = new THREE.TextureLoader().load('https://4.bp.blogspot.com/-W97AaaKDEJc/Vwf6GFyVUKI/AAAAAAAARCA/wxURQZ7H9Tc4wd5tcoMyBghgEDYcDsRDQ/s1600/seamless_cherry_wood_texture-normal.jpg');
      doorNorm.wrapS = THREE.RepeatWrapping;
      doorNorm.wrapT = THREE.RepeatWrapping;
      doorNorm.rotation = Math.PI/2;

const doorExtrude = { steps: 2, depth: 0.2, bevelEnabled: false };
const doorGeom = new THREE.ExtrudeGeometry(doorShape, doorExtrude);
const doorMate = new THREE.MeshPhongMaterial( { map: doorText, color: 0xffffff, side: THREE.DoubleSide } );
      doorMate.normalMap = doorNorm;
      doorMate.normalScale.set(0.2, 0.4);
const doorMesh = new THREE.Mesh(doorGeom,doorMate);
      doorMesh.position.z -= 0.1;
      doorMesh.castShadow = true; 

const glassGeom = new THREE.BoxGeometry(holeWidth,doorHeight*0.5,0.05);
const glassMate = new THREE.MeshPhysicalMaterial({ roughness: 0.5, transmission: 1, thickness: 1 });
const glassMesh = new THREE.Mesh(glassGeom, glassMate);
      glassMesh.position.y += doorHeight*0.25 - holeHeight*0.5;

const baseGeom = new THREE.CylinderGeometry( 0.15, 0.15, 0.25, 16 );
const baseMate = new THREE.MeshStandardMaterial( {color: 0xf6b604, roughness: 0.4, metalness: 0.64} );
const baseMesh = new THREE.Mesh(baseGeom, baseMate);
      baseMesh.rotation.x += Math.PI/2;
      baseMesh.position.x += doorWidth/2 - (doorWidth-holeWidth)/4;

const legGeom = new THREE.CylinderGeometry( 0.1, 0.1, 0.5, 12 );
const legMesh = new THREE.Mesh(legGeom, baseMate);
      legMesh.rotation.x += Math.PI/2;
      legMesh.position.x += doorWidth/2 - (doorWidth-holeWidth)/4;

const knobGeom = new THREE.SphereGeometry( 0.2, 32, 16 );
const knobMeshFront = new THREE.Mesh(knobGeom, baseMate);
      knobMeshFront.position.x = doorWidth/2 - (doorWidth-holeWidth)/4;
      knobMeshFront.scale.z = 0.3;
      knobMeshFront.position.z += 0.25;

const knobMeshBack = knobMeshFront.clone();
      knobMeshBack.position.z -= 0.50;

const hingeGeom = new THREE.CapsuleGeometry( 0.06, 0.75, 4, 8 );
const hingeMeshUp = new THREE.Mesh( hingeGeom, baseMate );
      hingeMeshUp.position.z += 0.10;
      hingeMeshUp.position.x -= doorWidth/2;

const hingeMeshDown = hingeMeshUp.clone();
      hingeMeshUp.position.y   += doorHeight/2*0.6;
      hingeMeshDown.position.y -= doorHeight/2*0.6;

const doorGroup = new THREE.Group();
      doorGroup.add(doorMesh);
      doorGroup.add(glassMesh);
      doorGroup.add(baseMesh);
      doorGroup.add(legMesh);
      doorGroup.add(knobMeshFront);
      doorGroup.add(knobMeshBack);
      doorGroup.add(hingeMeshUp);
      doorGroup.add(hingeMeshDown);

const doorPivot = new THREE.Group();
      doorPivot.add(doorGroup);
      doorGroup.position.z -= 0.10;
      doorGroup.position.x += doorWidth/2;
      doorPivot.position.z += 0.10;
      doorPivot.position.x -= doorWidth/2;

      scene.add(doorPivot);

const wallShape = new THREE.Shape();
      drawRectShape(wallShape, 30, doorHeight*1.1);
const wallHole = new THREE.Shape();
      drawRectShape(wallHole, doorWidth, doorHeight+0.01);
      wallShape.holes.push(wallHole);
const wallExtrude = { steps: 2, depth: 0.2, bevelEnabled: false };
const wallGeom = new THREE.ExtrudeGeometry(wallShape, wallExtrude);
const wallMate = new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
const wallMesh = new THREE.Mesh(wallGeom,wallMate);
      wallMesh.position.z -= 0.1;
      wallMesh.castShadow = true; 
      wallMesh.receiveShadow = true; 
      scene.add(wallMesh);


// --------------------------------------------------------------------------------

const planeGeom = new THREE.PlaneGeometry( 30, 30 );
const planeMate = new THREE.MeshPhongMaterial( {color: 0x666666, side: THREE.DoubleSide} );
const planeMesh = new THREE.Mesh(planeGeom, planeMate);
      planeMesh.rotation.x = Math.PI/2;
      planeMesh.position.y = -doorHeight/2;
      planeMesh.receiveShadow = true;
      scene.add(planeMesh);

const boxGeom = new THREE.BoxGeometry(3,3,3);
const boxMate = new THREE.MeshPhongMaterial({color: 0xFF8800});
const boxMesh = new THREE.Mesh(boxGeom, boxMate);
      boxMesh.position.set(0.0,0.0,8.0);
      boxMesh.receiveShadow = true;
      boxMesh.castShadow = true;
      scene.add(boxMesh);

const sphereGeom = new THREE.SphereGeometry( 2.5, 32, 16 );
const sphereMesh = new THREE.Mesh(sphereGeom, sphereMate);
      sphereMesh.position.set(0.0,0.0,-8.0);
      sphereMesh.receiveShadow = true; 
      sphereMesh.castShadow = true; 
      sphereMesh.add(sphereCam);
      pivotCam.add(sphereMesh);
      scene.add(sphereMesh);

// --------------------------------------------------------------------------------

const helper = new THREE.CameraHelper( poiLight.shadow.camera );
scene.add( helper );

let time = 0;
function animate() {

      time += 1/60;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      sphereCam.update(renderer, scene);

      doorPivot.rotation.y = -((Math.sin(time*0.7)*0.5+0.5)*Math.PI/2);

      poiLight.position.z = 12.0*Math.sin(time*0.67);
      poiLight.position.x = 12.0*Math.sin(time*0.86);

      boxMesh.rotation.x += 0.0194;
      boxMesh.rotation.y += 0.0171;
      boxMesh.rotation.z += 0.0153;
      boxMesh.position.y  = Math.sin(time*3.77);

      // sphereMesh.position.y  = Math.sin(time*2.73);


} animate();

function drawRectShape(shape, width, height, i=0) {
  shape.moveTo(-width/2, -height/2+i);
  shape.lineTo(-width/2, +height/2+i);
  shape.lineTo(+width/2, +height/2+i);
  shape.lineTo(+width/2, -height/2+i);
  shape.lineTo(-width/2, -height/2+i);
}

function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize, false);
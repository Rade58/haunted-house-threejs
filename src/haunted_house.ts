// 1 unit will represent 1 meter (we decided)

import * as THREE from "three";
import { /* FontLoader, */ OrbitControls } from "three/examples/jsm/Addons.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
// import gsap from "gsap";
import GUI from "lil-gui";

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "Debugging",
  closeFolders: false,
});

gui.hide();

/* 
const debugObject = {
  color: "#90315f",
  subdivisions: 1,
  //
  // spin: () => {},
}; */

const sizes = {
  // width: 800,
  width: window.innerWidth,
  // height: 600,
  height: window.innerHeight,
};

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  // -------------------------------------------------------

  //
  const scene = new THREE.Scene();
  // defining FOG here. Right after the scene
  /**
   * @name Fog
   */
  const fog = new THREE.Fog("#262B37", 1, 15); // 1 and 15 are near and far
  // near - how far from the camera fog starts (lower the value is more closer to the camera)
  // far - how far from the camera will the fog be fully opaque

  scene.fog = fog;
  //
  // but we will still see the edges of the floor mesh we placed down in the code
  // we need to set up same clear color as the color of the fog
  // we use setClearColor on the renderes, see down bellow what we did on the renderer

  const textureLoader = new THREE.TextureLoader();

  // door
  const doorColorTexture = textureLoader.load("/textures/door/basecolor.jpg");
  const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
  const doorAmbientOcTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
  );
  const doorHeightTexture = textureLoader.load("/textures/door/height.png");
  const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
  const doorMetalnessTexture = textureLoader.load(
    "/textures/door/metalness.jpg"
  );
  const doorRoughnessTexture = textureLoader.load(
    "/textures/door/roughness.jpg"
  );

  // wall
  const wallColorTexture = textureLoader.load("/textures/bricks/basecolor.jpg");
  const wallAlphaTexture = textureLoader.load("/textures/bricks/alpha.jpg");
  const wallAmbietOcclusionTexture = textureLoader.load(
    "/textures/bricks/ambientOcclusion.jpg"
  );
  const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
  const wallMetalnessTexture = textureLoader.load(
    "/textures/bricks/metalness.jpg"
  );
  const wallRougnessTexture = textureLoader.load(
    "/textures/bricks/roughness.jpg"
  );
  // const wallHeightTexture = textureLoader.load("/textures/bricks/height.png");

  // roof (textures look bad on the cone)
  const roofColorTexture = textureLoader.load("/textures/roof/basecolor.jpg");
  const roofAmbientOcclusionTexture = textureLoader.load(
    "/textures/roof/ambientOcclusion.jpg"
  );
  const roofNormalTexture = textureLoader.load("/textures/roof/normal.jpg");
  const roofRoughnessTexture = textureLoader.load(
    "/textures/roof/roughness.jpg"
  );
  const roofHeightTexture = textureLoader.load("/textures/roof/height.jpg");

  const grassBaseColorTexture = textureLoader.load(
    "/textures/grass/BaseColor.jpg"
  );
  const grassAmbientOcclusionTexture = textureLoader.load(
    "/textures/grass/AmbientOcclusion.jpg"
  );
  // const grassHeightTexture = textureLoader.load("/textures/grass/Height.png");
  const grassNormalTexture = textureLoader.load("/textures/grass/Normal.jpg");
  const grassRoughnessTexture = textureLoader.load(
    "/textures/grass/Roughness.jpg"
  );

  grassBaseColorTexture.repeat.set(26, 26);
  grassAmbientOcclusionTexture.repeat.set(26, 26);
  grassNormalTexture.repeat.set(26, 26);
  grassRoughnessTexture.repeat.set(26, 26);

  grassBaseColorTexture.wrapS = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  grassNormalTexture.wrapS = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

  grassBaseColorTexture.wrapT = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  grassNormalTexture.wrapT = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

  /* roofColorTexture.repeat.set(3, 3);
  roofAmbientOcclusionTexture.repeat.set(3, 3);
  roofNormalTexture.repeat.set(3, 3);
  roofRoughnessTexture.repeat.set(3, 3);

  roofColorTexture.wrapS = THREE.RepeatWrapping;
  roofAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  roofNormalTexture.wrapS = THREE.RepeatWrapping;
  roofRoughnessTexture.wrapS = THREE.RepeatWrapping;

  roofColorTexture.wrapT = THREE.RepeatWrapping;
  roofAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  roofNormalTexture.wrapT = THREE.RepeatWrapping;
  roofRoughnessTexture.wrapT = THREE.RepeatWrapping; */

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // --------------------------------------------------------------
  // --------------------------------------------------------------

  /**
   *@name House ----------------------------------------------------
   */
  const house = new THREE.Group();
  scene.add(house);

  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4 /* , 10, 10 */), // don't need much segments in this case
    // new THREE.MeshStandardMaterial({ color: "#ac8e82" })
    new THREE.MeshStandardMaterial({
      map: wallColorTexture,
      // we don't need this
      // transparent: true,
      alphaMap: wallAlphaTexture,
      aoMap: wallAmbietOcclusionTexture,
      // we don't need these I think, this would only be usefull if wall is just a plane
      // displacementMap: wallHeightTexture,
      // displacementScale: 0.4, // try uncommenting setting it , the brick will be more real because vertices but edges would be moved
      //                                      and it would be like walls are moved
      normalMap: wallNormalTexture,
      metalnessMap: wallMetalnessTexture,
      roughnessMap: wallRougnessTexture,
    })
  );

  // for ambient Occlusion
  walls.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2) // 2 coordinates for uv2
  );

  walls.position.y = 2.5 / 2;

  walls.castShadow = true;

  house.add(walls);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4, 50), // 4 segments means pyramid with 4 sides

    new THREE.MeshStandardMaterial({ color: "#b35f45" })
    // no because we re using cone and textures look bad
    /* new THREE.MeshStandardMaterial({
      map: roofColorTexture,
      aoMap: roofAmbientOcclusionTexture,
      normalMap: roofNormalTexture,
      roughnessMap: roofRoughnessTexture,
      displacementMap: roofHeightTexture,
    }) */
  );

  roof.position.y = 2.5 + 1 / 2; // 2.5 is height of the walls, and 1 is height of the roof

  roof.rotation.y = Math.PI * (1 / 4); // rotate it by 45 deg to align it with walls
  //
  house.add(roof);

  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    // new THREE.MeshStandardMaterial({ color: "#aa7b7b" })
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      transparent: true, // if we want to use alpha map in this case we enable this whe nwe want the black color on the alpha Texture to be transparent
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientOcTexture,
      displacementMap: doorHeightTexture,
      // to see all vertices
      // wireframe: true,
      //
      displacementScale: 0.1, // without this, our segment will cause our door to look "too extruded" (my words)

      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    })
  );

  // for ambientOcclusion we ned to do this, to set new attribute uv2
  door.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2) // 2 coordinates for uv2
  );

  // half of the dept of the walls, but we need to add some extra because we have a problem where door
  // and the wall are over eachother so we need to add some valu to move door a bit from the wall
  // problem is called ZED FIGHTING
  door.position.z = 4 / 2 + 0.01;

  door.position.y = 2 / 2; // half of the height of the door

  house.add(door);

  // creating three identical bushes
  const bushGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);

  // I should have been more random but don't worry we wil lscale them after positioning
  // bush is hals of radius below ground
  bush1.position.y =
    bush2.position.y =
    bush3.position.y =
    bush4.position.y =
      0.5 / 2;

  bush1.position.z = bush2.position.z = 4 / 2 + 0.5; // half of depth of walls plus radius of the bush
  // one bush on other edge of the door and another on another edge
  // we use half ow width of the door
  bush1.position.x = 2 / 2;
  bush2.position.x = -2 / 2;

  bush2.scale.setScalar(0.75);
  bush3.scale.setScalar(0.4);

  bush3.position.z = bush1.position.z + 0.6 - 0.2;
  bush3.position.x = -bush1.position.x - 0.2;
  bush3.position.y = bush3.position.y - 0.1;

  bush4.position.z = bush1.position.z - 0.2;
  bush4.position.x = bush1.position.x + 0.5;
  bush4.position.y = bush3.position.y + 0.1;

  bush4.scale.setScalar(0.66);

  bush1.castShadow = true;
  bush2.castShadow = true;
  bush3.castShadow = true;
  bush4.castShadow = true;

  house.add(bush1, bush2, bush3, bush4);

  const tombstones = new THREE.Group();

  scene.add(tombstones);

  const tombstoneGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const tombstoneMaterial = new THREE.MeshStandardMaterial({
    color: "#b2b6b1",
  });

  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2; // random angle
    const radiusMultiplier = 3 + Math.random() * 6; // random radius multiplier, but above 3 because half with of the walls is 2
    // and lesser than a floor half width which is 10

    const x = Math.cos(angle) * radiusMultiplier;
    const z = Math.sin(angle) * radiusMultiplier;

    const stone = new THREE.Mesh(tombstoneGeometry, tombstoneMaterial);

    stone.position.set(x, 0.8 / 2 - 0.1, z);
    // minus 0.5, because we want also negative calues
    stone.rotation.z = (Math.random() - 0.5) * 0.4;
    stone.rotation.y = (Math.random() - 0.5) * 0.4;

    stone.castShadow = true;

    tombstones.add(stone);
  }
  // warm color for the light above house door
  const doorLight = new THREE.PointLight("#ff7d46", 1, 7); // 7 is distance, increse it and it is like "incresing radius" of light

  doorLight.position.set(0, 2.2, 2.7);

  doorLight.castShadow = true;
  doorLight.shadow.mapSize.width = 256;
  doorLight.shadow.mapSize.height = 256;
  doorLight.shadow.camera.far = 7;

  house.add(doorLight);

  //--------------------------------------------------------------------
  /**
   * @name Ghosts
   */
  const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
  const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
  const ghost3 = new THREE.PointLight("#ffff00", 2, 3);

  ghost1.castShadow = true;
  ghost1.shadow.mapSize.width = 256;
  ghost1.shadow.mapSize.height = 256;
  ghost1.shadow.camera.far = 7;

  ghost2.castShadow = true;
  ghost2.shadow.mapSize.width = 256;
  ghost2.shadow.mapSize.height = 256;
  ghost2.shadow.camera.far = 7;

  ghost3.castShadow = true;
  ghost3.shadow.mapSize.width = 256;
  ghost3.shadow.mapSize.height = 256;
  ghost3.shadow.camera.far = 7;

  scene.add(ghost1, ghost2, ghost3);
  // ---------------------------------------------------------------------
  // const sphere = new THREE.Mesh(
  //   new THREE.SphereGeometry(1, 32, 32),
  //   new THREE.MeshStandardMaterial({ roughness: 0.7 })
  // );
  // sphere.position.y = 2;
  // scene.add(sphere);

  /**
   * @name Ground
   */

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    // new THREE.MeshStandardMaterial({ color: "#a9c388" })
    new THREE.MeshStandardMaterial({
      map: grassBaseColorTexture,
      aoMap: grassAmbientOcclusionTexture,
      // displacementMap: grassHeightTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
    })
  );

  floor.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2) // 2 coordinates for uv2
  );

  floor.rotation.x = -Math.PI * 0.5; // this is -90deg
  // floor.position.y = -0.65;
  floor.position.y = 0;

  floor.receiveShadow = true;

  scene.add(floor);

  //---------------------------------------------------------------

  // ------  AMBIENT AND DIRECTIONAL(Moon) LIGHTS
  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);

  scene.add(ambientLight);

  const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);

  // moonLight.position.set(2, 2, -1);
  moonLight.position.set(4, 5, -2);

  moonLight.castShadow = true;

  scene.add(moonLight);

  const moonLightHelper = new THREE.DirectionalLightHelper(
    moonLight,
    0.2,
    "purple"
  );
  // scene.add(moonLightHelper);

  // -----------------------------------------------------------------------

  //  ---------------------- SHADOWS RELATED ----------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------

  // --------------------------------------------------------

  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  //  gui
  const moonDirectionalLightFolder = gui.addFolder("Moon Light (Directional)");
  moonDirectionalLightFolder
    .add(moonLight, "intensity")
    .min(0)
    .max(1)
    .step(0.001)
    .name("MoonLight intensity");
  moonDirectionalLightFolder
    .add(moonLight.position, "x")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("MoonLight x");
  moonDirectionalLightFolder
    .add(moonLight.position, "y")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("MoonLight y");
  moonDirectionalLightFolder
    .add(moonLight.position, "z")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("MoonLight z");

  const doorPointLigtFolder = gui.addFolder("Door Point Light");

  doorPointLigtFolder
    .add(doorLight, "distance")
    .min(0)
    .max(10)
    .step(0.001)
    .name("door light distance (point light distance)");
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,

    0.1,
    100
  );

  camera.position.z = 10;
  camera.position.x = 4;
  camera.position.y = 4;
  scene.add(camera);

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  // scene.add(axHelp);

  const orbit_controls = new OrbitControls(camera, canvas);
  // orbit_controls.enabled = false
  orbit_controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });

  // same clear color as the fog
  renderer.setClearColor("#262B37");

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // more than 2 is unnecessary

  // ------ SHADOW MAPS ------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------

  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);

  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // toggle debug ui on key `h`
  window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
      gui.show(gui._hidden);
    }
  });

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // moving ghosts
    const ghostAngle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghostAngle) * 4;
    ghost1.position.y = Math.sin(ghostAngle) * 4;
    ghost1.position.z = Math.sin(elapsedTime * 3);
    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
    const ghost3Angle = -elapsedTime * 0.18;
    ghost3.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.y =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.z = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);

    // for dumping to work
    orbit_controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();

  // ------------------------------------------------------
  // --------------- handle resize ------------------------
  window.addEventListener("resize", (e) => {
    console.log("resizing");
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ------------------------------------------------------
  // ----------------- enter fulll screen with double click

  window.addEventListener("dblclick", () => {
    console.log("double click");

    // handling safari
    const fullscreenElement =
      // @ts-ignore webkit
      document.fullscreenElement || document.webkitFullScreenElement;
    //

    // if (!document.fullscreenElement) {
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        // go fullscreen
        canvas.requestFullscreen();

        // @ts-ignore webkit
      } else if (canvas.webkitRequestFullScreen) {
        // @ts-ignore webkit
        canvas.webkitRequestFullScreen();
      }
    } else {
      // @ts-ignore
      if (document.exitFullscreen) {
        document.exitFullscreen();

        // @ts-ignore webkit
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore webkit
        document.webkitExitFullscreen();
      }
    }
  });
}

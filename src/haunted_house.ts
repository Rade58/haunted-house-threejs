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

// gui.hide();

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

  // loading the shadow texture

  const textureLoader = new THREE.TextureLoader();

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
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ color: "#ac8e82" })
  );
  walls.position.y = 2.5 / 2;
  house.add(walls);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.2, 1.5, 4), // 4 segments means pyramid with 4 sides
    new THREE.MeshStandardMaterial({ color: "#b35f45" })
  );

  roof.position.y = 2.5 + 1.5 / 2; // 2.5 is height of the walls, and 1.5 is height of the roof

  roof.rotation.y = Math.PI * (1 / 4); // rotate it by 45 deg to align it with walls

  house.add(roof);

  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({ color: "#aa7b7b" })
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

    tombstones.add(stone);
  }
  // warm color for the light above house door
  const doorLight = new THREE.PointLight("#ff7d46", 1, 7); // 7 is distance

  doorLight.position.set(0, 2.2, 2.7);

  house.add(doorLight);

  //----------------------------------------------------------------

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
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: "#a9c388" })
  );
  floor.rotation.x = -Math.PI * 0.5; // this is -90deg
  // floor.position.y = -0.65;
  floor.position.y = 0;

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

  camera.position.z = 12;
  camera.position.x = 4;
  camera.position.y = 4;
  scene.add(camera);

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  scene.add(axHelp);

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
  // renderer.shadowMap.enabled = true;
  renderer.shadowMap.enabled = false;

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

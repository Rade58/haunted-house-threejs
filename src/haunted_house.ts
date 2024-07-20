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

  const scene = new THREE.Scene();

  // loading the shadow texture

  const textureLoader = new THREE.TextureLoader();

  // ------  LIGHTS
  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  directionalLight.position.set(2, 2, -1);

  scene.add(directionalLight);

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.2,
    "purple"
  );
  // scene.add(directionalLightHelper);

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // --------------------------------------------------------------
  // ------ MESHES ------------------------------------------------

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
  bush4.position.y = bush3.position.y - 0.1;

  bush4.scale.setScalar(0.66);

  house.add(bush1, bush2, bush3, bush4);

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
  const lightsFolder = gui.addFolder("Lights");

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

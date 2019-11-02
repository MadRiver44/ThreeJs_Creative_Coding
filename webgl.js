// const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')
// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [512, 512],
  fps: 24,
  duration: 4,
  // Make the loop animated,
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color. deep black
  renderer.setClearColor("#000", 1);
  // renderer.setClearColor('hsl(0, 0%, 95%)', 1.0)

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  // camera.position.set(0, 0, -4);
  // camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  const palette = random.pick(palettes)
  // Setup a geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Setup a material
  const material = new THREE.MeshBasicMaterial({
    color: random.pick(palette)
    // wireframe: true
  });

 for (let i = 0; i < 40; i++) {
  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: random.pick(palette)
    })
  )

  mesh.position.set(
    random.range(-1, 1),
    random.range(-1, 1),
    random.range(-1, 1)
    )

   mesh.scale.set(
     random.range(-1, 1),
     random.range(-1, 1),
     random.range(-1, 1)
   )

  mesh.scale.multiplyScalar(0.25)
  scene.add(mesh);
 }

 scene.add(new THREE.AmbientLight('hsl(214, 20%, 50%)'))

 const light = new THREE.DirectionalLight('white', 1)
 light.position.set(0, 0, 4)
 scene.add(light)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 1.75;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      // camera.updateProjectionMatrix();

      // camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    // playhead vs time , playhead for a gif to restart the animation at the exact same point on loop restart
    render({ playhead }) {
      // mesh.rotation.y = time * (10 * Math.PI / 100)
      // mesh.rotation.x = time * (10 * Math.PI / 100)
      // controls.update();
      // makes loop seam perfectly
        //  to make a gif and export:
          // quit terminal
          // in terminal run: canvas-sketch <filename(webgl.js)>  --output=tmp/
          // cmd s, in browser to make sure
          // cmd shft s, exports all the frames
          // make sure ffmpeg is intalled
          // run, canvas-sketch-mp4 tmp/
           // else use giftool in repo to create
      scene.rotation.z = playhead * Math.PI * 2
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);

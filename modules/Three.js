import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";


export default class Three {
  constructor({ canvasContainer, width, height }) {
    console.log(canvasContainer)
    this.sceneSizes = { width, height }
    this.initScene();
    this.initCamera();
    this.initRenderer(canvasContainer);
    this.initOrbitControls('green', true);
    this.renderRect();
    this.render();
    this.animate();
  }

  initRenderer(canvasContainer) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.sceneSizes.width, this.sceneSizes.height);
    canvasContainer.appendChild(this.renderer.domElement);
  }

  initOrbitControls(meshColorChange, autoRotate) {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // this.controls.autoRotate = autoRotate;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 1;

    // this.controls.maxPolarAngle = -Math.PI / 2;
    // this.controls.minPolarAngle = Math.PI / 2;

    this.controls.addEventListener("start", () =>
      console.log('start')
      // meshColorChange(ROTATION_START_COLOR)
    );
    this.controls.addEventListener("change", () => {}
      // console.log('change')
      // meshColorChange(ROTATION_CHANGE_COLOR)
    );
    this.controls.addEventListener("end", () =>
      console.log('end')
      // meshColorChange(ROTATION_END_COLOR)
    );
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#eee");
  }

  initCamera() {
    this.camera = new THREE.OrthographicCamera(
      this.sceneSizes.width / -2,
      this.sceneSizes.width / 2,
      this.sceneSizes.height / 2,
      this.sceneSizes.height / -2,
      400,
      -400
    );

    this.camera.position.set(this.sceneSizes.width / 2, this.sceneSizes.height / -2, 1);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  renderRect() {
    const boxGeometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({ color: "red" });
    this.box = new THREE.Mesh(boxGeometry, material);

    this.box.position.x = this.sceneSizes.width / 2;
    this.box.position.y = -this.sceneSizes.height / 2;
    this.box.position.z = -100;
    this.box.rotateX(Math.PI / 6);
    this.box.rotateY(Math.PI / 6);

    this.scene.add(this.box);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.controls.update(); // Чтобы эффекты работали

    this.render();
  }
}
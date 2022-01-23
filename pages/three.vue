<template>
  <div>
    <div ref="testCanvas"/>
  </div>
</template>

<script>

import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

export default {
  name: 'ThreePage',

  layout: 'empty',

  data: () => ({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    box: null,
  }),

  watch: {

  },

  methods: {
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("#eee");
    },

    initCamera() {
      this.camera = new THREE.OrthographicCamera(
        this.sceneSizes.width / -2,
        this.sceneSizes.width / 2,
        this.sceneSizes.height / 2,
        this.sceneSizes.height / -2,
        400,
        -400
      );

      this.camera.position.set(0, 0, 1);
    },

    initRenderer(canvasContainer) {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.sceneSizes.width, this.sceneSizes.height);
      canvasContainer.appendChild(this.renderer.domElement);
    },

    initOrbitControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      // this.controls.autoRotate = autoRotate;
      // this.controls.enableDamping = true;
      // this.controls.dampingFactor = 1;
    },

    renderRect() {
      const boxGeometry = new THREE.BoxGeometry(200, 200, 200);
      const material = new THREE.MeshBasicMaterial({ color: "red" });
      this.box = new THREE.Mesh(boxGeometry, material);

      this.box.position.x = 0;
      this.box.position.y = 0;
      this.box.position.z = -100;
      this.box.rotateX(Math.PI / 6);
      this.box.rotateY(Math.PI / 6);

      this.scene.add(this.box);
    },

    render() {
      this.renderer.render(this.scene, this.camera);
    },

    animate() {
      requestAnimationFrame(this.animate.bind(this));
      this.controls.update();
      this.render();
    },
  },

  mounted() {
    this.$nextTick(() => {

      this.sceneSizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      this.initScene();
      this.initCamera();
      this.initRenderer(this.$refs.testCanvas);
      this.initOrbitControls('green', true);
      this.renderRect();
      this.render();
      this.animate();

    })
  },
};
</script>

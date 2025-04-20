import * as THREE from "three";
import { Loader } from "./loader.js";
import { rotacionarModeloPorBeta } from "./animations.js";

export class Cena_1 {
  constructor(renderer) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = renderer;
    this.loader = new Loader();
    this.modelos = {}; // Aqui armazenamos os modelos carregados
    this.cuboTemporario = null;

    this.init();
  }

  async init() {
    // Criar cubo temporário
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    this.cuboTemporario = new THREE.Mesh(geometry, material);
    this.scene.add(this.cuboTemporario);

    // Carregar modelo
    const panela = await this.loader.carregarModelo(this.scene, "./assets/pan_A.gltf");
    this.modelos['panela'] = panela;
    this.scene.add(panela);
    // (Opcional) Remover cubo depois de carregar o modelo
    this.scene.remove(this.cuboTemporario);
  }

  update(beta) {
    // Atualizar animações e lógica da cena
    if (this.modelos['panela']) {
      rotacionarModeloPorBeta(beta, this.modelos['panela'], new THREE.Vector2(0, 1));
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

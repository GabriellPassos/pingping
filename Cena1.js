import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";
import { Loader } from "./Loader.js";
import { GameFlipEngine } from "./GameFlipEngine.js";

export class Cena1 {
  constructor(renderer) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 4);
    this.camera.rotation.x = -Math.PI / 4;
    this.renderer = renderer;
    this.loader = new Loader();
    this.modelos = {}; // Aqui armazenamos os modelos carregados
    this.cuboTemporario = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.init();
  }
  
  async montarCenario() {
    // Carregar modelos
    const fogao = await this.loader.carregarModelo(
      this.scene,
      "./assets/oven.gltf"
    );
    const panela = await this.loader.carregarModelo(
      this.scene,
      "./assets/pan_A.gltf"
    );
    const geladeira = await this.loader.carregarModelo(
      this.scene,
      "./assets/fridge_A_decorated.gltf"
    );
    const prateleira = await this.loader.carregarModelo(
      this.scene,
      "./assets/kitchentable_sink_large.gltf"
    );
    const personagem = await this.loader.carregarModelo(
      this.scene,
      "./assets/Rogue.glb"
    );
    const carne = await this.loader.carregarModelo(
      this.scene,
      "./assets/food_ingredient_steak.gltf"
    );
    // ----------------------------
    // Posicionar os objetos
    // ----------------------------
    // Fogão
    fogao.modelo.position.set(0, 0, 0); // Centro da cena

    // Panela (em cima do fogão)
    panela.modelo.position.set(0, 2, 0); // 1 unidade acima
    //panela.rotation.x = THREE.MathUtils.degToRad(30); // Inclinação inicial

    carne.modelo.position.set(0, 2.4, 0); // 1 unidade acima
 
    // Geladeira (à esquerda, mais para frente)
    geladeira.modelo.position.set(-3, 0, -5); // x negativo, z positivo

    // Prateleira (à direita, mais para frente)
    prateleira.modelo.position.set(2, 0, -5); // x positivo, z positivo, e um pouco mais alto

    // Personagem (em frente ao fogão)
    personagem.modelo.position.set(0, 0, 1.5); // z negativo, olhando para o fogão
    personagem.modelo.rotation.y = Math.PI; // virar personagem para frente do fogão
    this.modelos["panela"] = panela;
    this.modelos["carne"] = carne;
  }

  async init() {
    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.5); // cor branca, intensidade 0.5
    this.scene.add(luzAmbiente);

    // Adicionar luz direcional
    const luzDirecional = new THREE.DirectionalLight(0xffffff, 1);
    luzDirecional.position.set(5, 10, 7.5); // posição da luz
    luzDirecional.castShadow = true; // se quiser sombra depois
    this.scene.add(luzDirecional);
    const gridHelper = new THREE.GridHelper(10, 10);
this.scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
this.scene.add(axesHelper);
    GameFlipEngine.onFlip(()=>this.flip())
  }

  flip() {
    // Tocar animação
    if (this.modelos["panela"]) {
      console.log(this.modelos["panela"].animacoes);
      if (Object.keys(this.modelos["panela"].animacoes).length > 0) {
        if (!this.modelos["panela"].animacoes["flip"].isRunning()) {
          this.modelos["panela"].animacoes["flip"].reset();
        }
        this.modelos["panela"].animacoes["flip"].setLoop(THREE.LoopOnce);
        this.modelos["panela"].animacoes["flip"].clampWhenFinished = true;
        this.modelos["panela"].animacoes["flip"].play();
        if (!this.modelos["carne"].animacoes["flip"].isRunning()) {
          this.modelos["carne"].animacoes["flip"].reset();
        }
        this.modelos["carne"].animacoes["flip"].setLoop(THREE.LoopOnce);
        this.modelos["carne"].animacoes["flip"].clampWhenFinished = true;
        this.modelos["carne"].animacoes["flip"].play();
      }
    }
  }
  update() {
    const delta = this.clock.getDelta(); // Atualiza o tempo decorrido

    Object.values(this.modelos).forEach((modelo) => {
      modelo?.mixer && modelo.mixer.update(delta);
    });
    /*if (this.modelos["panela"] && this.modelos["panela"].mixer) {
      this.modelos["panela"].mixer.update(delta); // Atualiza o mixer da panela
    }*/

    this.renderer.render(this.scene, this.camera);
    
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

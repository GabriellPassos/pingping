import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";
import { Loader } from "./Loader.js";
import { GameFlipEngine } from "./GameFlipEngine.js";
import { buscarModelos, setVisibilidadeModelo } from "./ModelosManager.js";
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

    /*const panela = await this.loader.carregarModelo(
      this.scene,
      "./assets/panela-comida.gltf"
    );*/
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
      "./assets/panela-comida.gltf"
    );
    // ----------------------------
    // Posicionar os objetos
    // ----------------------------
    // Fogão
    fogao.modelo.position.set(0, 0, 1); // Centro da cena
    const fogao2 = fogao.modelo.clone(true);
    fogao2.position.set(2, 0, 1);
    fogao2.rotation.y = -Math.PI;
    this.scene.add(fogao2);
    const prateleira2 = prateleira.modelo.clone(true);
    prateleira2.position.set(-2.5, 1, 1);
    prateleira2.rotation.y = -Math.PI;
    this.scene.add(prateleira2);

    // Panela (em cima do fogão)
    //panela.modelo.position.set(0, 2, 1); // 1 unidade acima
    //panela.rotation.x = THREE.MathUtils.degToRad(30); // Inclinação inicial

    carne.modelo.position.set(0, 2.4, 1); // 1 unidade acima

    // Geladeira (à esquerda, mais para frente)
    geladeira.modelo.position.set(-3, 0, -5); // x negativo, z positivo
    const geladeira2 = geladeira.modelo.clone(true);
    geladeira2.position.set(4.1, 1, -6.3);

    this.scene.add(geladeira2);
    geladeira2.rotation.x = Math.PI / 2;
    geladeira2.rotation.y = -Math.PI;
    const fogao3 = fogao.modelo.clone(true);
    fogao3.position.set(2.1, 0, -5);
    fogao3.rotation.y = -Math.PI;
    this.scene.add(fogao3);

    const fogao4 = fogao.modelo.clone(true);
    fogao4.position.set(2.1, 2, -5);
    this.scene.add(fogao4);

    // Prateleira (à direita, mais para frente)
    prateleira.modelo.position.set(-0.5, 0, -5); // x positivo, z positivo, e um pouco mais alto

    // Personagem (em frente ao fogão)
    personagem.modelo.position.set(0, 0, 2.8); // z negativo, olhando para o fogão
    personagem.modelo.rotation.y = Math.PI; // virar personagem para frente do fogão
    //this.modelos["panela"] = panela;
    this.modelos["carne"] = carne;
    const modelosFiltrados = buscarModelos(this.modelos["carne"].modelo, ['food_ingredient_steak', 'pan_B'])
    setVisibilidadeModelo(modelosFiltrados.modelosExcluidos, false)
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

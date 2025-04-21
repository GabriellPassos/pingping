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
  async  montarCenario() {
    // Carregar modelos
    const fogao = await carregarModelo(this.scene,'./assets/oven.gltf');
    const panela = await carregarModelo(this.scene,'./assets/pan_A.gltf');
    const geladeira = await carregarModelo(this.scene, './assets/fridge_A_decorated.gltf');
    const prateleira = await carregarModelo(this.scene,'./assets/kitchentable_sink_large.gltf');
    const personagem = await carregarModelo(this.scene,'./assets/Rogue.gltf');
  
    // ----------------------------
    // Posicionar os objetos
    // ----------------------------
  
    // Fogão
    fogao.position.set(0, 0, 0); // Centro da cena
    scene.add(fogao);
  
    // Panela (em cima do fogão)
    panela.position.set(0, 1, 0); // 1 unidade acima
    panela.rotation.x = THREE.MathUtils.degToRad(30); // Inclinação inicial
    scene.add(panela);
  
    // Geladeira (à esquerda, mais para frente)
    geladeira.position.set(-3, 0, 2); // x negativo, z positivo
    scene.add(geladeira);
  
    // Prateleira (à direita, mais para frente)
    prateleira.position.set(3, 1, 2); // x positivo, z positivo, e um pouco mais alto
    scene.add(prateleira);
  
    // Personagem (em frente ao fogão)
    personagem.position.set(0, 0, -2); // z negativo, olhando para o fogão
    personagem.rotation.y = Math.PI; // virar personagem para frente do fogão
    scene.add(personagem);
  }
  async init() {
    // Criar cubo temporário
 /*   const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    this.cuboTemporario = new THREE.Mesh(geometry, material);
    this.scene.add(this.cuboTemporario);
        // (Opcional) Remover cubo depois de carregar o modelo
    this.scene.remove(this.cuboTemporario);
*/
    // Carregar modelo
   /* const panela = await this.loader.carregarModelo(this.scene, "./assets/pan_A.gltf");
    panela.rotation.x = THREE.MathUtils.degToRad(30);
    this.modelos['panela'] = panela;
    this.scene.add(panela);*/
    
    // Chamando a função
    //montarCenario();
    
  }

  update(beta) {
    // Atualizar animações e lógica da cena
    if (this.modelos['panela']) {
      rotacionarModeloPorBeta(beta, this.modelos['panela'], new THREE.Vector2(1, 0));
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

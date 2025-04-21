// Importando GLTFLoader corretamente
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/loaders/GLTFLoader.js';

export class Loader {
  constructor() {
    this.loader = new GLTFLoader();
  }

  carregarModelo(cena, caminho) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        caminho,
        (gltf) => {
          const modelo = gltf.scene;
          modelo.position.set(0, 0, 0);
          modelo.scale.set(1, 1, 1);
          cena.add(modelo);
          resolve(modelo); // <- quando terminar, retorna o modelo
        },
        undefined,
        (error) => {
          console.error('Erro ao carregar o modelo:', error);
          reject(error); // <- se der erro, rejeita
        }
      );
    });
  }
}

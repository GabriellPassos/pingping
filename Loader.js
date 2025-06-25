// Importando GLTFLoader e TextureLoader
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';
import { AnimationMixer } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';

export class Loader {
  constructor() {
    this.loader = new GLTFLoader();
    this.textureLoader = new TextureLoader();
  }

  carregarModelo(cena, caminhoModelo) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        caminhoModelo,
        (gltf) => {
          const modelo = gltf.scene;
          modelo.position.set(0, 0, 0);
          modelo.scale.set(1, 1, 1);

          cena.add(modelo);

          let animacoes = {};
          let mixer = null
          if (gltf.animations && gltf.animations.length > 0) {
            mixer = new AnimationMixer(modelo);
            gltf.animations.forEach((clip) => {
              animacoes[clip.name] = mixer.clipAction(clip);
            });
          }

          // Retorna tanto o modelo quanto o mixer
          resolve({ modelo, animacoes, mixer });
        },
        undefined,
        (error) => {
          console.error('Erro ao carregar o modelo:', error);
          reject(error);
        }
      );
    });
  }
}

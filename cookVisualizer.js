import * as THREE from 'three';
import { GameFlipEngine } from './GameFlipEngine.js';
export class CookVisualizer {
  constructor({ modelo, getTempoRestante, tempoTotal, corFinal = new THREE.Color(0x5e2612) }) {
    this.modelo = modelo; // modelo THREE.js (Object3D ou Mesh)
    this.getTempoRestante = getTempoRestante; // função externa que retorna o tempo restante
    this.tempoTotal = tempoTotal; // tempo total de cozimento
    this.corFinal = corFinal; // cor final (ex: marrom escuro)
    this.materialOriginal = modelo.material.clone(); // clone do material original
  }

  update() {
    const tempoRestante = this.getTempoRestante();
    const progresso = 1 - Math.min(Math.max(tempoRestante / this.tempoTotal, 0), 1);
    const corAtual = this.materialOriginal.color.clone().lerp(this.corFinal, progresso);

    // aplica no material (assumindo MeshStandardMaterial, pode ajustar)
    if (this.modelo.material) {
      this.modelo.material.color.copy(corAtual);
    }
  }

  reset() {
    if (this.modelo.material) {
      this.modelo.material.color.copy(this.materialOriginal.color);
    }
  }
}

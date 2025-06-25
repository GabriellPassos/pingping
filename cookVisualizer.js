import * as THREE from "three";
import { GameFlipEngine } from "./GameFlipEngine.js";
export class CookVisualizer {
  constructor({
    modelo,
    getTempoRestante,
    getTempoTotal,
    corFinal = new THREE.Color(0x5e2612),
  }) {
    this.modelo = modelo; // modelo THREE.js (Object3D ou Mesh)
    this.getTempoRestante = getTempoRestante; // função externa que retorna o tempo restante
    this.getTempoTotal = getTempoTotal; // tempo total de cozimento
    this.corFinal = corFinal; // cor final (ex: marrom escuro)
    modelo.traverse((child) => {
      if (child.isMesh && child.material) {
        this.materialOriginal = child.material.clone(); // clone do material original
      }
    });
  }

  update() {
    const tempoRestante = this.getTempoRestante();
    const tempoTotal = this.getTempoTotal();

    const progresso = 1 - Math.min(Math.max(tempoRestante / tempoTotal, 0), 1);
    this.modelo.traverse((child) => {
      if (
        child.isMesh &&
        child.material &&
        child.material.color &&
        this.materialOriginal
      ) {
        const corAtual = this.materialOriginal.color
          .clone()
          .lerp(this.corFinal, progresso);
        child.material.color.copy(corAtual);
      }
    });
    }

  reset() {
    this.modelo.traverse((child) => {
      if (
        child.isMesh &&
        child.material &&
        child.material.color &&
        this.materialOriginal
      ) {
        child.material.color.copy(this.materialOriginal.color);
      }
    });
  }
}

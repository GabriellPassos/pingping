import * as THREE from 'three';

export class AnimationManager {
  constructor({ modelo, animacoes, mixer }) {
    this.modelo = modelo;
    this.animacoes = animacoes || {};
    console.log(this.animacoes, 'choro')
    this.mixer = mixer || null;
  }

  play(nomeAnimacao, { loop = THREE.LoopOnce, clampWhenFinished = true, reset = true } = {}) {
    const animacao = this.animacoes[nomeAnimacao];
    if (!this.mixer) {
      this.mixer = this.animacoes.flip._mixer
      if (!animacao){
      console.warn(`Animação '${nomeAnimacao}' não encontrada ou mixer não definido.`);
      return;
      }
    }

    if (reset) animacao.reset();
    animacao.setLoop(loop);
    animacao.clampWhenFinished = clampWhenFinished;
    animacao.play();
  }

  stop(nomeAnimacao) {
    const animacao = this.animacoes[nomeAnimacao];
    if (animacao) animacao.stop();
  }

  stopAll() {
    Object.values(this.animacoes).forEach((a) => a.stop());
  }

  update(delta) {
    if (this.mixer) this.mixer.update(delta);
  }

  isRunning(nomeAnimacao) {
    const animacao = this.animacoes[nomeAnimacao];
    return animacao?.isRunning?.() || false;
  }
}

export const GameFlipEngine = (() => {
  let pontuacao = 0;
  let lastFlipTime = 0;
  let proximaBatida = Date.now() + 2000;
  const cooldown = 1000;
  const intervaloBatida = 2000;
  const toleranciaBatida = 300;
  const LIMIAR_FLIP_ROTACAO = 1;

  let ultimaBeta = null;
  let ultimaZRegistrado = 0;

  const ranges = {
    perfeito: [18, 25],
    bom: [13, 17.99],
    medio: [9, 12.99],
    fraco: [6, 8.99],
  };

  const listeners = {
    onFlip: [],
    onScoreChange: [],
    onBeat: [],
  };

  setInterval(() => {
    calcularNovaBatida();
    listeners.onBeat.forEach((cb) => cb(proximaBatida));
  }, intervaloBatida);

  function calcularNovaBatida() {
    proximaBatida = Date.now() + intervaloBatida;
  }

  function avaliarFlip(z, now) {
    const distanciaDaBatida = Math.abs(now - proximaBatida);
    const absZ = Math.abs(z);
    let resultado = "Movimento fraco demais.";
    let pontos = 0;

    if (distanciaDaBatida <= toleranciaBatida) {
      if (absZ >= ranges.perfeito[0]) {
        resultado = "Flip Perfeito!";
        pontos = 100;
      } else if (absZ >= ranges.bom[0]) {
        resultado = "Flip Bom!";
        pontos = 70;
      } else if (absZ >= ranges.medio[0]) {
        resultado = "Flip Médio.";
        pontos = 40;
      } else if (absZ >= ranges.fraco[0]) {
        resultado = "Flip Fraco.";
        pontos = 10;
      }

      if (pontos > 0) {
        pontuacao += pontos;
        lastFlipTime = now;
        listeners.onScoreChange.forEach((cb) => cb(pontuacao));
      }
    } else {
      resultado = "Fora da batida!";
    }

    listeners.onFlip.forEach((cb) =>
      cb({
        z,
        resultado,
        pontos,
        timestamp: now,
        distanciaDaBatida,
      })
    );
  }

  function handleMotion(event) {
    // Apenas registrar o último Z, sem disparar avaliação aqui
    ultimaZRegistrado = event.accelerationIncludingGravity.z;
  }

  function detectarRotacaoFlip(event) {
    const betaAtual = event.beta;

    if (ultimaBeta === null) {
      ultimaBeta = betaAtual;
      return;
    }

    const delta = betaAtual - ultimaBeta;
    ultimaBeta = betaAtual;

    const now = Date.now();
    if (
      Math.round(delta) >= LIMIAR_FLIP_ROTACAO &&
      now - lastFlipTime > cooldown
    ) {
      console.log("Flip detectado por rotação!", delta);
      avaliarFlip(ultimaZRegistrado, now);
    }
  }

  return {
    start() {
      window.addEventListener("devicemotion", handleMotion);
      window.addEventListener("deviceorientation", detectarRotacaoFlip);
    },
    stop() {
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", detectarRotacaoFlip);
    },
    getScore() {
      return pontuacao;
    },
    reset() {
      pontuacao = 0;
      lastFlipTime = 0;
      proximaBatida = Date.now() + intervaloBatida;
    },
    simulateFlip(z) {
      avaliarFlip(z, Date.now());
    },
    onFlip(callback) {
      listeners.onFlip.push(callback);
    },
    onScoreChange(callback) {
      listeners.onScoreChange.push(callback);
    },
    onBeat(callback) {
      listeners.onBeat.push(callback);
    },
    getNextBeatTime() {
      return proximaBatida;
    },
  };
})();

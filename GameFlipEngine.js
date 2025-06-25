export const GameFlipEngine = (() => {
  let pontuacao = 0;
  let lastFlipTime = 0;
  const cooldown = 1000;
  const intervaloBatida = 2000;
  let proximaBatida = Date.now() + intervaloBatida;
  const toleranciaBatida = 300;
  const LIMIAR_FLIP_ROTACAO = 10;

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
    console.log(proximaBatida)
    proximaBatida = Date.now() + intervaloBatida;
  }

  function avaliarFlip(z, now) {
  const distanciaDaBatida = Math.abs(now - proximaBatida);
  const maxTolerancia = toleranciaBatida; // por ex. 300ms

  let resultado = "Fora da batida!";
  let pontos = 0;

  if (distanciaDaBatida <= maxTolerancia) {
    const progresso = 1 - (distanciaDaBatida / maxTolerancia); // 1 = perfeito, 0 = na borda
    pontos = Math.round(progresso * 100);

    if (progresso > 0.8) {
      resultado = "perfeito";
    } else if (progresso > 0.4) {
      resultado = "medio";
    } else {
      resultado = "fraco";
    }


    } else {
      resultado = "errou";
    }

    listeners.onFlip.forEach((cb) =>
      cb({
        z,
        resultado,
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
    getTempoIntervalo(){
      return intervaloBatida;
    },
    getTempoRestante() {
      return Math.max(this.getNextBeatTime() - Date.now(), 0);
    },
  };
})();

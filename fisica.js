export class Fisica{
    calcularForcaSimples(inicialBeta, finalBeta, constante = 1) {
        const deltaBeta = finalBeta - inicialBeta;
        const forcaCoef = Math.abs(deltaBeta) * constante;
        return { deltaBeta, forcaCoef };
      }

      calcularPercursoMovimentoLinearVertical(F, m, deltaT, g = 9.8) {
        const v0 = (F / m) * deltaT;
        const hMax = v0 ** 2 / (2 * g);
        const tTotal = (2 * v0) / g;
        return {
          velocidadeInicial: v0,
          alturaMaxima: hMax,
          tempoTotal: tTotal,
        };
      }
}

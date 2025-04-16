import { Fisica } from "./fisica.js";
const fisica = new Fisica();
export class Giroscopio{
    movimentoVerticalComBeta(
        betaInicio,
        betaFim,
        limiteAmplitudeBeta
      ) {
        const impulso = fisica.calcularForcaSimples(betaInicio, betaFim);
        if (impulso.forcaCoef >= limiteAmplitudeBeta) {
          document.getElementById("coeficiente-forca").textContent =
            impulso.forcaCoef.toFixed(2);
          const trajetoria = fisica.calcularPercursoMovimentoLinearVertical(
            impulso.forcaCoef,
            1,
            1
          );
          return { ...impulso, ...trajetoria };
        } else {
          document.getElementById("coeficiente-forca").textContent = "Baixo";
        }
        return null;
      }
}
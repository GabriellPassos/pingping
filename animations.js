import * as THREE from "three";

export function rotacionarModeloPorBeta(beta, modelo, eixo) {
    if (!modelo || !(modelo instanceof THREE.Object3D)) {
      console.error('Modelo inválido fornecido.');
      return;
    }
  
    const betaEmRadianos = THREE.MathUtils.degToRad(beta);
  
    // Aplicar rotação
    if (eixo.x !== 0) {
      modelo.rotation.x = betaEmRadianos * eixo.x;
    }
    if (eixo.y !== 0) {
      modelo.rotation.y = betaEmRadianos * eixo.y;
    }
  }
  
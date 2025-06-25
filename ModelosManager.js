  export function buscarModelos(modelo, nomesVisiveis = []) {
    console.log(modelo)
    const nomesSet = new Set(nomesVisiveis);
    let modelosEncontrados = [];
    let modelosExcluidos = [];
    modelo.traverse((child) => {
      if (child.isMesh) {
        if (nomesSet.has(child.name)) {
          modelosEncontrados.push(child);
        }else{
          modelosExcluidos.push(child);
        }
      }
    });
    return {
      modelosEncontrados: modelosEncontrados,
      modelosExcluidos: modelosExcluidos,
    };
  }
  export function  setVisibilidadeModelo(modelos = [], estado) {
    modelos.forEach((modelo) => {
      modelo.visible = estado;
    });
  }
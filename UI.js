import { dicionarioPontuacao } from "./DicionarioPontuacao.js";

export function mostrarMensagemFlutuante(el, texto) {
  console.log(dicionarioPontuacao[texto].mensagem, texto)
    el.innerText = dicionarioPontuacao[texto].mensagem;
  console.log(texto)
  el.classList.add("show");

  // Remove depois de 1.5s
  setTimeout(() => {
    el.classList.remove("show");
  }, 600);
}

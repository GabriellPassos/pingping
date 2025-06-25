import { dicionarioPontuacao } from "./DicionarioPontuacao.js";

export class Pontuacao {
    constructor({ elementoMensagem, elementoPontuacao, elementoCombo }) {
      this.pontuacao = 0;
      this.combo = 0;
      this.multiplicador = 1;
  
      this.elMensagem = elementoMensagem;
      this.elPontuacao = elementoPontuacao;
      this.elCombo = elementoCombo;
  
      this._atualizarUI();
    }
  
    registrarAcerto(precisao) {
      let pontos = 0;
      let mensagem = "";
  
      switch (precisao) {
        case "perfeito":
          pontos = dicionarioPontuacao["perfeito"].pontos;
          mensagem = dicionarioPontuacao["perfeito"].mensagem;
          break;
        case "medio":
          pontos = dicionarioPontuacao["medio"].pontos;
          mensagem = dicionarioPontuacao["medio"].mensagem;
          break;
        case "fraco":
          pontos = dicionarioPontuacao["fraco"].pontos;
          mensagem = dicionarioPontuacao["fraco"].mensagem;
          break;
        default:
          pontos = dicionarioPontuacao["errou"].pontos;
          mensagem = dicionarioPontuacao["errou"].mensagem;
          break;
      }
  
      if (precisao !== "miss") {
        this.combo++;
        this.multiplicador = 1 + Math.floor(this.combo / 10);
        this.pontuacao += pontos * this.multiplicador;
      } else {
        this.combo = 0;
        this.multiplicador = 1;
      }
  
      //this._mostrarMensagem(mensagem);
      this._atualizarUI();
    }
  
   /* _mostrarMensagem(mensagem) {
      console.log(mensagem)
      if (this.elMensagem) {
        this.elMensagem.textContent = mensagem;
        this.elMensagem.style.opacity = 1;
        setTimeout(() => {
          this.elMensagem.style.opacity = 0;
        }, 100);
      }
    }*/
  
    _atualizarUI() {
      if (this.elPontuacao) {
        this.elPontuacao.textContent = `Pontuação: ${this.pontuacao}`;
      }
      if (this.elCombo) {
        this.elCombo.textContent = `Combo: ${this.combo}`;
      }
    }
  }
  
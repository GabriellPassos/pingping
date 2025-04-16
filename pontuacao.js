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
          pontos = 100;
          mensagem = "PERFECT!";
          break;
        case "medio":
          pontos = 70;
          mensagem = "GOOD!";
          break;
        case "fraco":
          pontos = 50;
          mensagem = "OK!";
          break;
        default:
          pontos = 0;
          mensagem = "MISS!";
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
  
      this._mostrarMensagem(mensagem);
      this._atualizarUI();
    }
  
    _mostrarMensagem(mensagem) {
      if (this.elMensagem) {
        this.elMensagem.textContent = mensagem;
        this.elMensagem.style.opacity = 1;
        setTimeout(() => {
          this.elMensagem.style.opacity = 0;
        }, 800);
      }
    }
  
    _atualizarUI() {
      if (this.elPontuacao) {
        this.elPontuacao.textContent = `Pontuação: ${this.pontuacao}`;
      }
      if (this.elCombo) {
        this.elCombo.textContent = `Combo: ${this.combo}`;
      }
    }
  }
  
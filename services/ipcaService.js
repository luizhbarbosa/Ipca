import historicoInflacao from '../dados/dados.js';

const ipcaService = {
  buscarHistorico: () => {
    return historicoInflacao;
  },

  buscarHistoricoPorId: (id) => {
    const idHistorico = parseInt(id);
    const historico = historicoInflacao.find(historico => historico.id === idHistorico);
    return historico;
  },

  buscarHistoricoPorAno: (ano) => {
    const anoHistorico = parseInt(ano);
    const historico = historicoInflacao.filter(historico => historico.ano === anoHistorico);
    return historico;
  },

  calcularReajuste: (valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) => {
    const historicoFiltrado = historicoInflacao.filter(
      historico => {
        if (dataInicialAno === dataFinalAno) {
          return historico.ano === dataInicialAno && historico.mes >= dataInicialMes && historico.mes <= dataFinalMes;
        } else {
          return (
            (historico.ano === dataInicialAno && historico.mes >= dataInicialMes) ||
            (historico.ano > dataInicialAno && historico.ano < dataFinalAno) ||
            (historico.ano === dataFinalAno && historico.mes <= dataFinalMes)
          );
        }
      }
    );

    let taxasMensais = 1;
    for (const elemento of historicoFiltrado) {
      taxasMensais *= (elemento.ipca / 100) + 1;
    }

    const resultado = valor * taxasMensais;
    return parseFloat(resultado.toFixed(2));
  },

  validacaoErro: (valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) => {
    const anoLimiteFinal = historicoInflacao[historicoInflacao.length - 1].ano;
    const anoLimiteInicial = historicoInflacao[0].ano
    const mesLimiteFinal = historicoInflacao[historicoInflacao.length - 1].mes;
    if (
      isNaN(valor) ||
      isNaN(dataInicialMes) ||
      isNaN(dataInicialAno) ||
      isNaN(dataFinalMes) ||
      isNaN(dataFinalAno) ||
      dataInicialMes < 1 || dataInicialMes > 12 ||
      dataInicialAno < anoLimiteInicial || dataInicialAno > anoLimiteFinal ||
      dataFinalMes < 1 || dataFinalMes > 12 ||
      dataFinalAno < anoLimiteInicial || dataFinalAno > anoLimiteFinal ||
      (dataFinalAno === anoLimiteFinal && dataFinalMes > mesLimiteFinal) ||
      dataFinalAno < dataInicialAno ||
      (dataFinalAno === dataInicialAno && dataFinalMes < dataInicialMes)
    ) {
      return true;
    } else {
      return false;
    }
  }
};

export default ipcaService;
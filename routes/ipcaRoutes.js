import express from 'express';
import ipcaService from '../services/ipcaService.js';

const router = express.Router();

router.get('/historicoIPCA/calculo', (req, res) => {
  const { valor, mesInicial, anoInicial, mesFinal, anoFinal } = req.query;

  // Verifica se os parâmetros necessários estão presentes
  if (!valor || !mesInicial || !anoInicial || !mesFinal || !anoFinal) {
    return res.status(400).json({ erro: 'Parâmetros incompletos' });
  }

  // Converte os parâmetros para números inteiros
  const valorFloat = parseFloat(valor);
  const mesInicialInt = parseInt(mesInicial);
  const anoInicialInt = parseInt(anoInicial);
  const mesFinalInt = parseInt(mesFinal);
  const anoFinalInt = parseInt(anoFinal);

  // Verifica se os parâmetros são válidos
  if (isNaN(valorFloat) || isNaN(mesInicialInt) || isNaN(anoInicialInt) || isNaN(mesFinalInt) || isNaN(anoFinalInt)) {
    return res.status(400).json({ erro: 'Parâmetros inválidos' });
  }

  // Verifica se o intervalo de datas é válido
  if (anoInicialInt > anoFinalInt || (anoInicialInt === anoFinalInt && mesInicialInt > mesFinalInt)) {
    return res.status(400).json({ erro: 'Intervalo de datas inválido' });
  }

  // Calcula o reajuste com base nos parâmetros fornecidos
  const resultado = ipcaService.calcularReajuste(valorFloat, mesInicialInt, anoInicialInt, mesFinalInt, anoFinalInt);
  res.json({ resultado: resultado });
});

router.get('/historicoIPCA/:id', (req, res) => {
  const id = req.params.id;

  // Verifica se o ID é um número inteiro
  if (isNaN(parseInt(id))) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  // Busca o histórico pelo ID fornecido
  const historico = ipcaService.buscarHistoricoPorId(id);

  // Verifica se o histórico foi encontrado
  if (!historico) {
    return res.status(404).json({ erro: 'Histórico não encontrado' });
  }

  res.json(historico);
});

router.get('/historicoIPCA', (req, res) => {
  const ano = req.query.ano;

  // Verifica se o ano foi fornecido como parâmetro
  if (!ano) {
    return res.status(400).json({ erro: 'Ano não especificado' });
  }

  // Converte o ano para número inteiro
  const anoInt = parseInt(ano);

  // Verifica se o ano é um número válido
  if (isNaN(anoInt)) {
    return res.status(400).json({ erro: 'Ano inválido' });
  }

  // Busca o histórico pelo ano fornecido
  const historicoPorAno = ipcaService.buscarHistoricoPorAno(anoInt);

  // Verifica se o histórico foi encontrado
  if (historicoPorAno.length === 0) {
    return res.status(404).json({ erro: 'Nenhum histórico encontrado para o ano especificado' });
  }

  res.json(historicoPorAno);
});

export default router;

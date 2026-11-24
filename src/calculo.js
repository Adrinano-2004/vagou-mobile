// regra de cobranca do Vagou (versao simplificada do sistema original)
//
// 1. ate a tolerancia (ex: 10 min) nao paga nada
// 2. cada hora iniciada conta como hora cheia: 1a hora + horas adicionais
// 3. ate 12h o valor nunca passa da meia diaria; de 12h a 24h, nunca passa da diaria
// 4. cada dia completo (24h) cobra uma diaria
// 5. diaria lancada: cobra o valor fixo da diaria, nao importa quanto tempo ficou

const MINUTOS_MEIO_DIA = 12 * 60;
const MINUTOS_DIA = 24 * 60;

export function calcularValor(tarifa, entrada, saida, diaria = false) {
  const minutos = Math.max(0, Math.floor((saida - entrada) / 60000));
  const detalhe = [];

  if (diaria) {
    detalhe.push(`Diária lançada: ${formatarMoeda(tarifa.diaria)}`);
    return { minutos, valor: tarifa.diaria, detalhe };
  }

  if (minutos <= tarifa.toleranciaMin) {
    detalhe.push(`Dentro da tolerância de ${tarifa.toleranciaMin} min`);
    return { minutos, valor: 0, detalhe };
  }

  const dias = Math.floor(minutos / MINUTOS_DIA);
  const resto = minutos % MINUTOS_DIA;
  let valor = dias * tarifa.diaria;

  if (dias > 0) {
    detalhe.push(`${dias} diária(s): ${formatarMoeda(dias * tarifa.diaria)}`);
  }

  if (resto > 0) {
    const horas = Math.ceil(resto / 60);
    let valorHoras = tarifa.primeiraHora + (horas - 1) * tarifa.horaAdicional;
    let texto = `${horas} hora(s) iniciada(s)`;

    if (resto <= MINUTOS_MEIO_DIA && valorHoras > tarifa.meiaDiaria) {
      valorHoras = tarifa.meiaDiaria;
      texto += ', limitado à meia diária';
    } else if (resto > MINUTOS_MEIO_DIA && valorHoras > tarifa.diaria) {
      valorHoras = tarifa.diaria;
      texto += ', limitado à diária';
    }

    valor += valorHoras;
    detalhe.push(`${texto}: ${formatarMoeda(valorHoras)}`);
  }

  return { minutos, valor, detalhe };
}

// ===== funcoes de formatacao usadas nas telas =====

// 12.5 -> 'R$ 12,50'
export function formatarMoeda(valor) {
  return 'R$ ' + Number(valor || 0).toFixed(2).replace('.', ',');
}

// 135 -> '2h 15min'
export function formatarTempo(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) {
    return `${resto}min`;
  }
  return `${horas}h ${String(resto).padStart(2, '0')}min`;
}

// data em milissegundos -> '14:05'
export function formatarHora(data) {
  const d = new Date(data);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// data em milissegundos -> '24/11 14:05'
export function formatarDataHora(data) {
  const d = new Date(data);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${formatarHora(data)}`;
}

// confere se a data e de hoje
export function ehHoje(data) {
  return new Date(data).toDateString() === new Date().toDateString();
}

// deixa a placa so com letras e numeros, em maiusculo: 'abc-1d23' -> 'ABC1D23'
export function limparPlaca(texto) {
  return texto.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// placa antiga (ABC1234) ou Mercosul (ABC1D23)
export function placaValida(placa) {
  return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa);
}

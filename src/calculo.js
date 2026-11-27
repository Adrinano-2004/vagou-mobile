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

export function formatarMoeda(valor) {
  return 'R$ ' + Number(valor || 0).toFixed(2).replace('.', ',');
}

export function formatarTempo(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) {
    return `${resto}min`;
  }
  return `${horas}h ${String(resto).padStart(2, '0')}min`;
}

export function formatarHora(data) {
  const d = new Date(data);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatarDataHora(data) {
  const d = new Date(data);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${formatarHora(data)}`;
}

export function ehHoje(data) {
  return new Date(data).toDateString() === new Date().toDateString();
}

export function limparPlaca(texto) {
  return texto.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function placaValida(placa) {
  return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa);
}

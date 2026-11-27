function campo(id, valor) {
  return id + String(valor.length).padStart(2, '0') + valor;
}

export function crc16(texto) {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function limpar(texto, maximo) {
  let resultado = String(texto || '');
  if (typeof resultado.normalize === 'function') {
    resultado = resultado.normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  return resultado
    .replace(/[^A-Za-z0-9 ]/g, '')
    .toUpperCase()
    .slice(0, maximo)
    .trim();
}

export function gerarPix({ chave, nome, cidade, valor, identificador }) {
  const conta = campo('00', 'br.gov.bcb.pix') + campo('01', chave.trim());

  let codigo =
    campo('00', '01') +
    campo('26', conta) +
    campo('52', '0000') +
    campo('53', '986') +
    (valor > 0 ? campo('54', valor.toFixed(2)) : '') +
    campo('58', 'BR') +
    campo('59', limpar(nome, 25) || 'ESTACIONAMENTO') +
    campo('60', limpar(cidade, 15) || 'BRASIL') +
    campo('62', campo('05', limpar(identificador, 25).replace(/ /g, '') || '***'));

  codigo += '6304';
  return codigo + crc16(codigo);
}

import { useEffect, useState } from 'react';

// hook que devolve a hora atual e se atualiza sozinho a cada X segundos
// usado pra o tempo de permanencia e o valor "correrem" na tela
export default function useAgora(segundos = 30) {
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    const relogio = setInterval(() => setAgora(Date.now()), segundos * 1000);
    // limpeza: quando a tela fecha, para o relogio
    return () => clearInterval(relogio);
  }, [segundos]);

  return agora;
}

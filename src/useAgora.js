import { useEffect, useState } from 'react';

export default function useAgora(segundos = 30) {
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    const relogio = setInterval(() => setAgora(Date.now()), segundos * 1000);

    return () => clearInterval(relogio);
  }, [segundos]);

  return agora;
}

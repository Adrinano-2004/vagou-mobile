# Vagou Mobile

App em React Native (Expo) para o operador de um estacionamento registrar a entrada e a saída dos veículos pela placa. Ele mostra quem está no pátio e calcula sozinho o valor a pagar, a partir da tabela de preços.

Trabalho final de Desenvolvimento Móvel. Dupla: Adriano e Arthur Villela.

## Telas

| Tela | Navegador | O que faz |
|---|---|---|
| Painel | Tabs | Vagas ocupadas e livres, valor recebido hoje e últimas movimentações |
| Entrada | Tabs | Placa, tipo, marca, modelo (API FIPE) e cor do veículo |
| Pátio | Tabs | Veículos estacionados, tempo de permanência e busca por placa |
| Histórico | Tabs | Saídas registradas, com valor e forma de pagamento |
| Detalhe do ticket | Stack | Cálculo do valor e registro da saída |
| Tarifas | Drawer | Tabela de preços e total de vagas |
| Sobre | Drawer | Informações do app e da dupla |

## Tecnologias

- Expo + Expo Router (rotas baseadas em arquivos: Stack, Drawer e Tabs)
- `fetch` na API da Tabela FIPE (`https://parallelum.com.br/fipe/api/v1`)
- AsyncStorage para salvar os dados no aparelho
- Context API, `useState` e `useEffect`

## Como rodar

```bash
npm install
npx expo start
```

Depois, leia o QR code com o app Expo Go no celular ou aperte `w` para abrir no navegador.

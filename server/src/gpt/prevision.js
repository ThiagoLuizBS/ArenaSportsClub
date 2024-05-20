import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

export async function GPTPrevision(data) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: data.model,
      messages: [
        {
          role: "system",
          content: `Você é um especialista matemático e grande conhecedor de futebol. Irei te fornecer algumas informações sobre uma partida de futebol que vai ocorrer.  Essas informações seriam o nome de cada equipe, o local da partida e o mais importante o histórico de partidas de cada equipe. O histórico contém informações das últimas 6 partidas, cada partida terá informações como resultado,  sumário de acontecimentos, estatísticas, data e local da realização da partida.
          
          Seu trabalho será analisar essas informações, principalmente os resultados anteriores de cada equipe e fazer uma previsão do resultado da partida que irá acontecer. A sua resposta deverá  seguir o modelo abaixo de tabela:
          
          Time X - Time Y
          Probabilidade Time X  vitória   | Empate       | Probabilidade Time Y  vitória
          45%                             | 20%          | 25%
          
          Agora irei te fornecer uma partida por vez, cada uma com suas informações e o histórico de cada partida. Faça sua análise de dados e me forneça apenas a tabela como resposta.
          `,
        },
        {
          role: "user",
          content: `Partida:

          """
          Liverpool x Manchester City, campeonato Premier League - 2023/2024, local Anfield (Liverpool), data 06/05/2024 às 15:00.

          Histórico de partidas do Liverpool:
          Liverpool 2 - 1 Chelsea, campeonato Premier League - 2023/2024, local Anfield (Liverpool), data 29/04/2024 às 16:00. Posse de bola: 55% - 45%, Passes corretos: 450 - 380, Chutes a gol: 8 - 5, Escanteios: 6 - 3.
          Everton 0 - 3 Liverpool, campeonato Premier League - 2023/2024, local Goodison Park (Liverpool), data 22/04/2024 às 14:30. Posse de bola: 60% - 40%, Passes corretos: 510 - 300, Chutes a gol: 10 - 2, Escanteios: 7 - 1.
          Leicester City 1 - 2 Liverpool, campeonato Premier League - 2023/2024, local King Power Stadium (Leicester), data 15/04/2024 às 17:00. Posse de bola: 48% - 52%, Passes corretos: 400 - 480, Chutes a gol: 6 - 9, Escanteios: 4 - 8.
          Liverpool 3 - 0 Arsenal, campeonato Premier League - 2023/2024, local Anfield (Liverpool), data 08/04/2024 às 15:00. Posse de bola: 58% - 42%, Passes corretos: 490 - 320, Chutes a gol: 12 - 3, Escanteios: 9 - 2.
          Manchester United 1 - 1 Liverpool, campeonato Premier League - 2023/2024, local Old Trafford (Manchester), data 01/04/2024 às 16:30. Posse de bola: 50% - 50%, Passes corretos: 430 - 430, Chutes a gol: 7 - 7, Escanteios: 5 - 5.
          Liverpool 4 - 0 Leicester City, campeonato Premier League - 2023/2024, local Anfield (Liverpool), data 26/03/2024 às 17:00. Posse de bola: 48% - 52%, Passes corretos: 400 - 480, Chutes a gol: 6 - 9, Escanteios: 4 - 8.

          Histórico de partidas do Manchester City:
          Manchester City 3 - 0 Southampton, campeonato Premier League - 2023/2024, local Etihad Stadium (Manchester), data 28/04/2024 às 15:00. Posse de bola: 62% - 38%, Passes corretos: 540 - 280, Chutes a gol: 15 - 3, Escanteios: 8 - 1.
          Burnley 1 - 2 Manchester City, campeonato Premier League - 2023/2024, local Turf Moor (Burnley), data 20/04/2024 às 15:00. Posse de bola: 57% - 43%, Passes corretos: 500 - 320, Chutes a gol: 10 - 4, Escanteios: 6 - 2.
          Manchester City 4 - 0 Wolverhampton Wanderers, campeonato Premier League - 2023/2024, local Etihad Stadium (Manchester), data 14/04/2024 às 15:00. Posse de bola: 65% - 35%, Passes corretos: 580 - 240, Chutes a gol: 18 - 2, Escanteios: 10 - 0.
          Tottenham Hotspur 1 - 3 Manchester City, campeonato Premier League - 2023/2024, local Tottenham Hotspur Stadium (Londres), data 07/04/2024 às 15:00. Posse de bola: 60% - 40%, Passes corretos: 510 - 340, Chutes a gol: 13 - 5, Escanteios: 7 - 3.
          Manchester City 2 - 2 Leeds United, campeonato Premier League - 2023/2024, local Etihad Stadium (Manchester), data 31/03/2024 às 15:00. Posse de bola: 58% - 42%, Passes corretos: 480 - 360, Chutes a gol: 11 - 6, Escanteios: 5 - 4.
          Manchester City 6 - 1 Burnley, campeonato Premier League - 2023/2024, local Etihad Stadium (Manchester City), data 25/03/2024 às 15:00. Posse de bola: 57% - 43%, Passes corretos: 500 - 320, Chutes a gol: 10 - 4, Escanteios: 6 - 2.
          """
          `,
        },
      ],
    });

    return chatCompletion.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

export async function getPrevisionResponse(req, res, next) {
  try {
    let body = req.body;
    let {
      model,
      language,
      shotsLearning,
      matchsCounter,
      statisticsSelected,
      statisticsChampionshipSelected,
    } = body;
    const response = await GPTPrevision({
      model,
      language,
      shotsLearning,
      matchsCounter,
      statisticsSelected,
      statisticsChampionshipSelected,
    });

    res.status(200).json({
      data: response,
    });

    return;
  } catch (e) {
    console.log(`api, ${e}`);
    res.status(500).json({ error: e });
    return;
  }
}

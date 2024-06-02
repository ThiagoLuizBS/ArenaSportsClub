import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import matchsDAO from "../dao/matchsDAO.js";
import championshipsDAO from "../dao/championshipsDAO.js";
import previsionsDAO from "../dao/previsionsDAO.js";

dotenv.config();

export async function GPTPrevision(data) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const messages = [];

  messages.push({
    role: "system",
    content: `Você é um especialista matemático e grande conhecedor de futebol. Irei te fornecer algumas informações sobre uma partida de futebol que vai ocorrer. Essas informações incluem o nome de cada equipe, o local da partida e o histórico de partidas de cada equipe. O histórico contém informações das últimas ${data.matchsCounter} partidas, incluindo resultado, estatísticas, data e local da realização da partida. Também haverá estatísticas do campeonato em que a partida será realizada.

    Seu trabalho é analisar essas informações, especialmente os resultados anteriores de cada equipe, e fazer uma previsão do resultado da partida que irá acontecer. Sua resposta deve seguir o modelo de tabela abaixo:

    Time X x Time Y
    Probabilidade Time X vitória: 45% | Empate: 20% | Probabilidade Time Y vitória: 25%
    
    Agora irei te fornecer uma partida por vez, cada uma com suas informações e o histórico de cada partida. Faça sua análise de dados, tome o tempo necessário para realizar a análise e depois me forneça apenas a tabela como resposta.
    `,
  });

  if (data.shotsLearning > 0) {
    messages.push({
      role: "user",
      content: `Partida:
      
      """
      Hellas Verona x Inter de Milão, campeonato Campeonato Italiano - 2023/2024, local Stadio Marc'Antonio Bentegodi (Verona), data 26/05/2024.

      Histórico de partidas do Hellas Verona:
      Salernitana 1 x 2 Hellas Verona, campeonato Campeonato Italiano - 2023/2024, local Stadio Arechi (Salerno), data 20/05/2024. Posse de bola (%): 54% - 46%, Passes corretos (%): 75% - 70%, Total de passes: 415 - 351, Chutes no gol: 1 - 5, Total de chutes: 9 - 17.
      Hellas Verona 1 x 2 Torino, campeonato Campeonato Italiano - 2023/2024, local Stadio Marc'Antonio Bentegodi (Verona), data 12/05/2024. Posse de bola (%): 43% - 57%, Passes corretos (%): 70% - 80%, Total de passes: 330 - 454, Chutes no gol: 5 - 2, Total de chutes: 13 - 6.
      Hellas Verona 2 x 1 Fiorentina, campeonato Campeonato Italiano - 2023/2024, local Stadio Marc'Antonio Bentegodi (Verona), data 05/05/2024. Posse de bola (%): 38% - 62%, Passes corretos (%): 65% - 72%, Total de passes: 275 - 464, Chutes no gol: 4 - 4, Total de chutes: 9 - 13.
      Lazio 1 x 0 Hellas Verona, campeonato Campeonato Italiano - 2023/2024, local Stadio Olimpico (Romagnano Sesia), data 27/04/2024. Posse de bola (%): 69% - 31%, Passes corretos (%): 84% - 62%, Total de passes: 532 - 232, Chutes no gol: 5 - 1, Total de chutes: 17 - 7.
      Hellas Verona 1 x 0 Udinese, campeonato Campeonato Italiano - 2023/2024, local Stadio Marc'Antonio Bentegodi (Verona), data 20/04/2024. Posse de bola (%): 53% - 47%, Passes corretos (%): 69% - 73%, Total de passes: 330 - 307, Chutes no gol: 4 - 1, Total de chutes: 16 - 18.
      Atalanta 2 x 2 Hellas Verona, campeonato Campeonato Italiano - 2023/2024, local Gewiss Stadium (Bergamo), data 15/04/2024. Posse de bola (%): 59% - 41%, Passes corretos (%): 77% - 67%, Total de passes: 501 - 340, Chutes no gol: 9 - 5, Total de chutes: 16 - 13.
      
      Histórico de partidas do Inter de Milão:
      Inter de Milão 1 x 1 Lazio, campeonato Campeonato Italiano - 2023/2024, local Stadio Giuseppe Meazza (Milan), data 19/05/2024. Posse de bola (%): 58% - 0%, Passes corretos (%): 90% - 162%, Total de passes: 576 - 216, Chutes no gol: 7 - 4, Total de chutes: 19 - 8.
      Frosinone 0 x 5 Inter de Milão, campeonato Campeonato Italiano - 2023/2024, local Stadio Benito Stirpe (Frosinone), data 10/05/2024. Posse de bola (%): 41% - 59%, Passes corretos (%): 84% - 89%, Total de passes: 400 - 575, Chutes no gol: 8 - 5, Total de chutes: 17 - 14.
      Sassuolo 1 x 0 Inter de Milão, campeonato Campeonato Italiano - 2023/2024, local MAPEI Stadium - Città del Tricolore (Reggio Emilia), data 04/05/2024. Posse de bola (%): 24% - 76%, Passes corretos (%): 70% - 91%, Total de passes: 230 - 720, Chutes no gol: 2 - 2, Total de chutes: 6 - 14.
      Inter de Milão 2 x 0 Torino, campeonato Campeonato Italiano - 2023/2024, local Stadio Giuseppe Meazza (Milan), data 28/04/2024. Posse de bola (%): 62% - 38%, Passes corretos (%): 91% - 87%, Total de passes: 675 - 396, Chutes no gol: 5 - 3, Total de chutes: 17 - 11.
      Milan 1 x 2 Inter de Milão, campeonato Campeonato Italiano - 2023/2024, local Stadio Giuseppe Meazza (Milano), data 22/04/2024. Posse de bola (%): 52% - 48%, Passes corretos (%): 87% - 85%, Total de passes: 510 - 478, Chutes no gol: 6 - 3, Total de chutes: 15 - 11.
      Inter de Milão 2 x 2 Cagliari, campeonato Campeonato Italiano - 2023/2024, local Stadio Giuseppe Meazza (Milano), data 14/04/2024. Posse de bola (%): 63% - 37%, Passes corretos (%): 92% - 86%, Total de passes: 617 - 368, Chutes no gol: 7 - 6, Total de chutes: 15 - 10.
      
      Estatísticas do campeonato Campeonato Italiano - 2023/2024:

      Hellas Verona - Posição: 13°, Pontos: 38, Jogos: 38, Vitórias: 9, Empates: 11, Derrotas: 18, Gols marcados: 38, Gols sofridos: 51, Saldo de gols: -13, Gols esperados (xG): 38.0, Gols esperados contra (xGA): 48.7, Gols esperados diferença (xGD): -10.7, Chutes: 435, Chutes ao alvo: 146, Porcentagem de chutes ao alvo: 33.6%.
      Inter de Milão - Posição: 1°, Pontos: 94, Jogos: 38, Vitórias: 29, Empates: 7, Derrotas: 2, Gols marcados: 89, Gols sofridos: 22, Saldo de gols: +67, Gols esperados (xG): 78.2, Gols esperados contra (xGA): 31.2, Gols esperados diferença (xGD): +47.1, Chutes: 580, Chutes ao alvo: 196, Porcentagem de chutes ao alvo: 33.8%.
      """
      `,
    });

    messages.push({
      role: "assistant",
      content: `Hellas Verona x Inter de Milão\nProbabilidade Hellas Verona vitória: 15% | Empate: 20% | Probabilidade Inter de Milão vitória: 65%`,
    });
  }

  if (data.shotsLearning > 1) {
    messages.push({
      role: "user",
      content: `Partida:
      
      """
      Real Madrid x Barcelona, campeonato Campeonato Espanhol - 2023/2024, local Estádio Santiago Bernabéu (Madrid), data 21/04/2024.

      Histórico de partidas do Real Madrid:
      Manchester City 1 x 1 Real Madrid, campeonato Champions League - 2023/2024, local Etihad Stadium (Manchester), data 17/04/2024. Posse de bola (%): 67% - 33%, Total de passes: 920 - 458, Passes corretos (%): 91% - 81%, Total de chutes: 33 - 8, Chutes no gol: 9 - 3.
      Mallorca 0 x 1 Real Madrid, campeonato Campeonato Espanhol - 2023/2024, local Estádio Iberoamericano 2010 (San Fernando), data 13/04/2024. Posse de bola (%): 43% - 57%, Total de passes: 414 - 559, Passes corretos (%): 80% - 86%, Total de chutes: 6 - 16, Chutes no gol: 2 - 9.
      Real Madrid 3 x 3 Manchester City, campeonato Champions League - 2023/2024, local Estádio Santiago Bernabéu (Madrid), data 09/04/2024. Posse de bola (%): 38% - 62%, Total de passes: 423 - 690, Passes corretos (%): 86% - 91%, Total de chutes: 14 - 12, Chutes no gol: 5 - 6.
      Real Madrid 2 x 0 Athletic Bilbao, campeonato Campeonato Espanhol - 2023/2024, local Estádio Santiago Bernabéu (Madrid), data 31/03/2024. Posse de bola (%): 58% - 42%, Total de passes: 640 - 442, Passes corretos (%): 88% - 82%, Total de chutes: 9 - 7, Chutes no gol: 4 - 3.
      Atlético Madrid 4 x 2 Real Madrid, campeonato Copa do Rei - 2023/2024, local Estádio Wanda Metropolitano (Madrid), data 18/01/2024. Posse de bola (%): 41% - 59%, Total de passes: 548 - 789, Passes corretos (%): 87% - 91%, Total de chutes: 18 - 19, Chutes no gol: 7 - 6.
      Real Madrid 2 x 1 Getafe, campeonato Campeonato Espanhol - 2023/2024, local Estádio Santiago Bernabéu (Madrid), data 02/09/2023. Posse de bola (%): 69% - 31%, Total de passes: 730 - 229, Passes corretos (%): 88% - 66%, Total de chutes: 26 - 6, Chutes no gol: 12 - 2.

      Histórico de partidas do Barcelona:
      Barcelona 1 x 4 PSG, campeonato Champions League - 2023/2024, local Estadi Olímpic Lluís Companys (Barcelona), data 16/04/2024. Posse de bola (%): 33% - 67%, Total de passes: 285 - 581, Passes corretos (%): 71% - 90%, Total de chutes: 7 - 21, Chutes no gol: 3 - 9.
      Cádiz 0 x 1 Barcelona, campeonato Campeonato Espanhol - 2023/2024, local Estádio Nuevo Mirandilla (Cádiz), data 13/04/2024. Posse de bola (%): 38% - 62%, Total de passes: 328 - 561, Passes corretos (%): 74% - 84%, Total de chutes: 16 - 12, Chutes no gol: 3 - 2.
      PSG 2 x 3 Barcelona, campeonato Champions League - 2023/2024, local Parc des Princes (Paris), data 10/04/2024. Posse de bola (%): 59% - 41%, Total de passes: 567 - 396, Passes corretos (%): 89% - 83%, Total de chutes: 18 - 15, Chutes no gol: 6 - 7.
      Athletic Bilbao 4 x 2 Barcelona, campeonato Copa do Rei - 2023/2024, local San Mamés Barria (Bilbao), data 24/01/2024. Posse de bola (%): 39% - 61%, Total de passes: 450 - 747, Passes corretos (%): 79% - 87%, Total de chutes: 29 - 7, Chutes no gol: 7 - 4.
      Unionistas de Salamanca 1 x 3 Barcelona, campeonato Copa do Rei - 2023/2024, local Pistas del Helmántico (Salamanca), data 18/01/2024. Posse de bola (%): 26% - 74%, Total de passes: 228 - 696, Passes corretos (%): 67% - 89%, Total de chutes: 10 - 14, Chutes no gol: 4 - 8.
      Getafe 0 x 0 Barcelona, campeonato Campeonato Espanhol - 2023/2024, local Coliseum Alfonso Pérez (Getafe), data 13/08/2023. Posse de bola (%): 25% - 75%, Total de passes: 234 - 729, Passes corretos (%): 71% - 90%, Total de chutes: 5 - 14, Chutes no gol: 2 - 4.

      Estatísticas do campeonato Campeonato Espanhol - 2023/2024:

      Real Madrid - Chutes: 593, Chutes ao alvo: 242, Porcentagem de chutes ao alvo: 40.8%, Gols esperados (xG): 68.8, Gols esperados contra (xGA): 35.4, Gols esperados diferença (xGD): +33.4, Pontos: 95, Jogos: 38, Vitórias: 29, Empates: 8, Derrotas: 1, Gols marcados: 87, Gols sofridos: 26, Saldo de gols: +61, Posição: 1°.
      Barcelona - Chutes: 588, Chutes ao alvo: 219, Porcentagem de chutes ao alvo: 37.2%, Gols esperados (xG): 77.6, Gols esperados contra (xGA): 41.6, Gols esperados diferença (xGD): +35.9, Pontos: 85, Jogos: 38, Vitórias: 26, Empates: 7, Derrotas: 5, Gols marcados: 79, Gols sofridos: 44, Saldo de gols: +35, Posição: 2°.
      """
      `,
    });

    messages.push({
      role: "assistant",
      content: `Real Madrid x Barcelona  \nProbabilidade Real Madrid vitória: 45% | Empate: 30% | Probabilidade Barcelona vitória: 25%`,
    });

    messages.push({
      role: "user",
      content: `Partida:
      
      """
      Manchester City x Luton Town, campeonato Campeonato Inglês - 2023/2024, local Etihad Stadium (Manchester), data 13/04/2024.

      Histórico de partidas do Manchester City:
      Real Madrid 3 x 3 Manchester City, campeonato Champions League - 2023/2024, local Estádio Santiago Bernabéu (Madrid), data 09/04/2024. Posse de bola (%): 38% - 62%, Total de passes: 423 - 690, Passes corretos (%): 86% - 91%, Total de chutes: 14 - 12, Chutes no gol: 5 - 6.
      Crystal Palace 2 x 4 Manchester City, campeonato Campeonato Inglês - 2023/2024, local Selhurst Park (London), data 06/04/2024. Posse de bola (%): 24% - 76%, Total de passes: 263 - 832, Passes corretos (%): 76% - 90%, Total de chutes: 7 - 18, Chutes no gol: 4 - 8.
      Manchester City 4 x 1 Aston Villa, campeonato Campeonato Inglês - 2023/2024, local Etihad Stadium (Manchester), data 03/04/2024. Posse de bola (%): 68% - 32%, Total de passes: 701 - 337, Passes corretos (%): 92% - 86%, Total de chutes: 25 - 8, Chutes no gol: 11 - 3.
      Manchester City 0 x 0 Arsenal, campeonato Campeonato Inglês - 2023/2024, local Etihad Stadium (Manchester), data 31/03/2024. Posse de bola (%): 72% - 28%, Total de passes: 700 - 269, Passes corretos (%): 88% - 71%, Total de chutes: 12 - 6, Chutes no gol: 1 - 2.
      Liverpool 1 x 1 Manchester City, campeonato Campeonato Inglês - 2023/2024, local Anfield (Liverpool), data 10/03/2024. Posse de bola (%): 53% - 47%, Total de passes: 584 - 530, Passes corretos (%): 83% - 82%, Total de chutes: 19 - 10, Chutes no gol: 6 - 6.
      Manchester City 3 x 1 Manchester United, campeonato Campeonato Inglês - 2023/2024, local Etihad Stadium (Manchester), data 03/03/2024. Posse de bola (%): 74% - 26%, Total de passes: 801 - 305, Passes corretos (%): 91% - 78%, Total de chutes: 27 - 3, Chutes no gol: 8 - 1.

      Histórico de partidas do Luton Town:
      Luton Town 2 x 1 Bournemouth, campeonato Campeonato Inglês - 2023/2024, local Kenilworth Road Stadium (Luton), data 06/04/2024. Posse de bola (%): 56% - 44%, Total de passes: 397 - 321, Passes corretos (%): 74% - 67%, Total de chutes: 19 - 8, Chutes no gol: 9 - 1.
      Arsenal 2 x 0 Luton Town, campeonato Campeonato Inglês - 2023/2024, local Emirates Stadium (London), data 03/04/2024. Posse de bola (%): 58% - 42%, Total de passes: 614 - 430, Passes corretos (%): 88% - 82%, Total de chutes: 13 - 5, Chutes no gol: 4 - 1.
      Tottenham 2 x 1 Luton Town, campeonato Campeonato Inglês - 2023/2024, local Tottenham Hotspur Stadium (London), data 30/03/2024. Posse de bola (%): 70% - 30%, Total de passes: 610 - 255, Passes corretos (%): 84% - 69%, Total de chutes: 17 - 7, Chutes no gol: 4 - 3.
      Luton Town 1 x 1 Nottingham Forest, campeonato Campeonato Inglês - 2023/2024, local Kenilworth Road Stadium (Luton), data 16/03/2024. Posse de bola (%): 60% - 40%, Total de passes: 440 - 297, Passes corretos (%): 81% - 72%, Total de chutes: 10 - 16, Chutes no gol: 4 - 6.
      Bournemouth 4 x 3 Luton Town, campeonato Campeonato Inglês - 2023/2024, local Vitality Stadium (Bournemouth), data 13/03/2024. Posse de bola (%): 59% - 41%, Total de passes: 438 - 310, Passes corretos (%): 80% - 68%, Total de chutes: 24 - 8, Chutes no gol: 10 - 4.
      Crystal Palace 1 x 1 Luton Town, campeonato Campeonato Inglês - 2023/2024, local Selhurst Park (London), data 09/03/2024. Posse de bola (%): 50% - 50%, Total de passes: 436 - 431, Passes corretos (%): 79% - 78%, Total de chutes: 21 - 8, Chutes no gol: 4 - 2.
      
      Estatísticas do campeonato Campeonato Inglês - 2023/2024:

      Manchester City - Posição: 1°, Pontos: 91, Jogos: 38, Vitórias: 28, Empates: 7, Derrotas: 3, Gols marcados: 96, Gols sofridos: 34, Saldo de gols: +62, Gols esperados (xG): 80.5, Gols esperados contra (xGA): 35.6, Gols esperados diferença (xGD): +44.9, Chutes: 683, Chutes ao alvo: 264, Porcentagem de chutes ao alvo: 38.7%.
      Luton Town - Posição: 18°, Pontos: 26, Jogos: 38, Vitórias: 6, Empates: 8, Derrotas: 24, Gols marcados: 52, Gols sofridos: 85, Saldo de gols: -33, Gols esperados (xG): 42.4, Gols esperados contra (xGA): 78.0, Gols esperados diferença (xGD): -35.5, Chutes: 427, Chutes ao alvo: 134, Porcentagem de chutes ao alvo: 31.4%.
      """
      `,
    });

    messages.push({
      role: "assistant",
      content: `Manchester City x Luton Town  \nProbabilidade Manchester City vitória: 80% | Empate: 10% | Probabilidade Luton Town vitória: 10%`,
    });
  }

  messages.push({
    role: "user",
    content: `Partida:

    """
    ${data.matchPresentation}

    Histórico de partidas do ${data.match.teams.homeName}:
    ${data.homeMatchsPresentation}

    Histórico de partidas do ${data.match.teams.awayName}:
    ${data.awayMatchsPresentation}

    ${data.championshipPresentation}
    """
    `,
  });

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: data.model,
      messages,
    });

    return chatCompletion.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

function getMatchPresentation(matchs, statistics) {
  let matchResume = [];

  matchs.forEach((match) => {
    let statisticsResume = [];
    statistics.forEach((element) => {
      let index = match.statistics.findIndex((item) => item.type === element);

      if (index !== -1)
        statisticsResume.push(
          `${element}: ${match.statistics[index].home}${
            element.includes("%") ? "%" : ""
          } - ${match.statistics[index].away}${
            element.includes("%") ? "%" : ""
          }`
        );
    });

    if (matchs.length > 1)
      matchResume.push(
        `${match.teams.homeName} ${match.scoreHome} x ${match.scoreAway} ${
          match.teams.awayName
        }, campeonato ${match.championship}, local ${match.stadium}, data ${
          match.day
        }.${
          statisticsResume.length > 0 ? ` ${statisticsResume.join(", ")}.` : ``
        }`
      );
    else
      matchResume.push(
        `${match.teams.homeName} x ${match.teams.awayName}, campeonato ${
          match.championship
        }, local ${match.stadium}, data ${match.day}.${
          statisticsResume.length > 0 ? ` ${statisticsResume.join(", ")}.` : ``
        }`
      );
  });
  return matchResume.join("\n");
}

function getChampionshipPresentation(
  championship,
  match,
  statisticsChampionshipSelected
) {
  let statisticsHomeResume = [];
  let statisticsAwayResume = [];

  championship.table[0].table.forEach((team, idx) => {
    if (team.team === match.teams.homeName) {
      statisticsChampionshipSelected.forEach((element) => {
        let index = dictionary.findIndex((item) => item.name === element);

        if (index !== -1) {
          const aux = dictionary[index].atributes.reduce(
            (acc, item, i) =>
              acc !== ""
                ? `${acc}, ${dictionary[index].description[i]}: ${championship.extraTable[idx][item]}${dictionary[index].icon[i]}`
                : `${dictionary[index].description[i]}: ${championship.extraTable[idx][item]}${dictionary[index].icon[i]}`,
            ""
          );
          statisticsHomeResume.push(aux);
        }
      });
    } else if (team.team === match.teams.awayName) {
      statisticsChampionshipSelected.forEach((element) => {
        let index = dictionary.findIndex((item) => item.name === element);

        if (index !== -1) {
          const aux = dictionary[index].atributes.reduce(
            (acc, item, i) =>
              acc !== ""
                ? `${acc}, ${dictionary[index].description[i]}: ${championship.extraTable[idx][item]}${dictionary[index].icon[i]}`
                : `${dictionary[index].description[i]}: ${championship.extraTable[idx][item]}${dictionary[index].icon[i]}`,
            ""
          );
          statisticsAwayResume.push(aux);
        }
      });
    }
  });

  return `Estatísticas do campeonato ${championship.name}:\n\n${
    match.teams.homeName
  } - ${statisticsHomeResume.join(", ")}.\n${
    match.teams.awayName
  } - ${statisticsAwayResume.join(", ")}.`;
}

export async function getPrevisionResponse(req, res, next) {
  try {
    let body = req.body;
    let {
      matchSelected,
      matchsCounter,
      model,
      shotsLearning,
      statisticsSelected,
      statisticsChampionshipSelected,
    } = body;

    shotsLearning =
      shotsLearning === "One-shot"
        ? 1
        : shotsLearning === "Three-shots"
        ? 3
        : 0;

    let match = await matchsDAO.getMatchByID(matchSelected);
    match = match[0];

    let homeLastMatchs = await matchsDAO.getPastMatchsByTeamWithLimit(
      match.teams.homeId,
      match.date,
      matchsCounter
    );
    let awayLastMatchs = await matchsDAO.getPastMatchsByTeamWithLimit(
      match.teams.awayId,
      match.date,
      matchsCounter
    );

    let championship = await championshipsDAO.getChampionshipByChampionshipUrl(
      match.championshipUrl
    );
    championship = championship[0];

    const matchPresentation = getMatchPresentation([match], []);

    const homeMatchsPresentation = getMatchPresentation(
      homeLastMatchs,
      statisticsSelected
    );
    const awayMatchsPresentation = getMatchPresentation(
      awayLastMatchs,
      statisticsSelected
    );

    const championshipPresentation = getChampionshipPresentation(
      championship,
      match,
      statisticsChampionshipSelected
    );

    const response = await GPTPrevision({
      model,
      shotsLearning,
      matchsCounter,
      statisticsSelected,
      statisticsChampionshipSelected,
      match,
      matchPresentation,
      homeMatchsPresentation,
      awayMatchsPresentation,
      homeLastMatchs,
      awayLastMatchs,
      championshipPresentation,
    });

    res.status(200).json({
      data: {
        match,
        homeLastMatchs,
        awayLastMatchs,
        championship,
      },
      prompt: {
        matchPresentation,
        homeMatchsPresentation,
        awayMatchsPresentation,
        championshipPresentation,
      },
      promptOptions: {
        matchSelected,
        matchsCounter,
        model,
        shotsLearning,
        statisticsSelected,
        statisticsChampionshipSelected,
      },
      response: {
        prevision: response.choices[0].message.content,
        created: new Date(response.created * 1000),
        promptTokens: response.usage.prompt_tokens,
        responseTokens: response.usage.completion_tokens,
      },
    });

    const data = {
      promptOptions: {
        matchSelected,
        matchsCounter,
        model,
        shotsLearning,
        statisticsSelected,
        statisticsChampionshipSelected,
      },
      response: {
        prevision: response.choices[0].message.content,
        created: new Date(response.created * 1000),
        promptTokens: response.usage.prompt_tokens,
        responseTokens: response.usage.completion_tokens,
      },
    };

    previsionsDAO.addPrevision(data);

    return;
  } catch (e) {
    console.log(`api, ${e}`);
    res.status(500).json({ error: e });
    return;
  }
}

const dictionary = [
  {
    name: "Posição",
    atributes: ["num"],
    description: ["Posição"],
    icon: ["°"],
  },
  {
    name: "Pts/J/V/E/D",
    atributes: ["pts", "mp", "w", "d", "l"],
    description: ["Pontos", "Jogos", "Vitórias", "Empates", "Derrotas"],
    icon: ["", "", "", "", ""],
  },
  {
    name: "Sh/SoT/SoT%",
    atributes: ["sh", "sot", "sotp"],
    description: ["Chutes", "Chutes ao alvo", "Porcentagem de chutes ao alvo"],
    icon: ["", "", "%"],
  },
  {
    name: "GM/GS/SG",
    atributes: ["gf", "ga", "gd"],
    description: ["Gols marcados", "Gols sofridos", "Saldo de gols"],
    icon: ["", "", ""],
  },
  {
    name: "xG/xGA/xGD",
    atributes: ["xg", "xga", "xgd"],
    description: [
      "Gols esperados (xG)",
      "Gols esperados contra (xGA)",
      "Gols esperados diferença (xGD)",
    ],
    icon: ["", "", ""],
  },
  {
    name: "Poss/Cmp/Cmpp",
    atributes: ["poss", "cmp", "cmpp"],
    description: [
      "Média de posse de bola",
      "Passes completos",
      "Porcentagem de passes completos",
    ],
    icon: ["", "", "%"],
  },
  {
    name: "PrgC/PrgP",
    atributes: ["prgc", "prgp"],
    description: ["Corridas progressivas", "Passes progressivos"],
    icon: ["", ""],
  },
  {
    name: "Faltas cometidas",
    atributes: ["fls"],
    description: ["Faltas cometidas"],
    icon: [""],
  },
  {
    name: "Cartões amarelos e vermelhos",
    atributes: ["crdy", "crdr"],
    description: ["Cartões amarelos", "Cartões vermelhos"],
    icon: ["", ""],
  },
  {
    name: "Clean Sheets",
    atributes: ["cs"],
    description: ["Clean Sheets"],
    icon: [""],
  },
  {
    name: "Escanteios cobrados",
    atributes: ["ck"],
    description: ["Escanteios cobrados"],
    icon: [""],
  },
  {
    name: "Idade média do elenco",
    atributes: ["age"],
    description: ["Idade média do elenco"],
    icon: [""],
  },
  {
    name: "Salário do elenco",
    atributes: ["ww"],
    description: ["Salário semanal do elenco"],
    icon: [""],
  },
];

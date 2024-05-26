import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import matchsDAO from "../dao/matchsDAO.js";
import championshipsDAO from "../dao/championshipsDAO.js";

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
          content: `Você é um especialista matemático e grande conhecedor de futebol. Irei te fornecer algumas informações sobre uma partida de futebol que vai ocorrer.  Essas informações seriam o nome de cada equipe, o local da partida e o mais importante o histórico de partidas de cada equipe. O histórico contém informações das últimas ${data.matchsCounter} partidas, cada partida terá informações como resultado, estatísticas, data e local da realização da partida. Também terão estatísticas do campeonato em que a partida será realizada.
          
          Seu trabalho será analisar essas informações, principalmente os resultados anteriores de cada equipe e fazer uma previsão do resultado da partida que irá acontecer. A sua resposta deverá  seguir o modelo abaixo de tabela:
          
          Time X x Time Y
          Probabilidade Time X vitória: 45% | Empate: 20% | Probabilidade Time Y vitória: 25%
          
          Agora irei te fornecer uma partida por vez, cada uma com suas informações e o histórico de cada partida. Faça sua análise de dados e me forneça apenas a tabela como resposta.
          `,
        },
        {
          role: "user",
          content: `Partida:
          
          """
          Hellas Verona x Inter de Milão, campeonato Campeonato Italiano - 2023/2024, local Stadio Marc'Antonio Bentegodi (Verona), data 26/05/2024.

          Histórico de partidas do Hellas Verona:
          Salernitana 1 x 2 Hellas Verona, campeonato Campeonato Italiano - 2023/2024, local Stadio Arechi (Salerno), data 20/05/2024. Posse de bola (%): 54% - 46%, Total de passes: 415 - 351, Passes corretos (%): 75% - 70%, Total de chutes: 9 - 17, Chutes no gol: 1 - 5.
          Hellas Verona 1 x 2 Torino, campeonato Campeonato Italiano - 2023/2024, local Stadio Marc'Antonio Bentegodi (Verona), data 12/05/2024. Posse de bola (%): 54% - 46%, Total de passes: 415 - 351, Passes corretos (%): 75% - 70%, Total de chutes: 9 - 17, Chutes no gol: 1 - 5, Posse de bola (%): 43% - 57%, Total de passes: 330 - 454, Passes corretos (%): 70% - 80%, Total de chutes: 13 - 6, Chutes no gol: 5 - 2.
          Hellas Verona 2 x 1 Fiorentina, campeonato Campeonato Italiano - 2023/2024, local Stadio Marc'Antonio Bentegodi (Verona), data 05/05/2024. Posse de bola (%): 54% - 46%, Total de passes: 415 - 351, Passes corretos (%): 75% - 70%, Total de chutes: 9 - 17, Chutes no gol: 1 - 5, Posse de bola (%): 43% - 57%, Total de passes: 330 - 454, Passes corretos (%): 70% - 80%, Total de chutes: 13 - 6, Chutes no gol: 5 - 2, Posse de bola (%): 38% - 62%, Total de passes: 275 - 464, Passes corretos (%): 65% - 72%, Total de chutes: 9 - 13, Chutes no gol: 4 - 4.
          Lazio 1 x 0 Hellas Verona, campeonato Campeonato Italiano - 2023/2024, local Stadio Olimpico (Romagnano Sesia), data 27/04/2024. Posse de bola (%): 54% - 46%, Total de passes: 415 - 351, Passes corretos (%): 75% - 70%, Total de chutes: 9 - 17, Chutes no gol: 1 - 5, Posse de bola (%): 43% - 57%, Total de passes: 330 - 454, Passes corretos (%): 70% - 80%, Total de chutes: 13 - 6, Chutes no gol: 5 - 2, Posse de bola (%): 38% - 62%, Total de passes: 275 - 464, Passes corretos (%): 65% - 72%, Total de chutes: 9 - 13, Chutes no gol: 4 - 4, Posse de bola (%): 69% - 31%, Total de passes: 532 - 232, Passes corretos (%): 84% - 62%, Total de chutes: 17 - 7, Chutes no gol: 5 - 1.
          Hellas Verona 1 x 0 Udinese, campeonato Campeonato Italiano - 2023/2024, local Stadio Marc'Antonio Bentegodi (Verona), data 20/04/2024. Posse de bola (%): 54% - 46%, Total de passes: 415 - 351, Passes corretos (%): 75% - 70%, Total de chutes: 9 - 17, Chutes no gol: 1 - 5, Posse de bola (%): 43% - 57%, Total de passes: 330 - 454, Passes corretos (%): 70% - 80%, Total de chutes: 13 - 6, Chutes no gol: 5 - 2, Posse de bola (%): 38% - 62%, Total de passes: 275 - 464, Passes corretos (%): 65% - 72%, Total de chutes: 9 - 13, Chutes no gol: 4 - 4, Posse de bola (%): 69% - 31%, Total de passes: 532 - 232, Passes corretos (%): 84% - 62%, Total de chutes: 17 - 7, Chutes no gol: 5 - 1, Posse de bola (%): 53% - 47%, Total de passes: 330 - 307, Passes corretos (%): 69% - 73%, Total de chutes: 16 - 18, Chutes no gol: 4 - 1.
          Atalanta 2 x 2 Hellas Verona, campeonato Campeonato Italiano - 2023/2024, local Gewiss Stadium (Bergamo), data 15/04/2024. Posse de bola (%): 54% - 46%, Total de passes: 415 - 351, Passes corretos (%): 75% - 70%, Total de chutes: 9 - 17, Chutes no gol: 1 - 5, Posse de bola (%): 43% - 57%, Total de passes: 330 - 454, Passes corretos (%): 70% - 80%, Total de chutes: 13 - 6, Chutes no gol: 5 - 2, Posse de bola (%): 38% - 62%, Total de passes: 275 - 464, Passes corretos (%): 65% - 72%, Total de chutes: 9 - 13, Chutes no gol: 4 - 4, Posse de bola (%): 69% - 31%, Total de passes: 532 - 232, Passes corretos (%): 84% - 62%, Total de chutes: 17 - 7, Chutes no gol: 5 - 1, Posse de bola (%): 53% - 47%, Total de passes: 330 - 307, Passes corretos (%): 69% - 73%, Total de chutes: 16 - 18, Chutes no gol: 4 - 1, Posse de bola (%): 59% - 41%, Total de passes: 501 - 340, Passes corretos (%): 77% - 67%, Total de chutes: 16 - 13, Chutes no gol: 9 - 5.
          
          Histórico de partidas do Inter de Milão:
          Inter de Milão 1 x 1 Lazio, campeonato Campeonato Italiano - 2023/2024, local Stadio Giuseppe Meazza (Milan), data 19/05/2024. Posse de bola (%): 58% - 0%, Total de passes: 576 - 216, Passes corretos (%): 90% - 162%, Total de chutes: 19 - 8, Chutes no gol: 7 - 4.
          Frosinone 0 x 5 Inter de Milão, campeonato Campeonato Italiano - 2023/2024, local Stadio Benito Stirpe (Frosinone), data 10/05/2024. Posse de bola (%): 58% - 0%, Total de passes: 576 - 216, Passes corretos (%): 90% - 162%, Total de chutes: 19 - 8, Chutes no gol: 7 - 4, Posse de bola (%): 41% - 59%, Total de passes: 400 - 575, Passes corretos (%): 84% - 89%, Total de chutes: 17 - 14, Chutes no gol: 8 - 5.
          Sassuolo 1 x 0 Inter de Milão, campeonato Campeonato Italiano - 2023/2024, local MAPEI Stadium - Città del Tricolore (Reggio Emilia), data 04/05/2024. Posse de bola (%): 58% - 0%, Total de passes: 576 - 216, Passes corretos (%): 90% - 162%, Total de chutes: 19 - 8, Chutes no gol: 7 - 4, Posse de bola (%): 41% - 59%, Total de passes: 400 - 575, Passes corretos (%): 84% - 89%, Total de chutes: 17 - 14, Chutes no gol: 8 - 5, Posse de bola (%): 24% - 76%, Total de passes: 230 - 720, Passes corretos (%): 70% - 91%, Total de chutes: 6 - 14, Chutes no gol: 2 - 2.
          Inter de Milão 2 x 0 Torino, campeonato Campeonato Italiano - 2023/2024, local Stadio Giuseppe Meazza (Milan), data 28/04/2024. Posse de bola (%): 58% - 0%, Total de passes: 576 - 216, Passes corretos (%): 90% - 162%, Total de chutes: 19 - 8, Chutes no gol: 7 - 4, Posse de bola (%): 41% - 59%, Total de passes: 400 - 575, Passes corretos (%): 84% - 89%, Total de chutes: 17 - 14, Chutes no gol: 8 - 5, Posse de bola (%): 24% - 76%, Total de passes: 230 - 720, Passes corretos (%): 70% - 91%, Total de chutes: 6 - 14, Chutes no gol: 2 - 2, Posse de bola (%): 62% - 38%, Total de passes: 675 - 396, Passes corretos (%): 91% - 87%, Total de chutes: 17 - 11, Chutes no gol: 5 - 3.
          Milan 1 x 2 Inter de Milão, campeonato Campeonato Italiano - 2023/2024, local Stadio Giuseppe Meazza (Milano), data 22/04/2024. Posse de bola (%): 58% - 0%, Total de passes: 576 - 216, Passes corretos (%): 90% - 162%, Total de chutes: 19 - 8, Chutes no gol: 7 - 4, Posse de bola (%): 41% - 59%, Total de passes: 400 - 575, Passes corretos (%): 84% - 89%, Total de chutes: 17 - 14, Chutes no gol: 8 - 5, Posse de bola (%): 24% - 76%, Total de passes: 230 - 720, Passes corretos (%): 70% - 91%, Total de chutes: 6 - 14, Chutes no gol: 2 - 2, Posse de bola (%): 62% - 38%, Total de passes: 675 - 396, Passes corretos (%): 91% - 87%, Total de chutes: 17 - 11, Chutes no gol: 5 - 3, Posse de bola (%): 52% - 48%, Total de passes: 510 - 478, Passes corretos (%): 87% - 85%, Total de chutes: 15 - 11, Chutes no gol: 6 - 3.
          Inter de Milão 2 x 2 Cagliari, campeonato Campeonato Italiano - 2023/2024, local Stadio Giuseppe Meazza (Milano), data 14/04/2024. Posse de bola (%): 58% - 0%, Total de passes: 576 - 216, Passes corretos (%): 90% - 162%, Total de chutes: 19 - 8, Chutes no gol: 7 - 4, Posse de bola (%): 41% - 59%, Total de passes: 400 - 575, Passes corretos (%): 84% - 89%, Total de chutes: 17 - 14, Chutes no gol: 8 - 5, Posse de bola (%): 24% - 76%, Total de passes: 230 - 720, Passes corretos (%): 70% - 91%, Total de chutes: 6 - 14, Chutes no gol: 2 - 2, Posse de bola (%): 62% - 38%, Total de passes: 675 - 396, Passes corretos (%): 91% - 87%, Total de chutes: 17 - 11, Chutes no gol: 5 - 3, Posse de bola (%): 52% - 48%, Total de passes: 510 - 478, Passes corretos (%): 87% - 85%, Total de chutes: 15 - 11, Chutes no gol: 6 - 3, Posse de bola (%): 63% - 37%, Total de passes: 617 - 368, Passes corretos (%): 92% - 86%, Total de chutes: 15 - 10, Chutes no gol: 7 - 6.

          Estatísticas do campeonato Campeonato Italiano - 2023/2024:

          Hellas Verona - Posição: 14°, Pontos: 37, Jogos: 37, Vitórias: 8, Empates: 13, Derrotas: 16, Gols marcados: 32, Gols sofridos: 54, Saldo de gols: -22, Gols esperados (xG): 42.6, Gols esperados contra (xGA): 51.9, Gols esperados diferença (xGD): -9.2, Chutes: 493, Chutes ao alvo: 147, Porcentagem de chutes ao alvo: 29.8%.
          Inter de Milão - Posição: 1°, Pontos: 93, Jogos: 37, Vitórias: 29, Empates: 6, Derrotas: 2, Gols marcados: 87, Gols sofridos: 20, Saldo de gols: +67, Gols esperados (xG): 75.9, Gols esperados contra (xGA): 29.4, Gols esperados diferença (xGD): +46.5, Chutes: 565, Chutes ao alvo: 186, Porcentagem de chutes ao alvo: 32.9%.
          """
          `,
        },
        {
          role: "assistant",
          content: `Hellas Verona x Inter de Milão\nProbabilidade Hellas Verona vitória: 15% | Empate: 20% | Probabilidade Inter de Milão vitória: 65%`,
        },
        {
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
        },
      ],
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
  let statisticsResume = [];

  matchs.forEach((match) => {
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
      language,
      shotsLearning,
      statisticsSelected,
      statisticsChampionshipSelected,
    } = body;

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
      language,
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
        language,
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

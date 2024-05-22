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
        match: match,
        matchPresentation,
        homeMatchsPresentation,
        awayMatchsPresentation,
        homeLastMatchs,
        awayLastMatchs,
        championship,
        championshipPresentation,
        prevision: response,
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

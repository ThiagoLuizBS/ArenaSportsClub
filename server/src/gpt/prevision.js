import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import matchsDAO from "../dao/matchsDAO.js";
import championshipsDAO from "../dao/championshipsDAO.js";
import previsionsDAO from "../dao/previsionsDAO.js";
import {
  promptMatch1,
  promptMatch1Medium,
  promptMatch2,
  promptMatch2Medium,
  promptMatch3,
  promptMatch3Medium,
  promptResponseMatch1,
  promptResponseMatch2,
  promptResponseMatch3,
} from "./prompts.js";

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
  
      Seu trabalho será analisar todas essas informações em conjunto, especialmente o histórico de jogos de cada equipe e fazer uma previsão do resultado da partida que irá acontecer. Sua resposta deve seguir o modelo de tabela abaixo:
  
      Time X x Time Y
      Probabilidade Time X vitória: 45% | Empate: 20% | Probabilidade Time Y vitória: 25%
      
      Agora irei te fornecer uma partida por vez, cada uma com suas informações e o histórico de partidas de cada equipe. Analise minuciosamente todas as informações disponibilizadas e após isso me forneça apenas a tabela como resposta.
      `,
  });

  if (data.shotsLearning > 0) {
    messages.push(
      data.statisticsType === "Por partida" ? promptMatch1 : promptMatch1Medium
    );

    messages.push(promptResponseMatch1);
  }

  if (data.shotsLearning > 1) {
    messages.push(
      data.statisticsType === "Por partida" ? promptMatch2 : promptMatch2Medium
    );

    messages.push(promptResponseMatch2);

    messages.push(
      data.statisticsType === "Por partida" ? promptMatch3 : promptMatch3Medium
    );

    messages.push(promptResponseMatch3);
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
      temperature: +data.temperature,
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

function getMatchPresentationMedium(matchSelected, side, matchs, statistics) {
  let matchResume = [];
  let statisticsResume = [];

  statistics.forEach((element, i) => {
    let valueAccumulatedHome = 0;
    let valueAccumulatedAway = 0;

    matchs.forEach((match) => {
      if (i === 0) {
        if (matchs.length > 1)
          matchResume.push(
            `${match.teams.homeName} ${match.scoreHome} x ${match.scoreAway} ${match.teams.awayName}, campeonato ${match.championship}, local ${match.stadium}, data ${match.day}.`
          );
        else
          matchResume.push(
            `${match.teams.homeName} x ${match.teams.awayName}, campeonato ${match.championship}, local ${match.stadium}, data ${match.day}.`
          );
      }

      let index = match.statistics.findIndex((item) => item.type === element);

      if (index !== -1) {
        if (side === "home") {
          if (matchSelected.teams.homeName === match.teams.homeName) {
            valueAccumulatedHome += +match.statistics[index].home;
            valueAccumulatedAway += +match.statistics[index].away;
          } else if (matchSelected.teams.homeName === match.teams.awayName) {
            valueAccumulatedHome += +match.statistics[index].away;
            valueAccumulatedAway += +match.statistics[index].home;
          }
        } else {
          if (matchSelected.teams.awayName === match.teams.homeName) {
            valueAccumulatedHome += +match.statistics[index].home;
            valueAccumulatedAway += +match.statistics[index].away;
          } else if (matchSelected.teams.awayName === match.teams.awayName) {
            valueAccumulatedHome += +match.statistics[index].away;
            valueAccumulatedAway += +match.statistics[index].home;
          }
        }
      }
    });

    statisticsResume.push(
      `${element}: ${(valueAccumulatedHome / matchs.length).toFixed(2)}${
        element.includes("%") ? "%" : ""
      } - ${(valueAccumulatedAway / matchs.length).toFixed(2)}${
        element.includes("%") ? "%" : ""
      }`
    );
  });

  const resumeMatch = `\n\nSegue a média das estatísticas das últimas partidas do ${
    side === "home"
      ? matchSelected.teams.homeName
      : matchSelected.teams.awayName
  } do lado esquerdo, do lado direito é a média das equipes adversárias: `;

  return `${matchResume.join("\n")} ${resumeMatch} ${statisticsResume.join(
    ", "
  )}.`;
}

function getChampionshipPresentation(
  championship,
  match,
  statisticsChampionshipSelected
) {
  let statisticsHomeResume = [];
  let statisticsAwayResume = [];

  if (statisticsChampionshipSelected.length < 1 || !!!championship.extraTable)
    return "";

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

export async function getPrevision(
  matchSelected,
  matchsCounter,
  historicType,
  statisticsType,
  temperature,
  model,
  shotsLearning,
  statisticsSelected,
  statisticsChampionshipSelected
) {
  shotsLearning =
    shotsLearning === "One-shot" ? 1 : shotsLearning === "Three-shots" ? 3 : 0;

  let match = await matchsDAO.getMatchByID(matchSelected);
  match = match[0];

  let homeLastMatchs =
    historicType === "Todas"
      ? await matchsDAO.getPastMatchsByTeamWithLimit(
          match.teams.homeId,
          match.date,
          matchsCounter
        )
      : await matchsDAO.getHomePastMatchsByTeamWithLimit(
          match.teams.homeId,
          match.date,
          matchsCounter
        );

  let awayLastMatchs =
    historicType === "Todas"
      ? await matchsDAO.getPastMatchsByTeamWithLimit(
          match.teams.awayId,
          match.date,
          matchsCounter
        )
      : await matchsDAO.getAwayPastMatchsByTeamWithLimit(
          match.teams.awayId,
          match.date,
          matchsCounter
        );

  let championship = await championshipsDAO.getChampionshipByChampionshipUrl(
    match.championshipUrl
  );
  championship = championship[0];

  const matchPresentation = getMatchPresentation([match], []);

  const homeMatchsPresentation =
    statisticsType === "Por partida"
      ? getMatchPresentation(homeLastMatchs, statisticsSelected)
      : getMatchPresentationMedium(
          match,
          "home",
          homeLastMatchs,
          statisticsSelected
        );

  const awayMatchsPresentation =
    statisticsType === "Por partida"
      ? getMatchPresentation(awayLastMatchs, statisticsSelected)
      : getMatchPresentationMedium(
          match,
          "away",
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
    temperature,
  });

  const data = {
    promptOptions: {
      matchSelected,
      matchsCounter,
      model,
      shotsLearning,
      statisticsSelected,
      statisticsChampionshipSelected,
      historicType,
      statisticsType,
    },
    response: {
      prevision: response.choices[0].message.content,
      created: new Date(response.created * 1000),
      promptTokens: response.usage.prompt_tokens,
      responseTokens: response.usage.completion_tokens,
    },
  };

  previsionsDAO.addPrevision(data);

  return {
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
      historicType,
      statisticsType,
      temperature,
    },
    response: {
      prevision: response.choices[0].message.content,
      created: new Date(response.created * 1000),
      promptTokens: response.usage.prompt_tokens,
      responseTokens: response.usage.completion_tokens,
    },
  };
}

export async function getPrevisionResponse(req, res, next) {
  try {
    let body = req.body;
    let {
      matchSelected,
      matchsCounter,
      historicType,
      statisticsType,
      temperature,
      model,
      shotsLearning,
      statisticsSelected,
      statisticsChampionshipSelected,
    } = body;

    const response = await getPrevision(
      matchSelected,
      matchsCounter,
      historicType,
      statisticsType,
      temperature,
      model,
      shotsLearning,
      statisticsSelected,
      statisticsChampionshipSelected
    );

    res.status(200).json(response);

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

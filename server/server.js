import express from "express";
import cors from "cors";
import football from "./src/api/football.route.js";
import matchsCrawler from "./src/crawler/matchs.js";
import championshipsCrawler from "./src/crawler/championships.js";
import teamsCrawler from "./src/crawler/teams.js";
import newsCrawler from "./src/crawler/news.js";
import matchsController from "./src/api/matchs.controller.js";
import newsController from "./src/api/news.controller.js";
import championshipsController from "./src/api/championships.controller.js";
import teamsController from "./src/api/teams.controller.js";
import championshipsExtraDataCrawler from "./src/crawler/championshipsExtraData.js";
import nextMatchsCrawler from "./src/crawler/nextMatchs.js";
import { getPrevision } from "./src/gpt/prevision.js";
import { arrayMatchsId } from "./src/gpt/matchs.js";
import fs from "fs";

const app = express();

function dataHorarioAtual() {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapMatchs() {
  console.log("matchs - started", dataHorarioAtual());
  const clear = await matchsCrawler.clearMatchs();
  console.log("matchs - renewed", dataHorarioAtual());
  setTimeout(async () => {
    const post = await matchsController.apiPostMatch();
    console.log("matchs -", post, dataHorarioAtual());
  }, 60000);
}

async function scrapNextMatchs() {
  console.log("next matchs - started", dataHorarioAtual());
  const nextMatchs = championshipsCrawler.getNextMatchs();
  const clear = await nextMatchsCrawler.clearMatchs(nextMatchs);
  console.log("next matchs - renewed", dataHorarioAtual());
  setTimeout(async () => {
    const post = await matchsController.apiPostNextMatch();
    console.log("next matchs -", post, dataHorarioAtual());
  }, 60000);
}

async function scrapChampionships() {
  console.log("championships - started", dataHorarioAtual());
  const championships = await matchsController.apiGetAllChampionships();
  const champs = await championshipsCrawler.getUrls(championships);
  const clear = await championshipsCrawler.clearChampionships();
  console.log("championships - renewed", dataHorarioAtual());
  setTimeout(async () => {
    const post = await championshipsController.apiPostChampionships();
    console.log("championships -", post, dataHorarioAtual());
  }, 60000);
}

async function scrapExtraDataChampionships() {
  console.log("championships extra data - started", dataHorarioAtual());
  // const championships =
  //   await matchsController.apiGetAllExtraDataChampionships();
  // const champs = await championshipsExtraDataCrawler.getUrls(championships);
  const clear = await championshipsExtraDataCrawler.clearChampionships();
  console.log("championships extra data - renewed", dataHorarioAtual());
  setTimeout(async () => {
    const post = await championshipsController.apiPostChampionshipsExtraData();
    console.log("championships extra data -", post, dataHorarioAtual());
  }, 60000);
}

async function scrapTeamsHome() {
  console.log("teams home - started", dataHorarioAtual());
  const teams = await matchsController.apiGetAllTeamsHome();
  const urls = await teamsCrawler.getUrls(teams);
  const clear = await teamsCrawler.clearTeams();
  console.log("teams home - renewed", dataHorarioAtual());
  setTimeout(async () => {
    const post = await teamsController.apiPostTeams();
    console.log("teams home -", post, dataHorarioAtual());
  }, 60000);
}

async function scrapTeamsAway() {
  console.log("teams away - started", dataHorarioAtual());
  const teams = await matchsController.apiGetAllTeamsAway();
  const urls = await teamsCrawler.getUrls(teams);
  const clear = await teamsCrawler.clearTeams();
  console.log("teams away - renewed", dataHorarioAtual());
  setTimeout(async () => {
    const post = await teamsController.apiPostTeams();
    console.log("teams away -", post, dataHorarioAtual());
  }, 60000);
}

async function scrapNews() {
  console.log("news - started", dataHorarioAtual());
  const clear = await newsCrawler.clearNews();
  console.log("news - renewed", dataHorarioAtual());
  setTimeout(async () => {
    const post = await newsController.apiPostNews();
    console.log("news -", post, dataHorarioAtual());
  }, 60000);
}

async function updateTeams() {
  const result = await matchsController.updateAllTeams();
  console.log(result);
}

async function loopPrevision(idMatch) {
  await sleep(4000);
  const response = await getPrevision(
    idMatch,
    6,
    "Apenas mandante ou visitante",
    "Por partida",
    "1",
    "gpt-4o",
    "One-shot",
    [
      "Posse de bola (%)",
      "Total de passes",
      "Passes corretos (%)",
      "Total de chutes",
      "Chutes no gol",
      "Escanteios",
      "Faltas cometidas",
    ],
    []
  );
  console.log(
    idMatch,
    "+",
    response.response.prevision,
    "+",
    response.response.promptTokens,
    "+",
    response.response.responseTokens
  );

  return {
    idMatch: idMatch,
    prevision: response.response.prevision,
    promptTokens: response.response.promptTokens,
    responseTokens: response.response.responseTokens,
  };
}

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/api/v1/football", football);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

// setTimeout(async () => {
//   const allSimulated = [];
//   for (let i = 0; i < arrayMatchsId.length; i++) {
//     const response = await loopPrevision(arrayMatchsId[i]);
//     allSimulated.push(response);
//   }

//   const jsonData = JSON.stringify(allSimulated, null, 2);

//   fs.writeFile("data11.json", jsonData, (err) => {
//     if (err) {
//       console.error("Erro ao salvar o arquivo:", err);
//     } else {
//       console.log("Arquivo salvo com sucesso!");
//     }
//   });
// }, 5000);

setTimeout(() => {
  scrapMatchs();
  setInterval(scrapMatchs, process.env.CRAWLERINTERVALSHORT);
}, 600000);

setTimeout(() => {
  scrapChampionships();
  setInterval(scrapChampionships, process.env.CRAWLERINTERVAL);
}, 900000);

setTimeout(() => {
  scrapNews();
  setInterval(scrapNews, process.env.CRAWLERINTERVAL);
}, 1200000);

setTimeout(() => {
  scrapTeamsHome();
  setInterval(scrapTeamsHome, process.env.CRAWLERINTERVALLONG);
}, 1800000);

setTimeout(() => {
  scrapTeamsAway();
  setInterval(scrapTeamsAway, process.env.CRAWLERINTERVALLONG);
}, 3600000);

setTimeout(() => {
  scrapExtraDataChampionships();
  setInterval(scrapExtraDataChampionships, process.env.CRAWLERINTERVALDAY);
}, 5400000);

setTimeout(() => {
  scrapNextMatchs();
  setInterval(scrapNextMatchs, process.env.CRAWLERINTERVALDAY);
}, 9000000);

// setTimeout(() => {
//   updateTeams();
// }, 3000);

/* --------------------- Atualizar partidas de ontem para CANCELADO caso não tenha resultado final --------------------------- */
// setTimeout(async () => {
//   const updateYesterday = await matchsController.apiUpdateYesterdayMatchs();
//   console.log(updateYesterday);
// }, 1000);

/* --------------------- API testes --------------------------- */
// app.get("/test", (req, res) => {
//   res.json({ championships });
// });

export default app;

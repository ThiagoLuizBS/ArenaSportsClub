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

async function scrapMatchs() {
  console.log("Started matchs", dataHorarioAtual());
  const clear = await matchsCrawler.clearMatchs();
  console.log("cleared matchs", dataHorarioAtual());
  setTimeout(async () => {
    const post = await matchsController.apiPostMatch();
    console.log(post, dataHorarioAtual());
  }, 60000);
}

async function scrapChampionships() {
  console.log("Started championships", dataHorarioAtual());
  const championships = await matchsController.apiGetAllChampionships();
  const champs = await championshipsCrawler.getUrls(championships);
  const clear = await championshipsCrawler.clearChampionships();
  console.log("cleared and get url championships", dataHorarioAtual());
  setTimeout(async () => {
    const post = await championshipsController.apiPostChampionships();
    console.log(post, dataHorarioAtual());
  }, 60000);
}

async function scrapTeams() {
  console.log("Started teams", dataHorarioAtual());
  const teams = await matchsController.apiGetAllTeams();
  const urls = await teamsCrawler.getUrls(teams);
  const clear = await teamsCrawler.clearTeams();
  console.log("cleared and get url teams", dataHorarioAtual());
  setTimeout(async () => {
    const post = await teamsController.apiPostTeams();
    console.log(post, dataHorarioAtual());
  }, 60000);
}

async function scrapNews() {
  console.log("Started news", dataHorarioAtual());
  const clear = await newsCrawler.clearNews();
  console.log("cleared news", dataHorarioAtual());
  setTimeout(async () => {
    const post = await newsController.apiPostNews();
    console.log(post, dataHorarioAtual());
  }, 60000);
}

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/api/v1/football", football);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

setTimeout(() => {
  scrapMatchs();
  setInterval(scrapMatchs, 1800000);
}, 600000);

setTimeout(() => {
  scrapTeams();
  setInterval(scrapTeams, 1800000);
}, 1200000);

setTimeout(() => {
  scrapChampionships();
  setInterval(scrapChampionships, 1800000);
}, 1800000);

setTimeout(() => {
  scrapNews();
  setInterval(scrapNews, 1800000);
}, 900000);

/* --------------------- Atualizar partidas de ontem para CANCELADO caso não tenha resultado final --------------------------- */
// setTimeout(async () => {
//   const updateYesterday = await matchsController.apiUpdateYesterdayMatchs();
//   console.log(updateYesterday);
// }, 18000);

/* --------------------- API testes --------------------------- */
// app.get("/test", (req, res) => {
//   res.json({ championships });
// });

export default app;

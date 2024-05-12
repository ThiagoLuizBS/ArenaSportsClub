import request from "request";
import { load } from "cheerio";

const urlGoal = "/images/goal.png";
const urlOwnGoal = "/images/own-goal.png";
const urlYC = "/images/yellowcard.png";
const urlRC = "/images/redcard.png";
const urlYR = "/images/yellowred.png";
const urlSubIn = "fas fa-long-arrow-alt-up substitution-in";
const urlSubOut = "fas fa-long-arrow-alt-down substitution-out";
const imgDefault =
  "https://www.placardefutebol.com.br/images/escudo-de-futebol.png";

const matchs = [];
const events = [];
const statistics = [];
const lineupHomeS = [];
const lineupAwayS = [];
const lineupHomeB = [];
const lineupAwayB = [];

export default class nextMatchsCrawler {
  static async clearMatchs(nextMatchs) {
    try {
      console.log("next matchs - clear", matchs.length);
      matchs.splice(0, Infinity);
      const matchsUpdated = await this.getMatchs(nextMatchs);
      return;
    } catch (error) {
      console.error(`Unable to clear next matchs: ${error}`);
      return { error: error };
    }
  }

  static async getMatchs(nextMatchs) {
    if (matchs.length != 0) {
      console.log("next matchs - get", matchs.length);
      return matchs;
    } else {
      console.log("next matchs - scrap");
      events.splice(0, Infinity);
      statistics.splice(0, Infinity);
      lineupHomeS.splice(0, Infinity);
      lineupAwayS.splice(0, Infinity);
      lineupHomeB.splice(0, Infinity);
      lineupAwayB.splice(0, Infinity);

      nextMatchs.forEach((urlMatch) => {
        request(urlMatch, function (err, res, body) {
          if (err) console.log("Error: " + err);
          var $ = load(body);

          let count = 0;

          $("div.container.main-content").each(async function (index, e) {
            var teamHome = $(this)
              .find(
                "#livescore > div:nth-child(1) > div:nth-child(1) > div > div.row.match-card-second-row.justify-content-md-center > div:nth-child(1) > a > h4"
              )
              .text()
              .trim();
            var teamAway = $(this)
              .find(
                "#livescore > div:nth-child(1) > div:nth-child(1) > div > div.row.match-card-second-row.justify-content-md-center > div:nth-child(3) > a > h4"
              )
              .text()
              .trim();
            var scoreHome = "";
            var scoreAway = "";
            var time = $(this)
              .find(
                "#livescore > div > div.row.align-items-center.content > div > div.row.match-card-first-row.justify-content-md-center > div.col-lg-2.col-4.text-center.match-scoreboard > span.badge.badge-success.status-name"
              )
              .text()
              .trim();

            var status = time;
            if (
              time !== "ENCERRADO" &&
              time !== "SUSPENSO" &&
              time !== "ONTEM" &&
              !time.includes("AMANHÃ") &&
              !time.includes("HOJE")
            ) {
              status = "AO VIVO";
            } else if (time.includes("AMANHÃ") || time.includes("HOJE")) {
              status = "A REALIZAR";
            }

            var championshipUrl = $(this)
              .find(
                "#livescore > div:nth-child(1) > div:nth-child(1) > div > a"
              )
              .attr("href");
            var championship = $(this)
              .find(
                "#livescore > div:nth-child(1) > div:nth-child(1) > div > a > h2"
              )
              .text()
              .trim();
            var turn = $(this)
              .find(
                "#livescore > div:nth-child(1) > div:nth-child(1) > div > p"
              )
              .text()
              .trim();
            var teamHomeImg = $(this)
              .find(
                "#livescore > div:nth-child(1) > div:nth-child(1) > div > div.row.match-card-first-row.justify-content-md-center > div:nth-child(1) > img"
              )
              .attr("src");
            var teamAwayImg = $(this)
              .find(
                "#livescore > div:nth-child(1) > div:nth-child(1) > div > div.row.match-card-first-row.justify-content-md-center > div:nth-child(3) > img"
              )
              .attr("src");
            var teamHomeHref = $(this)
              .find(
                "#livescore > div:nth-child(1) > div:nth-child(1) > div > div.row.match-card-second-row.justify-content-md-center > div:nth-child(1) > a"
              )
              .attr("href");

            var teamAwayHref = $(this)
              .find(
                "#livescore > div:nth-child(1) > div:nth-child(1) > div > div.row.match-card-second-row.justify-content-md-center > div:nth-child(3) > a"
              )
              .attr("href");

            var dateTime = $(this)
              .find(
                "#livescore > div:nth-child(1) > div.match-details > p:nth-child(1)"
              )
              .text()
              .trim();

            dateTime = dateTime.split("às");
            var dateMatch = dateTime[0]?.trim();
            var schedule = dateTime[1]?.trim();

            let splitter = dateMatch.split("/");
            let year = parseInt(splitter[2]?.trim());
            let month = parseInt(splitter[1]?.trim()) - 1;
            let day = parseInt(splitter[0]?.trim());
            const date = new Date(year, month, day);

            if (
              $(this)
                .find(
                  "#livescore > div:nth-child(1) > div.match-details > p:nth-child(2) > img"
                )
                .attr("title") === "Árbitro da partida"
            ) {
              var referee = $(this)
                .find(
                  "#livescore > div:nth-child(1) > div.match-details > p:nth-child(2)"
                )
                .text()
                .trim();
            } else var referee = "";

            if (
              $(this)
                .find(
                  "#livescore > div:nth-child(1) > div.match-details > p:nth-child(2) > img"
                )
                .attr("title") === "Local da partida"
            ) {
              var stadium = $(this)
                .find(
                  "#livescore > div:nth-child(1) > div.match-details > p:nth-child(2)"
                )
                .text()
                .trim();
            } else if (
              $(this)
                .find(
                  "#livescore > div:nth-child(1) > div.match-details > p:nth-child(3) > img"
                )
                .attr("title") === "Local da partida"
            ) {
              var stadium = $(this)
                .find(
                  "#livescore > div:nth-child(1) > div.match-details > p:nth-child(3)"
                )
                .text()
                .trim();
            } else var stadium = "";

            $(this)
              .find(".row.align-items-center.content")
              .each(function () {
                if (
                  $(this).find(".event-line.text-right").text().trim() !== ""
                ) {
                  var side = "home";
                  var description = $(this)
                    .find(".event-line.text-right")
                    .text()
                    .trim();
                  var time = $(this)
                    .find(".match-card-events-space")
                    .text()
                    .trim();
                  if (
                    $(this).find(".event-line.text-right img").attr("src") ===
                    urlYC
                  ) {
                    var type = "YC";
                  } else if (
                    $(this).find(".event-line.text-right img").attr("src") ===
                    urlRC
                  ) {
                    var type = "RC";
                  } else if (
                    $(this).find(".event-line.text-right img").attr("src") ===
                    urlYR
                  ) {
                    var type = "YR";
                  } else if (
                    $(this).find(".event-line.text-right img").attr("src") ===
                    urlGoal
                  ) {
                    var type = "GOAL";
                  } else if (
                    $(this).find(".event-line.text-right img").attr("src") ===
                    urlOwnGoal
                  ) {
                    var type = "OG";
                  } else if (
                    $(this)
                      .find(".event-line.text-right")
                      .text()
                      .trim()
                      .includes("gol anulado")
                  ) {
                    var type = "GA";
                  } else var type = "";
                } else if (
                  $(this).find(".event-line.text-left").text().trim() !== ""
                ) {
                  var side = "away";
                  var description = $(this)
                    .find(".event-line.text-left")
                    .text()
                    .trim();
                  var time = $(this)
                    .find(".match-card-events-space")
                    .text()
                    .trim();
                  if (
                    $(this).find(".event-line.text-left img").attr("src") ===
                    urlYC
                  ) {
                    var type = "YC";
                  } else if (
                    $(this).find(".event-line.text-left img").attr("src") ===
                    urlRC
                  ) {
                    var type = "RC";
                  } else if (
                    $(this).find(".event-line.text-left img").attr("src") ===
                    urlYR
                  ) {
                    var type = "YR";
                  } else if (
                    $(this).find(".event-line.text-left img").attr("src") ===
                    urlGoal
                  ) {
                    var type = "GOAL";
                  } else if (
                    $(this).find(".event-line.text-left img").attr("src") ===
                    urlOwnGoal
                  ) {
                    var type = "OG";
                  } else if (
                    $(this)
                      .find(".event-line.text-left")
                      .text()
                      .trim()
                      .includes("gol anulado")
                  ) {
                    var type = "GA";
                  } else var type = "";
                }

                if (side !== "" && side) {
                  events.push({
                    idx: urlMatch,
                    side: side,
                    description: description,
                    time: time,
                    type: type,
                  });
                }
              });

            $(this)
              .find("#livescore > div:nth-child(3) > table > tbody > tr")
              .each(function () {
                var type = $(this)
                  .find("td.standing-table.text-center.stats-category")
                  .text()
                  .trim();
                var home = $(this)
                  .find("td.standing-table.text-center.stats-home-team small")
                  .text()
                  .trim();
                var away = $(this)
                  .find("td.standing-table.text-center.stats-away-team small")
                  .text()
                  .trim();

                if (type !== "" && type) {
                  statistics.push({
                    idx: urlMatch,
                    type: type,
                    home: home,
                    away: away,
                  });
                }
              });

            $(this)
              .find(
                "#livescore > div:nth-child(6) > table:nth-child(2) > tbody > tr > td:nth-child(1) > span"
              )
              .each(function () {
                var num = $(this).find("small").text().trim();
                var number = num.split(".");
                num = number[0] + ".";
                var name = $(this).text().trim();
                name = name.slice(name.indexOf(".") + 1);

                if ($(this).find("i").attr("class") === urlSubIn) {
                  var substitution = "in";
                } else if ($(this).find("i").attr("class") === urlSubOut) {
                  var substitution = "out";
                } else var substitution = "";

                if ($(this).find("img").attr("src") === urlYC) {
                  var card = "YC";
                } else if ($(this).find("img").attr("src") === urlRC) {
                  var card = "RC";
                } else if ($(this).find("img").attr("src") === urlYR) {
                  var card = "YR";
                } else var card = "";

                var goals = [];

                if ($(this).find("img").attr("src") === urlGoal) {
                  $(this)
                    .find("img")
                    .each(function (i, e) {
                      if ($(this).attr("src") === urlGoal) {
                        goals.push("GOAL");
                      }
                    });
                }

                if ($(this).find("img").attr("src") === urlOwnGoal) {
                  $(this)
                    .find("img")
                    .each(function (i, e) {
                      if ($(this).attr("src") === urlOwnGoal) {
                        goals.push("OG");
                      }
                    });
                }

                if (name !== "" && name) {
                  lineupHomeS.push({
                    idx: urlMatch,
                    num: num,
                    name: name,
                    actions: {
                      substitution: substitution,
                      card: card,
                      goals: goals,
                    },
                  });
                }
              });

            $(this)
              .find(
                "#livescore > div:nth-child(6) > table:nth-child(2) > tbody > tr > td:nth-child(2) > span"
              )
              .each(function () {
                var num = $(this).find("small").text().trim();
                var number = num.split(".");
                num = number[0] + ".";
                var name = $(this).text().trim();
                var name = name.slice(name.indexOf(".") + 1);

                if ($(this).find("i").attr("class") === urlSubIn) {
                  var substitution = "in";
                } else if ($(this).find("i").attr("class") === urlSubOut) {
                  var substitution = "out";
                } else var substitution = "";

                if ($(this).find("img").attr("src") === urlYC) {
                  var card = "YC";
                } else if ($(this).find("img").attr("src") === urlRC) {
                  var card = "RC";
                } else if ($(this).find("img").attr("src") === urlYR) {
                  var card = "YR";
                } else var card = "";

                var goals = [];

                if ($(this).find("img").attr("src") === urlGoal) {
                  $(this)
                    .find("img")
                    .each(function (i, e) {
                      if ($(this).attr("src") === urlGoal) {
                        goals.push("GOAL");
                      }
                    });
                }

                if ($(this).find("img").attr("src") === urlOwnGoal) {
                  $(this)
                    .find("img")
                    .each(function (i, e) {
                      if ($(this).attr("src") === urlOwnGoal) {
                        goals.push("OG");
                      }
                    });
                }

                if (name !== "" && name) {
                  lineupAwayS.push({
                    idx: urlMatch,
                    num: num,
                    name: name,
                    actions: {
                      substitution: substitution,
                      card: card,
                      goals: goals,
                    },
                  });
                }
              });

            $(this)
              .find(
                "#livescore > div:nth-child(6) > table:nth-child(4) > tbody > tr > td:nth-child(1) > span"
              )
              .each(function () {
                var num = $(this).find("small").text().trim();
                var number = num.split(".");
                num = number[0] + ".";
                var name = $(this).text().trim();
                var name = name.slice(name.indexOf(".") + 1);

                if ($(this).find("i").attr("class") === urlSubIn) {
                  var substitution = "in";
                } else if ($(this).find("i").attr("class") === urlSubOut) {
                  var substitution = "out";
                } else var substitution = "";

                if ($(this).find("img").attr("src") === urlYC) {
                  var card = "YC";
                } else if ($(this).find("img").attr("src") === urlRC) {
                  var card = "RC";
                } else if ($(this).find("img").attr("src") === urlYR) {
                  var card = "YR";
                } else var card = "";

                var goals = [];

                if ($(this).find("img").attr("src") === urlGoal) {
                  $(this)
                    .find("img")
                    .each(function (i, e) {
                      if ($(this).attr("src") === urlGoal) {
                        goals.push("GOAL");
                      }
                    });
                }

                if ($(this).find("img").attr("src") === urlOwnGoal) {
                  $(this)
                    .find("img")
                    .each(function (i, e) {
                      if ($(this).attr("src") === urlOwnGoal) {
                        goals.push("OG");
                      }
                    });
                }

                if (name !== "" && name) {
                  lineupHomeB.push({
                    idx: urlMatch,
                    num: num,
                    name: name,
                    actions: {
                      substitution: substitution,
                      card: card,
                      goals: goals,
                    },
                  });
                }
              });

            $(this)
              .find(
                "#livescore > div:nth-child(6) > table:nth-child(4) > tbody > tr > td:nth-child(2) > span"
              )
              .each(function () {
                var num = $(this).find("small").text().trim();
                var number = num.split(".");
                num = number[0] + ".";
                var name = $(this).text().trim();
                var name = name.slice(name.indexOf(".") + 1);

                if ($(this).find("i").attr("class") === urlSubIn) {
                  var substitution = "in";
                } else if ($(this).find("i").attr("class") === urlSubOut) {
                  var substitution = "out";
                } else var substitution = "";

                if ($(this).find("img").attr("src") === urlYC) {
                  var card = "YC";
                } else if ($(this).find("img").attr("src") === urlRC) {
                  var card = "RC";
                } else if ($(this).find("img").attr("src") === urlYR) {
                  var card = "YR";
                } else var card = "";

                var goals = [];

                if ($(this).find("img").attr("src") === urlGoal) {
                  $(this)
                    .find("img")
                    .each(function (i, e) {
                      if ($(this).attr("src") === urlGoal) {
                        goals.push("GOAL");
                      }
                    });
                }

                if ($(this).find("img").attr("src") === urlOwnGoal) {
                  $(this)
                    .find("img")
                    .each(function (i, e) {
                      if ($(this).attr("src") === urlOwnGoal) {
                        goals.push("OG");
                      }
                    });
                }

                if (name !== "" && name) {
                  lineupAwayB.push({
                    idx: urlMatch,
                    num: num,
                    name: name,
                    actions: {
                      substitution: substitution,
                      card: card,
                      goals: goals,
                    },
                  });
                }
              });

            var eventsAux = [];
            events.forEach((element) => {
              if (element.idx === urlMatch)
                eventsAux.push({
                  side: element.side,
                  description: element.description,
                  time: element.time,
                  type: element.type,
                });
            });

            var statisticsAux = [];
            statistics.forEach((element) => {
              if (element.idx === urlMatch)
                statisticsAux.push({
                  type: element.type,
                  home: element.home,
                  away: element.away,
                });
            });

            var lineupHomeSAux = [];
            lineupHomeS.forEach((element) => {
              if (element.idx === urlMatch)
                lineupHomeSAux.push({
                  num: element.num,
                  name: element.name,
                  actions: {
                    substitution: element.actions.substitution,
                    card: element.actions.card,
                    goals: element.actions.goals,
                  },
                });
            });

            var lineupAwaySAux = [];
            lineupAwayS.forEach((element) => {
              if (element.idx === urlMatch)
                lineupAwaySAux.push({
                  num: element.num,
                  name: element.name,
                  actions: {
                    substitution: element.actions.substitution,
                    card: element.actions.card,
                    goals: element.actions.goals,
                  },
                });
            });

            var lineupHomeBAux = [];
            lineupHomeB.forEach((element) => {
              if (element.idx === urlMatch)
                lineupHomeBAux.push({
                  num: element.num,
                  name: element.name,
                  actions: {
                    substitution: element.actions.substitution,
                    card: element.actions.card,
                    goals: element.actions.goals,
                  },
                });
            });

            var lineupAwayBAux = [];
            lineupAwayB.forEach((element) => {
              if (element.idx === urlMatch)
                lineupAwayBAux.push({
                  num: element.num,
                  name: element.name,
                  actions: {
                    substitution: element.actions.substitution,
                    card: element.actions.card,
                    goals: element.actions.goals,
                  },
                });
            });

            var idTitle = teamHome + " x " + teamAway + " - " + dateMatch;
            var idMatch = "";

            if (teamHomeImg !== imgDefault && teamAwayImg !== imgDefault) {
              count++;
              matchs.push({
                idMatch: idMatch,
                idTitle: idTitle,
                idChampionship: "",
                championship: championship,
                championshipUrl: championshipUrl,
                turn: turn,
                status: status,
                date: date,
                time: time,
                day: dateMatch,
                schedule: schedule,
                referee: referee,
                stadium: stadium,
                scoreHome: scoreHome,
                scoreAway: scoreAway,
                teams: {
                  homeId: "",
                  homeName: teamHome,
                  homeImg: teamHomeImg,
                  teamHomeHref: teamHomeHref,
                  awayId: "",
                  awayName: teamAway,
                  awayImg: teamAwayImg,
                  teamAwayHref: teamAwayHref,
                },
                events: eventsAux,
                statistics: statisticsAux,
                lineups: {
                  homeStarting: lineupHomeSAux,
                  awayStarting: lineupAwaySAux,
                  homeBench: lineupHomeBAux,
                  awayBench: lineupAwayBAux,
                },
              });
            }
          });
        });
      });
      return matchs;
    }
  }
}

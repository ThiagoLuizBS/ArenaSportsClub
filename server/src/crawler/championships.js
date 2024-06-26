import request from "request";
import { load } from "cheerio";

const urls = [];

const nextMatchs = [];
const championships = [];
const table = [];
const statistics = [];

export default class championshipsCrawler {
  static async clearChampionships() {
    try {
      console.log("championships - clear ", championships.length);
      championships.splice(0, Infinity);
      const championshipsUpdated = await this.getChampionships();
      return;
    } catch (error) {
      console.error(`Unable to clear championships: ${error}`);
      return { error: error };
    }
  }

  static getNextMatchs() {
    return nextMatchs;
  }

  static async getUrls(allUrls) {
    try {
      urls.splice(0, Infinity);
      allUrls.forEach((element) => {
        urls.push(element);
      });
      console.log("championships - urls", urls.length);
      return;
    } catch (error) {
      console.error(`Unable to get urls championships: ${error}`);
      return { error: error };
    }
  }

  static async getChampionships() {
    if (championships.length != 0) {
      console.log("championships - get", championships.length);
      return championships;
    } else {
      console.log("championships - scrap ");
      nextMatchs.splice(0, Infinity);
      table.splice(0, Infinity);
      statistics.splice(0, Infinity);
      urls.forEach((url) => {
        request(url, function (err, res, body) {
          if (err) console.log("Error: " + err);
          var $ = load(body);

          var name = "";
          var img = "";
          $("body > section > div.content__title").each(function (i, e) {
            name = $(this).find("h1").text().trim();
            img = $(this).find("img").attr("src");
          });

          $("#standings").each(function (i, e) {
            var phase = $(this).find("p.standings__stage-name").text().trim();
            var length = 0;
            $(this)
              .find(".tableV2")
              .each(function (i, e) {
                length++;
              });
            $(this)
              .find(".tableV2")
              .each(function (id, e) {
                var tr = [];
                var group = "";
                if (length > 1) {
                  group = "Grupo " + id;

                  group = group.replace("0", "A");
                  group = group.replace("1", "B");
                  group = group.replace("2", "C");
                  group = group.replace("3", "D");
                  group = group.replace("4", "E");
                  group = group.replace("5", "F");
                  group = group.replace("6", "G");
                  group = group.replace("7", "H");
                  group = group.replace("8", "I");
                  group = group.replace("9", "J");
                  group = group.replace("10", "K");
                  group = group.replace("11", "L");
                }
                $(this)
                  .find("div.divTableBody > div.divTableRow")
                  .each(function (idx, e) {
                    var num = $(this).find("div:nth-child(1)").text().trim();
                    var team = $(this)
                      .find("div:nth-child(2) > a")
                      .text()
                      .trim();
                    var points = $(this).find("div:nth-child(3)").text().trim();
                    var games = $(this).find("div:nth-child(4)").text().trim();
                    var victorys = $(this)
                      .find("div:nth-child(5)")
                      .text()
                      .trim();
                    var draws = $(this).find("div:nth-child(6)").text().trim();
                    var loses = $(this).find("div:nth-child(7)").text().trim();
                    var goaldiference = $(this)
                      .find("div:nth-child(8)")
                      .text()
                      .trim();

                    if (num != "" && num) {
                      tr.push({
                        num: num,
                        team: team,
                        points: points,
                        games: games,
                        victorys: victorys,
                        draws: draws,
                        loses: loses,
                        goaldiference: goaldiference,
                      });
                    }
                  });

                if (name != "" && name) {
                  table.push({
                    url: url,
                    name: name,
                    phase,
                    group,
                    table: tr,
                  });
                }
              });
          });

          $("#topscorers > div.tableV2").each(function (i, e) {
            var name = "";
            if (i === 0) name = "Artilheiros";
            else name = "Assistências";

            var tr = [];
            $(this)
              .find("div.divTableBody > div.divTableRow")
              .each(function (idx, e) {
                var num = $(this).find("div:nth-child(1)").text().trim();
                var player = $(this).find("div:nth-child(2)").text().trim();
                var team = $(this).find("div:nth-child(3) > a").text().trim();
                var value = $(this).find("div:nth-child(4)").text().trim();

                if (num != "" && num) {
                  tr.push({
                    num,
                    player,
                    team,
                    value,
                  });
                }
              });

            if (name != "" && name) {
              statistics.push({
                url: url,
                name: name,
                table: tr,
              });
            }
          });

          $("#next_matches > div > a").each(function (i, e) {
            var urlMatch = $(this).attr("href");
            nextMatchs.push(urlMatch);
          });

          var tableAux = [];
          table.forEach((element) => {
            if (element.url === url)
              tableAux.push({
                phase: element.phase,
                group: element.group,
                table: element.table,
              });
          });

          var statisticsAux = [];
          statistics.forEach((element) => {
            if (element.url === url)
              statisticsAux.push({
                name: element.name,
                table: element.table,
              });
          });

          championships.push({
            idChampionship: "",
            url,
            name,
            img,
            imgChampionship: "",
            table: tableAux,
            statistics: statisticsAux,
          });
        });
      });
      return championships;
    }
  }
}

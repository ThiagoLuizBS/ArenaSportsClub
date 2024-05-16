import request from "request";
import { load } from "cheerio";

const urls = [];
const championships = [];

export default class championshipsExtraDataCrawler {
  static async clearChampionships() {
    try {
      console.log("championships extra data - clear ", championships.length);
      championships.splice(0, Infinity);
      const championshipsUpdated = await this.getChampionships();
      return;
    } catch (error) {
      console.error(`Unable to clear championships extra data: ${error}`);
      return { error: error };
    }
  }

  static async getUrls(allUrls) {
    try {
      urls.splice(0, Infinity);
      allUrls.forEach((element) => {
        urls.push(element);
      });
      console.log("championships extra data - urls", urls.length);
      return;
    } catch (error) {
      console.error(`Unable to get urls championships extra data: ${error}`);
      return { error: error };
    }
  }

  static async getChampionships() {
    if (championships.length != 0) {
      console.log("championships extra data - get", championships.length);
      return championships;
    } else {
      console.log("championships extra data - scrap ");
      urls.forEach((url) => {
        request(url, function (err, res, body) {
          if (err) console.log("Error: " + err);
          var $ = load(body);

          var name = "";
          var img = "";
          var names = [];
          var tr = [];

          $("table.stats_table").each(function (i, e) {
            name = $(this).find("caption").text().trim().split("202")[0].trim();

            if (!names.some((item) => item === name)) {
              names.push(name);
              $(this)
                .find("tbody > tr")
                .each(function (i, e) {
                  if (name === "Regular season Table") {
                    var num = $(this).find("th").text().trim();
                    var team = $(this)
                      .find("td:nth-child(2) > a")
                      .text()
                      .trim();
                    var mp = $(this).find("td:nth-child(3)").text().trim();
                    var w = $(this).find("td:nth-child(4)").text().trim();
                    var d = $(this).find("td:nth-child(5)").text().trim();
                    var l = $(this).find("td:nth-child(6)").text().trim();
                    var gf = $(this).find("td:nth-child(7)").text().trim();
                    var ga = $(this).find("td:nth-child(8)").text().trim();
                    var gd = $(this).find("td:nth-child(9)").text().trim();
                    var pts = $(this).find("td:nth-child(10)").text().trim();
                    var ptsmp = $(this).find("td:nth-child(11)").text().trim();
                    var xg = $(this).find("td:nth-child(12)").text().trim();
                    var xga = $(this).find("td:nth-child(13)").text().trim();
                    var xgd = $(this).find("td:nth-child(14)").text().trim();
                    var attendance = $(this)
                      .find("td:nth-child(17)")
                      .text()
                      .trim();
                    var notes = $(this).find("td:nth-child(20)").text().trim();

                    if (num != "" && num) {
                      tr.push({
                        num,
                        team,
                        mp,
                        w,
                        d,
                        l,
                        gf,
                        ga,
                        gd,
                        pts,
                        ptsmp,
                        xg,
                        xga,
                        xgd,
                        attendance,
                        notes,
                      });
                    }
                  } else if (name === "Squad Standard Stats") {
                    var team = $(this).find("th > a").text().trim();
                    var npl = $(this).find("td:nth-child(2)").text().trim();
                    var age = $(this).find("td:nth-child(3)").text().trim();
                    var poss = $(this).find("td:nth-child(4)").text().trim();
                    var crdy = $(this).find("td:nth-child(15)").text().trim();
                    var crdr = $(this).find("td:nth-child(16)").text().trim();
                    var prgc = $(this).find("td:nth-child(21)").text().trim();
                    var prgp = $(this).find("td:nth-child(22)").text().trim();

                    if (team != "" && team) {
                      tr = tr.map((item) => {
                        if (item.team === team) {
                          item.npl = npl;
                          item.age = age;
                          item.poss = poss;
                          item.crdy = crdy;
                          item.crdr = crdr;
                          item.prgc = prgc;
                          item.prgp = prgp;
                        }
                        return item;
                      });
                    }
                  } else if (name === "Squad Shooting") {
                    var team = $(this).find("th > a").text().trim();
                    var sh = $(this).find("td:nth-child(5)").text().trim();
                    var sot = $(this).find("td:nth-child(6)").text().trim();
                    var sotp = $(this).find("td:nth-child(7)").text().trim();
                    var gsh = $(this).find("td:nth-child(10)").text().trim();
                    var gsot = $(this).find("td:nth-child(11)").text().trim();

                    if (team != "" && team) {
                      tr = tr.map((item) => {
                        if (item.team === team) {
                          item.sh = sh;
                          item.sot = sot;
                          item.sotp = sotp;
                          item.gsh = gsh;
                          item.gsot = gsot;
                        }
                        return item;
                      });
                    }
                  } else if (name === "Squad Passing") {
                    var team = $(this).find("th > a").text().trim();
                    var cmp = $(this).find("td:nth-child(4)").text().trim();
                    var cmpp = $(this).find("td:nth-child(6)").text().trim();

                    if (team != "" && team) {
                      tr = tr.map((item) => {
                        if (item.team === team) {
                          item.cmp = cmp;
                          item.cmpp = cmpp;
                        }
                        return item;
                      });
                    }
                  } else if (name === "Squad Goalkeeping") {
                    var team = $(this).find("th > a").text().trim();
                    var cs = $(this).find("td:nth-child(15)").text().trim();

                    if (team != "" && team) {
                      tr = tr.map((item) => {
                        if (item.team === team) {
                          item.cs = cs;
                        }
                        return item;
                      });
                    }
                  } else if (name === "Squad Miscellaneous Stats") {
                    var team = $(this).find("th > a").text().trim();
                    var fls = $(this).find("td:nth-child(7)").text().trim();

                    if (team != "" && team) {
                      tr = tr.map((item) => {
                        if (item.team === team) {
                          item.fls = fls;
                        }
                        return item;
                      });
                    }
                  } else if (name === "Squad Pass Types") {
                    var team = $(this).find("th > a").text().trim();
                    var ck = $(this).find("td:nth-child(12)").text().trim();

                    if (team != "" && team) {
                      tr = tr.map((item) => {
                        if (item.team === team) {
                          item.ck = ck;
                        }
                        return item;
                      });
                    }
                  }
                });
            }
          });

          let urlSplit = url.split("/");
          urlSplit =
            urlSplit[0] +
            "/" +
            urlSplit[1] +
            "/" +
            urlSplit[2] +
            "/" +
            urlSplit[3] +
            "/" +
            urlSplit[4] +
            "/" +
            urlSplit[5] +
            "/wages/" +
            urlSplit[6].split("Stats")[0] +
            "Wages";

          request(urlSplit, function (err, res, body) {
            if (err) console.log("Error: " + err);
            var $ = load(body);

            $("#squad_wages > tbody > tr").each(function (i, e) {
              var team = $(this).find("td.left > a").text().trim();
              var wpl = $(this).find("td:nth-child(3)").text().trim();
              var ww = $(this).find("td:nth-child(4) > strong").text().trim();

              if (team != "" && team) {
                tr = tr.map((item) => {
                  if (item.team === team) {
                    item.wpl = wpl;
                    item.ww = ww;
                  }
                  return item;
                });
              }
            });

            championships.push({
              url,
              table: tr,
            });
          });
        });
      });
      return championships;
    }
  }
}

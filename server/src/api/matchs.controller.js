import matchsCrawler from "../crawler/matchs.js";
import championshipsDAO from "../dao/championshipsDAO.js";
import teamsDAO from "../dao/teamsDAO.js";
import matchsDAO from "../dao/matchsDAO.js";
import nextMatchsCrawler from "../crawler/nextMatchs.js";

export default class matchsController {
  static async apiPostMatch() {
    try {
      const matchs = await matchsCrawler.getMatchs();
      let matchTitle;
      let maxId;
      let championshipId = "";
      let teamHomeId = "";
      let teamAwayId = "";

      for (let index = 0; index < matchs.length; index++) {
        matchTitle = await matchsDAO.getMatchByTitle(matchs[index].idTitle);
        if (matchTitle === 0) {
          maxId = await matchsDAO.getMatchMaxID();
          championshipId =
            await championshipsDAO.getChampionshipByChampionshipUrl(
              matchs[index].championshipUrl
            );
          championshipId = championshipId[0]?.idChampionship;
          if (championshipId === undefined) championshipId = "";
          maxId = parseInt(maxId) + 1;
          const MatchResponse = await matchsDAO.addMatch(
            matchs[index],
            maxId.toString(),
            championshipId
          );

          var { error } = MatchResponse;
          if (error) {
            return { error };
          }
        } else if (matchs[index]?.idTitle !== undefined) {
          if (
            matchs[index].idChampionship !== "" &&
            matchs[index].idChampionship !== null
          ) {
            championshipId = matchs[index].idChampionship;
          } else {
            championshipId =
              await championshipsDAO.getChampionshipByChampionshipUrl(
                matchs[index].championshipUrl
              );
            championshipId = championshipId[0]?.idChampionship;
            if (championshipId === undefined) championshipId = "";
          }
          teamHomeId = await teamsDAO.getTeamByTeamUrl(
            matchs[index].teams.teamHomeHref
          );
          teamHomeId = teamHomeId[0]?.idTeam;
          if (teamHomeId === undefined) teamHomeId = "";
          teamAwayId = await teamsDAO.getTeamByTeamUrl(
            matchs[index].teams.teamAwayHref
          );
          teamAwayId = teamAwayId[0]?.idTeam;
          if (teamAwayId === undefined) teamAwayId = "";

          const MatchResponse = await matchsDAO.updateMatch(
            matchs[index],
            championshipId,
            teamHomeId,
            teamAwayId
          );

          var { error } = MatchResponse;
          if (error) {
            return { error };
          }
        }
      }
      return { status: "success matchs" };
    } catch (error) {
      return { errorapiPostMatch: error.message };
    }
  }

  static async updateAllTeams() {
    try {
      let matchs = await matchsDAO.getMatchs();
      let teamHomeId = "";
      let teamAwayId = "";

      for (let match of matchs) {
        teamHomeId = await teamsDAO.getTeamByTeamUrl(match.teams.teamHomeHref);
        teamHomeId = teamHomeId[0]?.idTeam;
        if (teamHomeId === undefined) teamHomeId = "";
        teamAwayId = await teamsDAO.getTeamByTeamUrl(match.teams.teamAwayHref);
        teamAwayId = teamAwayId[0]?.idTeam;
        if (teamAwayId === undefined) teamAwayId = "";

        const response = await matchsDAO.updateTeamsId(
          match.idMatch,
          teamHomeId,
          teamAwayId
        );

        console.log(match.idMatch);

        var { error } = response;
        if (error) {
          return { error };
        }
      }

      return { status: "success update" };
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiPostNextMatch() {
    try {
      const matchs = await nextMatchsCrawler.getMatchs();
      let matchTitle;
      let maxId;
      let championshipId = "";
      let teamHomeId = "";
      let teamAwayId = "";

      for (let index = 0; index < matchs.length; index++) {
        matchTitle = await matchsDAO.getMatchByTitle(matchs[index].idTitle);

        if (matchTitle === 0) {
          maxId = await matchsDAO.getMatchMaxID();
          championshipId =
            await championshipsDAO.getChampionshipByChampionshipUrl(
              matchs[index].championshipUrl
            );
          championshipId = championshipId[0]?.idChampionship;
          if (championshipId === undefined) championshipId = "";
          maxId = parseInt(maxId) + 1;
          const MatchResponse = await matchsDAO.addMatch(
            matchs[index],
            maxId.toString(),
            championshipId
          );

          var { error } = MatchResponse;
          if (error) {
            return { error };
          }
        } else if (matchs[index]?.idTitle !== undefined) {
          if (
            matchs[index].idChampionship !== "" &&
            matchs[index].idChampionship !== null
          ) {
            championshipId = matchs[index].idChampionship;
          } else {
            championshipId =
              await championshipsDAO.getChampionshipByChampionshipUrl(
                matchs[index].championshipUrl
              );
            championshipId = championshipId[0]?.idChampionship;
            if (championshipId === undefined) championshipId = "";
          }
          teamHomeId = await teamsDAO.getTeamByTeamUrl(
            matchs[index].teams.teamHomeHref
          );
          teamHomeId = teamHomeId[0]?.idTeam;
          if (teamHomeId === undefined) teamHomeId = "";
          teamAwayId = await teamsDAO.getTeamByTeamUrl(
            matchs[index].teams.teamAwayHref
          );
          teamAwayId = teamAwayId[0]?.idTeam;
          if (teamAwayId === undefined) teamAwayId = "";

          const MatchResponse = await matchsDAO.updateMatch(
            matchs[index],
            championshipId,
            teamHomeId,
            teamAwayId
          );

          var { error } = MatchResponse;
          if (error) {
            return { error };
          }
        }
      }
      return { status: "success matchs" };
    } catch (error) {
      return { errorapiPostMatch: error.message };
    }
  }

  static async apiGetMatchById(req, res, next) {
    try {
      let id = req.params.id || {};
      let match = await matchsDAO.getMatchByID(id);
      if (!match) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(match);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetMatchsByDate(req, res, next) {
    try {
      let date = req.params.date || {};
      let favorites = req.params.favorites || {};
      let favoritesFilter = favorites.split("-");
      let splitter = date.split("-");
      const dateFilter =
        splitter[0]?.trim() +
        "/" +
        splitter[1]?.trim() +
        "/" +
        splitter[2]?.trim();
      let match = await matchsDAO.getMatchsByDate(dateFilter, favoritesFilter);

      if (!match) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(match);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetFutureMatchsByChampionship(req, res, next) {
    try {
      let id = req.params.id || {};
      let today = new Date();
      let day = today.getDate();
      let month = today.getMonth();
      let year = today.getFullYear();
      let date = new Date(year, month, day);
      let matchs = await matchsDAO.getFutureMatchsByChampionship(id, date);
      if (!matchs) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(matchs);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetPastMatchsByChampionship(req, res, next) {
    try {
      let id = req.params.id || {};
      let today = new Date();
      let day = today.getDate();
      let month = today.getMonth();
      let year = today.getFullYear();
      let date = new Date(year, month, day);
      let matchs = await matchsDAO.getPastMatchsByChampionship(id, date);
      if (!matchs) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(matchs);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetFutureMatchsByTeam(req, res, next) {
    try {
      let id = req.params.id || {};
      let today = new Date();
      let day = today.getDate();
      let month = today.getMonth();
      let year = today.getFullYear();
      let date = new Date(year, month, day);
      let matchs = await matchsDAO.getFutureMatchsByTeam(id, date);
      if (!matchs) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(matchs);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetPastMatchsByTeam(req, res, next) {
    try {
      let id = req.params.id || {};
      let today = new Date();
      let day = today.getDate();
      let month = today.getMonth();
      let year = today.getFullYear();
      let date = new Date(year, month, day);
      let matchs = await matchsDAO.getPastMatchsByTeam(id, date);
      if (!matchs) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(matchs);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ errorapiGetPastMatchsByTeam: e });
    }
  }

  static async apiUpdateYesterdayMatchs() {
    try {
      const matchs = await matchsDAO.getMatchs();
      let today = new Date();
      let day = today.getDate();
      let month = today.getMonth();
      let year = today.getFullYear();
      let date = new Date(year, month, day);
      for (let index = 0; index < matchs.length; index++) {
        const MatchResponse = await matchsDAO.updateYesterday(
          matchs[index],
          date
        );
        var { error } = MatchResponse;
        if (error) {
          return { error };
        }
      }
      return { status: "success yesterday" };
    } catch (error) {
      return { error: error.message };
    }
  }

  // static async apiGetAllMatchs(req, res, next) {
  //   try {
  //     const matchs = await matchsDAO.getMatchs();
  //     let today = new Date();
  //     let day = today.getDate();
  //     let month = today.getMonth();
  //     let year = today.getFullYear();
  //     let date = new Date(year, month, day);
  //     for (let index = 0; index < matchs.length; index++) {
  //       const MatchResponse = await matchsDAO.update(matchs[index], date);
  //       var { error } = MatchResponse;
  //       if (error) {
  //         return { error };
  //       }
  //     }

  //     res.json(matchs.length);
  //   } catch (e) {
  //     console.log(`api, ${e}`);
  //     res.status(500).json({ error: e });
  //   }
  // }

  static async apiGetAllChampionships(req, res, next) {
    try {
      const championships = await matchsDAO.getAllChampionships();
      var { error } = championships;
      if (error) {
        return { error };
      }
      let array = [];
      championships.forEach((element) => {
        if (
          element._id.championshipUrl !== "" &&
          element._id.championshipUrl !== null
        )
          array.push(element._id.championshipUrl);
      });
      return array;
    } catch (e) {
      console.log(`api, ${e}`);
      return { errorapiGetAllChampionships: e.message };
    }
  }

  static async apiGetAllExtraDataChampionships(req, res, next) {
    try {
      const championships =
        await championshipsDAO.getAllExtraDataChampionships();
      var { error } = championships;
      if (error) {
        return { error };
      }
      let array = [];
      championships.forEach((element) => {
        if (element._id.fbref !== "" && element._id.fbref !== null)
          array.push(element._id.fbref);
      });
      return array;
    } catch (e) {
      console.log(`api, ${e}`);
      return { errorapiGetAllChampionships: e.message };
    }
  }

  // static async apiDelete(req, res, next) {
  //   try {
  //     const result = await matchsDAO.getDelete();
  //     res.json(result);
  //   } catch (e) {
  //     console.log(`api, ${e}`);
  //     res.status(500).json({ error: e });
  //   }
  // }

  static async apiGetAllTeamsHome(req, res, next) {
    try {
      const teams = await matchsDAO.getAllHomeTeams();
      var { error } = teams;
      if (error) {
        return { error };
      }
      let array = [];
      teams.forEach((element) => {
        if (element._id.teamHref !== "" && element._id.teamHref !== null)
          array.push(element._id.teamHref);
      });
      return array;
    } catch (e) {
      console.log(`api, ${e}`);
      return { error: e.message };
    }
  }

  static async apiGetAllTeamsAway(req, res, next) {
    try {
      const teams = await matchsDAO.getAllAwayTeams();
      var { error } = teams;
      if (error) {
        return { error };
      }
      let array = [];
      teams.forEach((element) => {
        if (element._id.teamHref !== "" && element._id.teamHref !== null)
          array.push(element._id.teamHref);
      });
      return array;
    } catch (e) {
      console.log(`api, ${e}`);
      return { error: e.message };
    }
  }

  // static async apiGetAllHref(req, res, next) {
  //   try {
  //     const teams = await teamsDAO.getAllTeams();

  //     for (let index = 0; index < teams.length; index++) {
  //       console.log(teams[index].name + " " + teams[index].idTeam);
  //       const MatchResponse = await matchsDAO.updateTeamsId(
  //         teams[index].name,
  //         teams[index].idTeam
  //       );
  //       const MatchResponse2 = await matchsDAO.updateTeamsId2(
  //         teams[index].name,
  //         teams[index].idTeam
  //       );
  //       var { error } = MatchResponse;
  //       if (error) {
  //         return { error };
  //       }
  //     }

  //     res.json(teams.length);
  //   } catch (e) {
  //     console.log(`api, ${e}`);
  //     res.status(500).json({ error: e });
  //   }
  // }
}

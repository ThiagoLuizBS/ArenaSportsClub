import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;
let matchs;

export default class matchsDAO {
  static async injectDB(conn) {
    if (matchs) {
      return;
    }
    try {
      matchs = await conn.db(process.env.RESTREVIEWS_NS).collection("matchs");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in matchsDAO: ${e}`
      );
    }
  }

  static async getMatchMaxID() {
    let maxId;
    try {
      const pipeline = [
        {
          $addFields: {
            numericIdMatch: { $toInt: "$idMatch" }, // Converte idMatch de string para inteiro
          },
        },
        {
          $sort: {
            numericIdMatch: -1,
          },
        },
        { $limit: 1 },
      ];
      maxId = await matchs.aggregate(pipeline).toArray();
      const idMaxMatch = maxId[0].idMatch;
      return await idMaxMatch;
    } catch (e) {
      console.error(`Something went wrong in getMatchMaxID: ${e}`);
      throw e;
    }
  }

  static async addMatch(match, id, idChampionship) {
    try {
      const matchDoc = {
        idMatch: id,
        idTitle: match.idTitle,
        idChampionship: idChampionship,
        championshipUrl: match.championshipUrl,
        championship: match.championship,
        turn: match.turn,
        status: match.status,
        time: match.time,
        day: match.day,
        date: match.date,
        schedule: match.schedule,
        referee: match.referee,
        stadium: match.stadium,
        scoreHome: match.scoreHome,
        scoreAway: match.scoreAway,
        teams: match.teams,
        events: match.events,
        statistics: match.statistics,
        lineups: match.lineups,
      };

      return await matchs.insertOne(matchDoc);
    } catch (e) {
      console.error(`Unable to post match: ${e}`);
      return { error: e };
    }
  }

  static async updateMatch(match, idChampionship, homeId, awayId) {
    try {
      const updateResponse = await matchs.updateOne(
        { idTitle: match.idTitle },
        {
          $set: {
            idChampionship: idChampionship,
            status: match.status,
            time: match.time,
            day: match.day,
            date: match.date,
            schedule: match.schedule,
            scoreHome: match.scoreHome,
            scoreAway: match.scoreAway,
            teams: {
              homeId: homeId,
              homeName: match.teams.homeName,
              homeImg: match.teams.homeImg,
              teamHomeHref: match.teams.teamHomeHref,
              awayId: awayId,
              awayName: match.teams.awayName,
              awayImg: match.teams.awayImg,
              teamAwayHref: match.teams.teamAwayHref,
            },
            events: match.events,
            statistics: match.statistics,
            lineups: match.lineups,
          },
        }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update match: ${e}`);
      return { error: e };
    }
  }

  static async getMatchByID(id) {
    try {
      const pipeline = [
        {
          $match: { idMatch: id },
        },
      ];
      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getMatchByID: ${e}`);
      throw e;
    }
  }

  static async getMatchByTitle(title) {
    try {
      const pipeline = [
        {
          $match: { idTitle: title },
        },
      ];
      let founded = await matchs.aggregate(pipeline).toArray();
      return await founded.length;
    } catch (e) {
      console.error(`Something went wrong in getMatchByTitle: ${e}`);
      throw e;
    }
  }

  static async getMatchsByDate(date, favorites) {
    try {
      const pipeline = [
        {
          $match: {
            day: date,
            status: { $ne: "CANCELADO" },
          },
        },
        {
          $sort: {
            schedule: 1,
            idTitle: 1,
          },
        },
        {
          $lookup: {
            from: "championships",
            let: {
              id: "$idChampionship",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$idChampionship", "$$id"],
                  },
                },
              },
              {
                $set: {
                  priority: {
                    $switch: {
                      branches: [
                        { case: { $in: ["$$id", favorites] }, then: 3 },
                      ],
                      default: "$priority",
                    },
                  },
                },
              },
            ],
            as: "championshipObj",
          },
        },
        {
          $addFields: {
            championshipObj: { $arrayElemAt: ["$championshipObj", 0] },
          },
        },
        {
          $group: {
            _id: {
              championship: "$championship",
              idChampionship: "$idChampionship",
              priority: "$championshipObj.priority",
            },
            matchs: {
              $addToSet: {
                championshipObj: "$championshipObj",
                idChampionship: "$idChampionship",
                idMatch: "$idMatch",
                status: "$status",
                time: "$time",
                schedule: "$schedule",
                scoreHome: "$scoreHome",
                scoreAway: "$scoreAway",
                teams: "$teams",
                events: "$events",
              },
            },
          },
        },
        { $unwind: "$matchs" },
        { $sort: { "matchs.schedule": 1, "matchs.idMatch": 1 } },
        {
          // this $group stage is needed, because we did
          // $unwind before
          $group: {
            _id: "$_id",
            matchs: {
              $push: "$matchs",
            },
          },
        },
        {
          $sort: {
            "matchs.favoritePriority": -1,
            "_id.priority": -1,
            "_id.championship": 1,
          },
        },
      ];
      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getMatchsByDate: ${e}`);
      throw e;
    }
  }

  static async getPastMatchsByChampionship(id, today) {
    try {
      const pipeline = [
        {
          $match: {
            idChampionship: id,
            status: { $eq: "ENCERRADO" },
          },
        },
        {
          $sort: {
            schedule: 1,
            idTitle: 1,
          },
        },
        {
          $lookup: {
            from: "championships",
            let: {
              id: "$idChampionship",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$idChampionship", "$$id"],
                  },
                },
              },
            ],
            as: "championshipObj",
          },
        },
        {
          $addFields: {
            championshipObj: "$championshipObj",
          },
        },
        {
          $group: {
            _id: {
              day: "$day",
            },
            matchs: {
              $addToSet: {
                date: "$date",
                idMatch: "$idMatch",
                status: "$status",
                time: "$time",
                schedule: "$schedule",
                scoreHome: "$scoreHome",
                scoreAway: "$scoreAway",
                teams: "$teams",
                events: "$events",
              },
            },
          },
        },
        { $unwind: "$matchs" },
        { $sort: { "matchs.schedule": 1, "matchs.idMatch": 1 } },
        {
          // this $group stage is needed, because we did
          // $unwind before
          $group: {
            _id: "$_id",
            matchs: {
              $push: "$matchs",
            },
          },
        },
        {
          $sort: {
            "matchs.date": -1,
          },
        },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getMatchsByChampionship: ${e}`);
      throw e;
    }
  }

  static async getFutureMatchsByChampionship(id, today) {
    try {
      const pipeline = [
        {
          $match: {
            idChampionship: id,
            date: { $gte: today },
            status: { $ne: "ENCERRADO" },
          },
        },
        {
          $sort: {
            schedule: 1,
            idTitle: 1,
          },
        },
        {
          $lookup: {
            from: "championships",
            let: {
              id: "$idChampionship",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$idChampionship", "$$id"],
                  },
                },
              },
            ],
            as: "championshipObj",
          },
        },
        {
          $addFields: {
            championshipObj: "$championshipObj",
          },
        },
        {
          $group: {
            _id: {
              day: "$day",
            },
            matchs: {
              $addToSet: {
                idMatch: "$idMatch",
                status: "$status",
                time: "$time",
                schedule: "$schedule",
                scoreHome: "$scoreHome",
                scoreAway: "$scoreAway",
                teams: "$teams",
                events: "$events",
              },
            },
          },
        },
        { $unwind: "$matchs" },
        { $sort: { "matchs.schedule": 1, "matchs.idMatch": 1 } },
        {
          // this $group stage is needed, because we did
          // $unwind before
          $group: {
            _id: "$_id",
            matchs: {
              $push: "$matchs",
            },
          },
        },
        {
          $sort: {
            "_id.day": 1,
          },
        },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getMatchsByChampionship: ${e}`);
      throw e;
    }
  }

  static async getPastMatchsByTeam(id, today) {
    try {
      const pipeline = [
        {
          $match: {
            $or: [{ "teams.homeId": id }, { "teams.awayId": id }],
            status: { $eq: "ENCERRADO" },
          },
        },
        {
          $sort: {
            schedule: 1,
            idTitle: 1,
          },
        },
        {
          $lookup: {
            from: "championships",
            let: {
              id: "$idChampionship",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$idChampionship", "$$id"],
                  },
                },
              },
            ],
            as: "championshipObj",
          },
        },
        {
          $addFields: {
            championshipObj: "$championshipObj",
          },
        },
        {
          $group: {
            _id: {
              day: "$day",
            },
            matchs: {
              $addToSet: {
                date: "$date",
                idMatch: "$idMatch",
                status: "$status",
                time: "$time",
                schedule: "$schedule",
                scoreHome: "$scoreHome",
                scoreAway: "$scoreAway",
                teams: "$teams",
                events: "$events",
              },
            },
          },
        },
        { $unwind: "$matchs" },
        { $sort: { "matchs.schedule": 1, "matchs.idMatch": 1 } },
        {
          // this $group stage is needed, because we did
          // $unwind before
          $group: {
            _id: "$_id",
            matchs: {
              $push: "$matchs",
            },
          },
        },
        {
          $sort: {
            "matchs.date": -1,
          },
        },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getPastMatchsByTeam: ${e}`);
      throw e;
    }
  }

  static async getFutureMatchsByTeam(id, today) {
    try {
      const pipeline = [
        {
          $match: {
            $or: [{ "teams.homeId": id }, { "teams.awayId": id }],
            date: { $gte: today },
            status: { $ne: "ENCERRADO" },
          },
        },
        {
          $sort: {
            schedule: 1,
            idTitle: 1,
          },
        },
        {
          $lookup: {
            from: "championships",
            let: {
              id: "$idChampionship",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$idChampionship", "$$id"],
                  },
                },
              },
            ],
            as: "championshipObj",
          },
        },
        {
          $addFields: {
            championshipObj: "$championshipObj",
          },
        },
        {
          $group: {
            _id: {
              day: "$day",
            },
            matchs: {
              $addToSet: {
                idMatch: "$idMatch",
                status: "$status",
                time: "$time",
                schedule: "$schedule",
                scoreHome: "$scoreHome",
                scoreAway: "$scoreAway",
                teams: "$teams",
                events: "$events",
              },
            },
          },
        },
        { $unwind: "$matchs" },
        { $sort: { "matchs.schedule": 1, "matchs.idMatch": 1 } },
        {
          // this $group stage is needed, because we did
          // $unwind before
          $group: {
            _id: "$_id",
            matchs: {
              $push: "$matchs",
            },
          },
        },
        {
          $sort: {
            "_id.day": 1,
          },
        },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getFutureMatchsByTeam: ${e}`);
      throw e;
    }
  }

  static async getMatchs() {
    try {
      const pipeline = [
        {
          $match: {},
        },
      ];
      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getMatchs: ${e}`);
      throw e;
    }
  }

  static async getPastMatchsByTeamWithLimit(id, date, limitCount) {
    try {
      const pipeline = [
        {
          $match: {
            $or: [{ "teams.homeId": id }, { "teams.awayId": id }],
            date: { $lt: date },
            status: { $eq: "ENCERRADO" },
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        { $limit: limitCount },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(
        `Something went wrong in getPastMatchsByTeamWithLimit: ${e}`
      );
      throw e;
    }
  }

  static async getHomePastMatchsByTeamWithLimit(id, date, limitCount) {
    try {
      const pipeline = [
        {
          $match: {
            $or: [{ "teams.homeId": id }],
            date: { $lt: date },
            status: { $eq: "ENCERRADO" },
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        { $limit: limitCount },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(
        `Something went wrong in getHomePastMatchsByTeamWithLimit: ${e}`
      );
      throw e;
    }
  }

  static async getAwayPastMatchsByTeamWithLimit(id, date, limitCount) {
    try {
      const pipeline = [
        {
          $match: {
            $or: [{ "teams.awayId": id }],
            date: { $lt: date },
            status: { $eq: "ENCERRADO" },
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        { $limit: limitCount },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(
        `Something went wrong in getAwayPastMatchsByTeamWithLimit: ${e}`
      );
      throw e;
    }
  }

  static async updateYesterday(match, dateToday) {
    try {
      if (match?.date < dateToday && match?.status !== "ENCERRADO") {
        const updateResponse = await matchs.updateOne(
          { idMatch: match.idMatch },
          {
            $set: {
              status: "CANCELADO",
            },
          }
        );
        return updateResponse;
      }
      return true;
    } catch (e) {
      console.error(`Something went wrong in getMatchsByDate: ${e}`);
      throw e;
    }
  }

  static async getAllChampionships() {
    try {
      const pipeline = [
        {
          $group: {
            _id: {
              championshipUrl: "$championshipUrl",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getAllChampionships: ${e}`);
      throw e;
    }
  }

  static async getAllHomeTeams() {
    var data = new Date();
    data.setDate(data.getDate());
    try {
      const pipeline = [
        {
          $match: {
            date: {
              $gte: data,
            },
          },
        },
        {
          $group: {
            _id: {
              teamHref: "$teams.teamHomeHref",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getAllHomeTeams: ${e}`);
      throw e;
    }
  }

  static async getAllAwayTeams() {
    var data = new Date();
    data.setDate(data.getDate());
    try {
      const pipeline = [
        {
          $match: {
            date: {
              $gte: data,
            },
          },
        },
        {
          $group: {
            _id: {
              teamHref: "$teams.teamAwayHref",
            },
            count: { $count: {} },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ];

      return await matchs.aggregate(pipeline).toArray();
    } catch (e) {
      console.error(`Something went wrong in getAllAwayTeams: ${e}`);
      throw e;
    }
  }

  // static async getDeletetest() {
  //   try {
  //     return await matchs.deleteMany({
  //       name: /Últimos jogos/i,
  //     });
  //   } catch (e) {
  //     console.error(`Unable to delete news: ${e}`);
  //     return { error: e };
  //   }
  // }

  // static async updateTeamsId(match, idHome, idAway) {
  //   try {
  //     const updateResponse = await matchs.updateMany(
  //       { idMatch: match },
  //       {
  //         $set: {
  //           "teams.homeId": idHome,
  //           "teams.awayId": idAway,
  //         },
  //       }
  //     );
  //     return updateResponse;
  //   } catch (e) {
  //     console.error(`Something went wrong in updateTeamsId: ${e}`);
  //     throw e;
  //   }
  // }

  // static async updateTeams() {
  //   try {
  //     const updateResponse = await matchs.updateMany(
  //       {}, // Filtro para selecionar todos os documentos
  //       [
  //         {
  //           $set: {
  //             "teams.teamHomeHref": {
  //               $arrayElemAt: [{ $split: ["$teams.teamHomeHref", ".html"] }, 0],
  //             },
  //             "teams.teamAwayHref": {
  //               $arrayElemAt: [{ $split: ["$teams.teamAwayHref", ".html"] }, 0],
  //             },
  //           },
  //         },
  //       ]
  //     );
  //     return updateResponse;
  //   } catch (e) {
  //     console.error(`Something went wrong in updateTeamsId2: ${e}`);
  //     throw e;
  //   }
  // }
}

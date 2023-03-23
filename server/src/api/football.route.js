import express, { response } from "express";
import matchsCtrl from "./matchs.controller.js";
import teamsCtrl from "./teams.controller.js";
import championshipsCtrl from "./championships.controller.js";
import newsCtrl from "./news.controller.js";

const router = express.Router();

router.route("/teams").get(teamsCtrl.apiGetTeams);
router
  .route("/championships/priority")
  .get(championshipsCtrl.apiGetChampionshipPriority);

router.route("/matchs/id/:id").get(matchsCtrl.apiGetMatchById);
router.route("/matchs/date/:date").get(matchsCtrl.apiGetMatchsByDate);
router
  .route("/matchs/championship/:id")
  .get(matchsCtrl.apiGetMatchsByChampionship);
router
  .route("/championship/id/:id")
  .get(championshipsCtrl.apiGetChampionshipById);

// router.route("/matchs").get(matchsCtrl.apiPostMatch);
// router.route("/championships").get(championshipsCtrl.apiPostChampionships);
// router.route("/news").get(newsCtrl.apiGetAllNews);

export default router;

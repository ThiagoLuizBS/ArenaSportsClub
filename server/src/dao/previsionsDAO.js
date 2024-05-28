import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;
let previsions;

export default class previsionsDAO {
  static async injectDB(conn) {
    if (previsions) {
      return;
    }
    try {
      previsions = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("previsions");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in previsionsDAO: ${e}`
      );
    }
  }

  static async addPrevision(data) {
    try {
      const previsionDoc = {
        promptOptions: data.promptOptions,
        response: data.response,
      };

      return await previsions.insertOne(previsionDoc);
    } catch (e) {
      console.error(`Unable to post previsions: ${e}`);
      return { error: e };
    }
  }
}

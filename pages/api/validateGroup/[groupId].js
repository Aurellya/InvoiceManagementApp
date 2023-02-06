import connectMongo from "../../../database/conn";
import Groups from "../../../model/GroupSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const groupId = req.query.groupId;

  switch (req.method) {
    // validate group/company code
    case "GET":
      try {
        // find code
        const group = await Groups.find({
          group_code: groupId,
        });

        return res
          .status(200)
          .json({
            result: group.length > 0,
            message: "Successfully validate data!",
          });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to validate the code: " + error });
      }

    default:
      res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

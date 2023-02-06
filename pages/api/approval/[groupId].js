import connectMongo from "../../../database/conn";
import Approvals from "../../../model/ApprovalSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const groupCode = req.query.groupId;

  switch (req.method) {
    // get customer data based on user's group code
    case "GET":
      try {
        // find approval data
        const data = await Approvals.find({ group_code: groupCode })
          .populate("applicantId")
          .sort([["date", -1]]);

        res.status(200).json({ data: data });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the data: " + error });
      }
      break;

    case "POST":
      try {
        const userInput = JSON.parse(req.body);

        // add to approvals docs
        const newApplication = new Approvals({
          applicantId: userInput.applicantId,
          group_code: groupCode,
        });
        newApplication.save();

        return res.status(200).json({ message: "Successfully adding data!" });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to insert the data: " + error });
      }

    default:
      res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

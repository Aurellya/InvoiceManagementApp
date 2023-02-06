import connectMongo from "../../../database/conn";
import Approvals from "../../../model/ApprovalSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const applicantId = req.query.applicantId;

  switch (req.method) {
    // get customer data based on user's group code
    case "GET":
      try {
        // find approval data
        const data = await Approvals.find({
          applicantId: applicantId,
        }).populate("applicantId");

        res.status(200).json({ data: data[0] });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the data: " + error });
      }
      break;

    default:
      res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

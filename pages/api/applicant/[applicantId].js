import connectMongo from "../../../database/conn";
import Approvals from "../../../model/ApprovalSchema";

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  const applicantId = req.query.applicantId;

  switch (req.method) {
    // get applicant data based on applicantId
    case "GET":
      try {
        // find approval data
        var data = await Approvals.findOne({
          applicantId: applicantId,
        }).populate("groupId");

        return res.status(200).json({ data: data });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the data: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method not valid" });
  }
}

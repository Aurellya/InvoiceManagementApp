import connectMongo from "../../../database/conn";
import Groups from "../../../model/GroupSchema";
import Users from "../../../model/Schema";
import Approvals from "../../../model/ApprovalSchema";

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  const approvalId = req.query.approvalId;

  switch (req.method) {
    // approve or reject approval request
    case "PUT":
      try {
        var userInput = JSON.parse(req.body);

        // if rejected: delete the approval ID
        // if approved: delete the approval ID
        await Approvals.findByIdAndDelete(approvalId);

        // if approved:
        if (userInput.status == "approve") {
          // find group
          const group = await Groups.findOne({
            group_code: userInput.group_code,
          });

          // update group code and role of the user
          await Users.findByIdAndUpdate(userInput.applicantId, {
            groupId: group,
            role: "staff",
          });
        }

        return res.status(200).json({
          message: "Successfully process the request!",
        });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to process the request: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method not valid" });
  }
}

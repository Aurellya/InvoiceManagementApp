import connectMongo from "../../../database/conn";
import Groups from "../../../model/GroupSchema";
import Users from "../../../model/Schema";
import Approvals from "../../../model/ApprovalSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

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
          // update group code and role of the user
          await Users.findByIdAndUpdate(userInput.applicantId, {
            group_code: userInput.group_code,
            role: "staff",
          });
          // add userId to member on groups docs
          // find user
          const newUser = await Users.findOne({ _id: userInput.applicantId });

          // add user to groups member
          const group = await Groups.find({
            group_code: userInput.group_code,
          });
          const groupInfo = await group[0];
          if (groupInfo.members != null) {
            groupInfo.members.push(newUser);
          } else {
            groupInfo.members = [newUser];
          }
          groupInfo.save();
        }

        return res.status(200).json({
          message: "Successfully process the request!",
        });
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ message: "Failed to process the request: " + error });
      }

    default:
      res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

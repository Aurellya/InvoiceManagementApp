import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import Groups from "../../../model/GroupSchema";
import Users from "../../../model/Schema";
import Approvals from "../../../model/ApprovalSchema";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  // Signed in
  if (session) {
    // console.log("Session", JSON.stringify(session, null, 2));

    // connect to db
    await connectMongo().catch((error) =>
      res.json({ error: "Connection Failed...!" })
    );

    // check if user (from session var) exists in db and the role
    let email_from_sess = session.user.email;
    const req_user = await Users.findOne({
      email: email_from_sess,
    }).populate("groupId");
    const check_role = req_user.role == "admin";

    // get req parameter
    const approvalId = req.query.approvalId;

    switch (req.method) {
      // approve or reject approval request
      case "PUT":
        try {
          var userInput = JSON.parse(req.body);

          // only admin that belong to the same group is authorized
          if (
            check_role &&
            userInput.group_code == req_user.groupId.group_code
          ) {
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
          } else {
            return res.status(401).json({
              message: "You are not authorized to modify the data!",
            });
          }
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Failed to process the request: " + error });
        }

      default:
        return res.status(500).json({ message: "HTTP method not valid" });
    }
  }

  // Not Signed in
  else {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
}

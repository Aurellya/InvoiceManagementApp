import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import Approvals from "../../../model/ApprovalSchema";
import Groups from "../../../model/GroupSchema";
import Users from "../../../model/Schema";

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
    const groupCode = req.query.groupCode;

    switch (req.method) {
      // get customer data based on user's group code
      case "GET":
        try {
          // only admin that belong to the same group is authorized
          if (check_role && groupCode == req_user.groupId.group_code) {
            // find group data
            const groupId = await Groups.findOne({ group_code: groupCode });

            // find approval data
            const data = await Approvals.find({ groupId: groupId._id })
              .populate("applicantId")
              .sort([["date", -1]]);

            return res.status(200).json({ data: data });
          } else {
            return res.status(401).json({
              message: "You are not authorized to retrieve the data!",
            });
          }
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Failed to retrieve the data: " + error });
        }

      // create new approval => only own self
      case "POST":
        try {
          const userInput = JSON.parse(req.body);

          // authorization => user can only create their new approval
          if (userInput.applicantId == req_user._id) {
            // find group data
            const group = await Groups.findOne({
              group_code: userInput.group_code,
            });

            // find user data
            const user = await Users.findOne({ _id: userInput.applicantId });

            // add to approvals docs
            const newApplication = new Approvals({
              applicantId: user,
              groupId: group,
            });
            newApplication.save();

            return res
              .status(200)
              .json({ message: "Successfully adding data!" });
          } else {
            return res.status(401).json({
              message: "You are not authorized to create new approval!",
            });
          }
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Failed to insert the data: " + error });
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

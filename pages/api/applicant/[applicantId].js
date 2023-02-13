import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import Approvals from "../../../model/ApprovalSchema";
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

    // check if user (from session var) exists in db
    let email_from_sess = session.user.email;
    const req_user = await Users.findOne({
      email: email_from_sess,
    }).populate("groupId");

    // get req parameter
    const applicantId = req.query.applicantId;

    switch (req.method) {
      // get applicant data based on applicantId
      case "GET":
        try {
          // authorization: check user id
          if (req_user._id == applicantId) {
            // find approval data
            var data = await Approvals.findOne({
              applicantId: applicantId,
            }).populate("groupId");

            return res.status(200).json({ data: data });
          } else {
            return res.status(401).json({
              message: "You are not authorized to retreive this data!",
            });
          }
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Failed to retrieve the data: " + error });
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

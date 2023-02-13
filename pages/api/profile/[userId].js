import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
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

    // check if user (from session var) exists in db
    let email_from_sess = session.user.email;
    const req_user = await Users.findOne({
      email: email_from_sess,
    }).populate("groupId");

    // get req parameter
    const userId = req.query.userId;

    switch (req.method) {
      // get user profile [id]
      case "GET":
        try {
          const user = await Users.findOne({
            _id: userId,
          }).populate("groupId");

          const data = await user;
          let result = {
            _id: data._id,
            username: data.username,
            email: data.email,
            group_code: data.groupId.group_code,
            role: data.role,
          };

          return res.status(200).json({ data: result });
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Failed to retrieve the profile: " + error });
        }

      // edit user profile
      case "PUT":
        try {
          // authorization => user can only update their own profile
          if (req_user._id == userId) {
            var userInput = JSON.parse(req.body);

            await Users.findByIdAndUpdate(userId, {
              username: userInput.username,
            });

            return res.status(200).json({
              message: "Successfully update the profile!",
            });
          } else {
            return res
              .status(401)
              .json({ message: "You can only edit your own account!" });
          }
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Failed to update the profile: " + error });
        }

      // delete account
      case "DELETE":
        try {
          // authenticate => user can only delete their own account
          if (check_user._id == userId) {
            // check if user exists
            const user = await Users.findOne({
              _id: userId,
            });

            if (user) {
              const waitingApplicant = await Approvals.findOne({
                applicantId: userId,
              });

              // if user don't have group code and still waiting for approval
              if (!user.groupId && waitingApplicant) {
                // delete item in approvals docs
                await Approvals.findOneAndDelete({ applicantId: userId });
              }

              // delete account
              await Users.findByIdAndDelete(userId);

              return res
                .status(200)
                .json({ message: "Successfully delete the account!" });
            }
          } else {
            return res
              .status(400)
              .json({ message: "You can only delete your own account!" });
          }
          return;
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Failed to delete the account: " + error });
        }

      default:
        return res.status(400).json({ message: "HTTP method not valid" });
    }
  }

  // Not Signed in
  else {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
}

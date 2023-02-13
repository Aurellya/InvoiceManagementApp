import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";
import { hash } from "bcryptjs";

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

    // get req parameter
    const userId = req.query.userId;

    switch (req.method) {
      // change password
      case "PUT":
        try {
          var userInput = JSON.parse(req.body);

          // authorization => user can only update their own profile
          if (req_user._id == userId) {
            const x = await Users.findByIdAndUpdate(userId, {
              password: await hash(userInput.password, 12),
            });

            return res.status(200).json({
              message: "Successfully update the password!",
            });
          } else {
            return res
              .status(401)
              .json({ message: "You can only change your own password!" });
          }
        } catch (error) {
          console.log(error);
          return res
            .status(400)
            .json({ message: "Failed to update the password: " + error });
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

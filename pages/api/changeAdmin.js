import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import connectMongo from "../../database/conn";
import Users from "../../model/Schema";

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

    // only admin is authorized to change admin
    if (check_role) {
      switch (req.method) {
        // change staff role to admin
        case "PUT":
          try {
            var userInput = JSON.parse(req.body);

            // authorization: check if admin has the same group code with staff
            let staff = await Users.findOne({ _id: userInput._id }).populate(
              "groupId"
            );

            if (staff.groupId.group_code == req_user.groupId.group_code) {
              await Users.findByIdAndUpdate(userInput._id, {
                role: "admin",
              });

              return res.status(200).json({
                message: "Successfully update the admin!",
              });
            } else {
              return res
                .status(401)
                .json({ message: "You are not authorized to change admin!" });
            }
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to update the admin: " + error });
          }

        default:
          return res.status(500).json({ message: "HTTP method not valid" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "You are not authorized to change admin!" });
    }
  }

  // Not Signed in
  else {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
}

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
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

    // only admin is authorized to access staff info and kick staff
    if (check_role && groupCode == req_user.groupId.group_code) {
      switch (req.method) {
        // get company staff info
        case "GET":
          try {
            // find group Id
            const group = await Groups.findOne({
              group_code: groupCode,
            });

            // find all the staffs (excluding admin)
            var staffs = await Users.find({
              groupId: group._id,
              role: "staff",
            });

            let members = [];

            if (staffs) {
              staffs.map((staff) => {
                members.push({
                  _id: staff._id,
                  username: staff.username,
                  email: staff.email,
                  group_code: staff.groupId.group_code,
                  role: staff.role,
                });
              });
            }

            return res.status(200).json({
              result: staffs.length > 0,
              data: members,
              message: "Successfully validate data!",
            });
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to validate the code: " + error });
          }

        // kick staff from company
        case "PUT":
          try {
            var userInput = JSON.parse(req.body);

            // remove the group code and role from staff info => update users docs
            await Users.findByIdAndUpdate(userInput.staffId, {
              groupId: null,
              role: null,
            });

            return res.status(200).json({
              message: "Successfully kick the staff!",
            });
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to kick the staff: " + error });
          }

        default:
          return res.status(500).json({ message: "HTTP method not valid" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "You are not authorized to to access this route!" });
    }
  }

  // Not Signed in
  else {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
}

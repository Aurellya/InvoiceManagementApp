import connectMongo from "../../../database/conn";
import Groups from "../../../model/GroupSchema";
import Users from "../../../model/Schema";

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  const groupCode = req.query.groupCode;

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
}

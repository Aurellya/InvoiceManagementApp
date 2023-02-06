import connectMongo from "../../../database/conn";
import Groups from "../../../model/GroupSchema";
import Users from "../../../model/Schema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const groupCode = req.query.groupId;

  switch (req.method) {
    // get company staff info
    case "GET":
      try {
        // find code
        const group = await Groups.find({
          group_code: groupCode,
        }).populate("members");

        let members;

        if (group.length > 0) {
          members = await group[0].members;
        }

        // invoices
        if (members == null) {
          members = [];
        }

        return res.status(200).json({
          result: group.length > 0,
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

        // remove staff from groups docs [members] => update groups docs
        await Groups.updateOne(
          { group_code: groupCode },
          {
            $pull: {
              members: userInput.staffId,
            },
          }
        );

        // remove the group code and role from staff info => update users docs
        await Users.findByIdAndUpdate(userInput.staffId, {
          group_code: "",
          role: "",
        });

        return res.status(200).json({
          message: "Successfully kick the staff!",
        });
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ message: "Failed to kick the staff: " + error });
      }

    default:
      res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

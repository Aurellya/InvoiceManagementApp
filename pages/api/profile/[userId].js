import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";
import Groups from "../../../model/GroupSchema";
import Approvals from "../../../model/ApprovalSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const userId = req.query.userId;

  switch (req.method) {
    // get user profile
    case "GET":
      try {
        const user = await Users.find({
          _id: userId,
        });
        const data = await user;
        let result = {
          _id: data[0]._id,
          username: data[0].username,
          email: data[0].email,
          group_code: data[0].group_code,
          role: data[0].role,
        };

        return res.status(200).json({ data: result });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the Profile: " + error });
      }

    // edit user profile
    case "PUT":
      try {
        var userInput = JSON.parse(req.body);

        const x = await Users.findByIdAndUpdate(userId, {
          username: userInput.username,
        });

        return res.status(200).json({
          message: "Successfully update the profile!",
        });
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ message: "Failed to update the profile: " + error });
      }

    // delete account
    case "DELETE":
      try {
        // check the company code of the user
        const user = await Users.findOne({
          _id: userId,
        });

        if (user) {
          // if user got company code, remove user id from groups docs [members]
          if (user.group_code != "") {
            await Groups.updateOne(
              { group_code: user.group_code },
              {
                $pull: {
                  members: userId,
                },
              }
            );
          }
          // if not remove it from approvals
          else {
            // delete item in approvals docs
            await Approvals.findOneAndDelete({ applicantId: userId });
          }
        }

        // delete account
        Users.findByIdAndDelete(userId, function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            return res.status(200).json({ data: docs });
          }
        });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to delete the Account: " + error });
      }
      break;

    default:
      res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

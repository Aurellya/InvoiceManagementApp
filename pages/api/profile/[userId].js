import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";
import Groups from "../../../model/GroupSchema";
import Approvals from "../../../model/ApprovalSchema";

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  const userId = req.query.userId;

  switch (req.method) {
    // get user profile
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
          .json({ message: "Failed to retrieve the Profile: " + error });
      }

    // edit user profile
    case "PUT":
      try {
        var userInput = JSON.parse(req.body);

        await Users.findByIdAndUpdate(userId, {
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
            .json({ message: "Successfully delete the Account!" });
        }
        return;
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to delete the Account: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method not valid" });
  }
}

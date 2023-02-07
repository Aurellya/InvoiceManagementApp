import connectMongo from "../../../database/conn";
import Approvals from "../../../model/ApprovalSchema";
import Groups from "../../../model/GroupSchema";
import Users from "../../../model/Schema";

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  const groupCode = req.query.groupCode;

  switch (req.method) {
    // get customer data based on user's group code
    case "GET":
      try {
        // find group data
        const groupId = await Groups.findOne({ group_code: groupCode });

        // find approval data
        const data = await Approvals.find({ groupId: groupId._id })
          .populate("applicantId")
          .sort([["date", -1]]);

        return res.status(200).json({ data: data });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the data: " + error });
      }

    // create new approval
    case "POST":
      try {
        const userInput = JSON.parse(req.body);

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

        return res.status(200).json({ message: "Successfully adding data!" });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to insert the data: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method not valid" });
  }
}

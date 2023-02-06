import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const userId = req.query.userId;

  switch (req.method) {
    // change password
    case "PUT":
      try {
        var userInput = JSON.parse(req.body);

        const x = await Users.findByIdAndUpdate(userId, {
          password: await hash(userInput.password, 12),
        });

        return res.status(200).json({
          message: "Successfully update the password!",
        });
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ message: "Failed to update the password: " + error });
      }

    default:
      res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

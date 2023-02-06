import connectMongo from "../../database/conn";
import Users from "../../model/Schema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  switch (req.method) {
    // change staff role to admin
    case "PUT":
      try {
        var userInput = JSON.parse(req.body);

        let user = await Users.findByIdAndUpdate(userInput._id, {
          role: "admin",
        });

        return res.status(200).json({
          message: "Successfully update the admin!",
        });
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ message: "Failed to update the admin: " + error });
      }

    default:
      res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

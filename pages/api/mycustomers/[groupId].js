import connectMongo from "../../../database/conn";
import Customers from "../../../model/CustomerSchema";
import Groups from "../../../model/GroupSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const groupId = req.query.groupId;

  switch (req.method) {
    // get customer data based on user's group code
    case "GET":
      try {
        const group = await Groups.find({
          group_code: groupId,
        });
        const custsId = await group[0].customers;
        const data = await Customers.find({ _id: { $in: custsId } })
          .collation({ locale: "en" })
          .sort([["name", 1]]);
        res.status(200).json({ data: data });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the Customer: " + error });
      }
      break;

    case "POST":
      try {
        const userInput = JSON.parse(req.body);

        // add to customer docs
        const newCustomer = new Customers({
          name: userInput.name,
          phone_no: userInput.phone_no,
          address: userInput.address,
          email: userInput.email,
          remarks: userInput.remarks,
        });
        newCustomer.save();

        // update groups docs
        const group = await Groups.find({
          group_code: groupId,
        });
        const groupInfo = await group[0];
        if (groupInfo.customers != null) {
          groupInfo.customers.push(newCustomer);
        } else {
          groupInfo.customers = [newCustomer];
        }
        groupInfo.save();

        return res
          .status(200)
          .json({ message: "Successfully adding customer data!" });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to insert the Customer: " + error });
      }

    default:
      res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import Customers from "../../../model/CustomerSchema";
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

    // get req parameter
    const groupCode = req.query.groupCode;

    // check if user req for or post data that belong to them
    if (req_user.groupId.group_code == groupCode) {
      switch (req.method) {
        // get customer data based on user's group code
        case "GET":
          try {
            const group = await Groups.findOne({
              group_code: groupCode,
            });
            const custsId = await group.customers;

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

        // add new customer info + add to group
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
            const group = await Groups.findOne({
              group_code: groupCode,
            });
            const groupInfo = await group;

            if (groupInfo.customers) {
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
          return res.status(500).json({ message: "HTTP method not valid" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this route" });
    }
  }

  // Not Signed in
  else {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
}

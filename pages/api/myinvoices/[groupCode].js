import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import Invoices from "../../../model/InvoiceSchema";
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
        // get invoice data based on user's group code
        case "GET":
          try {
            const group = await Groups.findOne({
              group_code: groupCode,
            });
            const invoicesId = await group.invoices;

            const data = await Invoices.find({ _id: { $in: invoicesId } }).sort(
              [["date", -1]]
            );

            return res.status(200).json({ data: data });
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to retrieve the Invoice: " + error });
          }

        // add new invoice info + add to group
        case "POST":
          try {
            const userInput = JSON.parse(req.body);

            // add to invoice docs
            const newInvoice = new Invoices({
              customer_name: userInput.customer_name,
              contents: userInput.contents,
              date: userInput.date,
              status: userInput.status,
              total_items: userInput.total_items,
              total: userInput.total,
              notes: userInput.notes,
            });
            newInvoice.save();

            // update groups docs
            const group = await Groups.findOne({
              group_code: groupCode,
            });
            const groupInfo = await group;

            if (groupInfo.invoices) {
              groupInfo.invoices.push(newInvoice);
            } else {
              groupInfo.invoices = [newInvoice];
            }
            groupInfo.save();

            return res
              .status(200)
              .json({ message: "Successfully adding invoice data!" });
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to insert the Invoice: " + error });
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

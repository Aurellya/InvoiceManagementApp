import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import Invoices from "../../../model/InvoiceSchema";
import Users from "../../../model/Schema";
import Groups from "../../../model/GroupSchema";

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
    const check_role = req_user.role == "admin";

    // get req parameter
    const invoiceId = req.query.invoiceId;

    // check if req_user.group.customers includes invoiceId
    const req_group = await Groups.findOne({
      _id: req_user.groupId._id,
    });

    if (req_group.invoices.includes(invoiceId)) {
      switch (req.method) {
        case "GET":
          try {
            const invoice = await Invoices.findById(invoiceId);
            return res.status(200).json({ data: invoice });
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to retrieve the Invoice: " + error });
          }

        case "PUT":
          try {
            // check if req_user is admin
            if (check_role) {
              var userInput = JSON.parse(req.body);
              var updated_invoice = {
                customer_name: userInput.customer_name,
                contents: userInput.contents,
                date: userInput.date,
                status: userInput.status,
                total_items: userInput.total_items,
                total: userInput.total,
                notes: userInput.notes,
              };

              const docs = await Invoices.findByIdAndUpdate(
                invoiceId,
                updated_invoice
              );
              return res.status(200).json({ data: docs });
            } else {
              return res.status(401).json({
                message: "You are not authorized to modify the data!",
              });
            }
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to update the Invoices: " + error });
          }

        case "DELETE":
          try {
            // check if req_user is admin
            if (check_role) {
              // remove it from groups
              await Groups.updateOne(
                { group_code: req_user.groupId.group_code },
                {
                  $pull: {
                    invoices: invoiceId,
                  },
                }
              );

              // remove invoice
              const docs = await Invoices.findByIdAndDelete(invoiceId);

              return res.status(200).json({ data: docs });
            } else {
              return res.status(401).json({
                message: "You are not authorized to delete the data!",
              });
            }
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to delete the Invoice: " + error });
          }

        default:
          return res.status(500).json({ message: "HTTP method not valid" });
      }
    } else {
      return res.status(401).json({
        message: "You are not authorized to access this route",
      });
    }
  }

  // Not Signed in
  else {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
}

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import Invoices from "../../../model/InvoiceSchema";
import Customers from "../../../model/CustomerSchema";
import PriceLists from "../../../model/PriceListSchema";
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
    const check_role = req_user.role == "admin";

    // get req parameter

    const groupCode = req.query.groupCode;

    switch (req.method) {
      // get the summary of the data that belong to the group code
      case "GET":
        try {
          // only admin that belong to the same group is authorized
          if (check_role && groupCode == req_user.groupId.group_code) {
            // find the group details
            const group = await Groups.findOne({
              group_code: groupCode,
            });

            let invoicesId, customersId, itemsId;

            if (group) {
              invoicesId = await group.invoices;
              customersId = await group.customers;
              itemsId = await group.priceLists;
            }

            // invoices
            if (!invoicesId) {
              invoicesId = [];
            }

            const totalPaidInvoices = await Invoices.find({
              _id: { $in: invoicesId },
            }).count({ status: "paid" });
            const totalUnpaidInvoices = await Invoices.find({
              _id: { $in: invoicesId },
            }).count({
              status: "not paid",
            });

            // customers
            if (!customersId) {
              customersId = [];
            }

            const totalCustomers = await Customers.find({
              _id: { $in: customersId },
            }).count();

            // items
            if (!itemsId) {
              itemsId = [];
            }

            const totalItems = await PriceLists.find({
              _id: { $in: itemsId },
            }).count();

            // total income this month
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth(); // month starts at 0
            const start = new Date(year, month, 1);
            const end = new Date(year, month, 30);

            const totalRevenue = await Invoices.aggregate([
              {
                $match: {
                  _id: { $in: invoicesId },
                  date: { $gte: start, $lt: end },
                },
              },
              // grouping pipeline
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: "$total",
                  },
                },
              },
            ]);

            // calculate average income each month
            const monthlyRevenue = await Invoices.aggregate([
              { $match: { _id: { $in: invoicesId } } },
              // grouping pipeline
              {
                $group: {
                  _id: {
                    $dateToString: { format: "%Y-%m", date: "$date" },
                  },
                  average: { $avg: "$total" },
                  month: { $first: { $month: "$date" } },
                  year: { $first: { $year: "$date" } },
                },
              },
              // sorting pipeline
              { $sort: { _id: -1 } },
            ]);

            // calculate average income monthly
            var totalMonthlyRev = 0;
            var totalMonth = 0;
            await monthlyRevenue.map((m) => {
              totalMonthlyRev += m.average;
              totalMonth += 1;
            });
            var avgMonthlyRevenue = Math.round(totalMonthlyRev / totalMonth);

            return res.status(200).json({
              data: {
                totalPaidInvoices,
                totalUnpaidInvoices,
                totalCustomers,
                totalItems,
                totalRevenue,
                monthlyRevenue,
                avgMonthlyRevenue,
              },
            });
          } else {
            return res.status(401).json({
              message: "You are not authorized to retrieve the data!",
            });
          }
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Failed to retrieve the Summary: " + error });
        }

      default:
        return res.status(500).json({ message: "HTTP method is not valid" });
    }
  }

  // Not Signed in
  else {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
}

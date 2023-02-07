import connectMongo from "../../../database/conn";
import Invoices from "../../../model/InvoiceSchema";
import Customers from "../../../model/CustomerSchema";
import PriceLists from "../../../model/PriceListSchema";
import Groups from "../../../model/GroupSchema";

export default async function handler(req, res) {
  await connectMongo().catch((error) => {
    return res.json({ error: "Connection Failed...!" });
  });

  const groupCode = req.query.groupCode;

  switch (req.method) {
    // get the summary of the data that belong to the group code
    case "GET":
      try {
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
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the Summary: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method is not valid" });
  }
}

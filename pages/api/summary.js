import connectMongo from "../../database/conn";
import Invoices from "../../model/InvoiceSchema";
import Customers from "../../model/CustomerSchema";
import PriceLists from "../../model/PriceListSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => {
    return res.json({ error: "Connection Failed...!" });
  });

  switch (req.method) {
    case "GET":
      try {
        // invoices
        const totalPaidInvoices = await Invoices.count({ status: "paid" });
        const totalUnpaidInvoices = await Invoices.count({
          status: "not paid",
        });

        // customers
        const totalCustomers = await Customers.count();

        // items
        const totalItems = await PriceLists.count();

        // income current month
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // month starts at 0
        const start = new Date(year, month, 1);
        const end = new Date(year, month, 30);

        const totalRevenue = await Invoices.aggregate([
          {
            $match: { date: { $gte: start, $lt: end } },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$total",
              },
            },
          },
        ]);

        // average income monthly
        const monthlyRevenue = await Invoices.aggregate([
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
    // break;

    default:
      return res.status(500).json({ message: "HTTP method is not valid" });
    // break;
  }
}

import connectMongo from "../../../database/conn";
import Invoices from "../../../model/InvoiceSchema";

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  const invoiceId = req.query.invoiceId;

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
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to update the Invoices: " + error });
      }

    case "DELETE":
      try {
        const docs = await Invoices.findByIdAndDelete(invoiceId);
        return res.status(200).json({ data: docs });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to delete the Invoice: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method not valid" });
  }
}

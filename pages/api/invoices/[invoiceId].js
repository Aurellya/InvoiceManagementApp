import connectMongo from "../../../database/conn";
import Invoices from "../../../model/InvoiceSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const invoiceId = req.query.invoiceId;

  switch (req.method) {
    case "GET":
      try {
        const invoice = await Invoices.findById(invoiceId);
        res.status(200).json({ data: invoice });
      } catch (error) {
        res
          .status(400)
          .json({ message: "Failed to retrieve the Invoice: " + error });
      }
      break;

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

        Invoices.findByIdAndUpdate(
          invoiceId,
          updated_invoice,
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json({ data: docs });
            }
          }
        );
      } catch (error) {
        res
          .status(400)
          .json({ message: "Failed to update the Invoices: " + error });
      }
      break;

    case "DELETE":
      try {
        Invoices.findByIdAndDelete(invoiceId, function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({ data: docs });
          }
        });
      } catch (error) {
        res
          .status(400)
          .json({ message: "Failed to delete the Invoice: " + error });
      }
      break;

    default:
      res
        .status(500)
        .json({ message: "HTTP method not valid only GET Accepted" });
      break;
  }
}

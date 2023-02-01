// import connectMongo from "../../database/conn";
// import Invoices from "../../model/InvoiceSchema";

// export default async function handler(req, res) {
//   connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

//   switch (req.method) {
//     case "GET":
//       try {
//         const invoices = await Invoices.find({}).sort([["date", -1]]);
//         res.status(200).json({ data: invoices });
//       } catch (error) {
//         return res
//           .status(400)
//           .json({ message: "Failed to retrieve the Invoices: " + error });
//       }
//       break;

//     case "POST":
//       try {
//         var userInput = JSON.parse(req.body);
//         var new_invoice = new Invoices({
//           customer_name: userInput.customer_name,
//           contents: userInput.contents,
//           date: userInput.date,
//           status: userInput.status,
//           total_items: userInput.total_items,
//           total: userInput.total,
//           notes: userInput.notes,
//         });

//         new_invoice.save(function (err, docs) {
//           if (err) {
//             console.log(err);
//           } else {
//             res.status(200).json({ data: docs });
//           }
//         });
//       } catch (error) {
//         return res
//           .status(400)
//           .json({ message: "Failed to insert the Invoices: " + error });
//       }
//       break;

//     default:
//       res.status(500).json({ message: "HTTP method is not valid" });
//       break;
//   }
// }

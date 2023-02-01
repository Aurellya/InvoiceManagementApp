// import connectMongo from "../../database/conn";
// import Customers from "../../model/CustomerSchema";

// export default async function handler(req, res) {
//   connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

//   switch (req.method) {
//     case "GET":
//       try {
//         const customers = await Customers.find({}).sort([["name", -1]]);
//         res.status(200).json({ data: customers });
//       } catch (error) {
//         return res
//           .status(400)
//           .json({ message: "Failed to retrieve the Customers: " + error });
//       }
//       break;
//     case "POST":
//       try {
//         var userInput = JSON.parse(req.body);
//         var new_customer = new Customers({
//           name: userInput.name,
//           phone_no: userInput.phone_no,
//           address: userInput.address,
//           email: userInput.email,
//           remarks: userInput.remarks,
//         });

//         new_customer.save(function (err, docs) {
//           if (err) {
//             console.log(err);
//           } else {
//             res.status(200).json({ data: docs });
//           }
//         });
//       } catch (error) {
//         return res
//           .status(400)
//           .json({ message: "Failed to insert the Customer: " + error });
//       }
//       break;

//     default:
//       res.status(500).json({ message: "HTTP method is not valid" });
//       break;
//   }
// }

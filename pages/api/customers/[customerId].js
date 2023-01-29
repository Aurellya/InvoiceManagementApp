import connectMongo from "../../../database/conn";
import Customers from "../../../model/CustomerSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const customerId = req.query.customerId;

  switch (req.method) {
    case "GET":
      try {
        const customer = await Customers.findById(customerId);
        res.status(200).json({ data: customer });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the Customer: " + error });
      }
      break;

    case "PUT":
      try {
        var userInput = JSON.parse(req.body);
        var updated_customer = {
          name: userInput.name,
          phone_no: userInput.phone_no,
          address: userInput.address,
          email: userInput.email,
          remarks: userInput.remarks,
        };

        Customers.findByIdAndUpdate(
          customerId,
          updated_customer,
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              res.status(200).json({ data: docs });
            }
          }
        );
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to update the Customer: " + error });
      }
      break;

    case "DELETE":
      try {
        Customers.findByIdAndDelete(customerId, function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({ data: docs });
          }
        });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to delete the Customer: " + error });
      }
      break;

    default:
      res.status(500).json({ message: "HTTP method is not valid" });
      break;
  }
}

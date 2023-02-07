import connectMongo from "../../../database/conn";
import Customers from "../../../model/CustomerSchema";

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  const customerId = req.query.customerId;

  switch (req.method) {
    case "GET":
      try {
        const customer = await Customers.findById(customerId);
        return res.status(200).json({ data: customer });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the Customer: " + error });
      }

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

        const docs = await Customers.findByIdAndUpdate(
          customerId,
          updated_customer
        );
        return res.status(200).json({ data: docs });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to update the Customer: " + error });
      }

    case "DELETE":
      try {
        const docs = await Customers.findByIdAndDelete(customerId);
        return res.status(200).json({ data: docs });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to delete the Customer: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method is not valid" });
  }
}

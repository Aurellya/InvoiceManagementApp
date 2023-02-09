import connectMongo from "../../../database/conn";
import PriceLists from "../../../model/PriceListSchema";

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  const priceListId = req.query.priceListId;

  switch (req.method) {
    case "GET":
      try {
        const priceList = await PriceLists.findById(priceListId);
        return res.status(200).json({ data: priceList });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the PriceList: " + error });
      }

    case "PUT":
      try {
        var userInput = JSON.parse(req.body);
        var updated_priceList = {
          product_name: userInput.product_name,
          amount: userInput.amount,
          unit: userInput.unit,
          price: userInput.price,
          vip_price: userInput.vip_price,
          remarks: userInput.remarks,
        };

        const docs = await PriceLists.findByIdAndUpdate(
          priceListId,
          updated_priceList
        );
        return res.status(200).json({ data: docs });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to update the PriceList: " + error });
      }

    case "DELETE":
      try {
        const docs = await PriceLists.findByIdAndDelete(priceListId);
        return res.status(200).json({ data: docs });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to delete the PriceList: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method is not valid" });
  }
}

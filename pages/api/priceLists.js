import connectMongo from "../../database/conn";
import PriceLists from "../../model/PriceListSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  switch (req.method) {
    case "GET":
      try {
        const priceLists = await PriceLists.find({}).sort([["name", -1]]);
        res.status(200).json({ data: priceLists });
      } catch (error) {
        res
          .status(400)
          .json({ message: "Failed to retrieve the PriceList: " + error });
      }
      break;

    case "POST":
      try {
        var userInput = JSON.parse(req.body);
        var new_priceList = new PriceLists({
          product_name: userInput.product_name,
          amount: userInput.amount,
          unit: userInput.unit,
          price: userInput.price,
          remarks: userInput.remarks,
        });

        new_priceList.save(function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({ data: docs });
          }
        });
      } catch (error) {
        res
          .status(400)
          .json({ message: "Failed to insert the PriceList: " + error });
      }
      break;

    default:
      res.status(500).json({ message: "HTTP method is not valid" });
      break;
  }
}

import connectMongo from "../../../database/conn";
import PriceLists from "../../../model/PriceListSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const priceListId = req.query.priceListId;

  switch (req.method) {
    case "GET":
      try {
        const priceList = await PriceLists.findById(priceListId);
        res.status(200).json({ data: priceList });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the PriceList: " + error });
      }
      break;

    case "PUT":
      try {
        var userInput = JSON.parse(req.body);
        var updated_priceList = {
          product_name: userInput.product_name,
          amount: userInput.amount,
          unit: userInput.unit,
          price: userInput.price,
          remarks: userInput.remarks,
        };

        PriceLists.findByIdAndUpdate(
          priceListId,
          updated_priceList,
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
          .json({ message: "Failed to update the PriceList: " + error });
      }
      break;

    case "DELETE":
      try {
        PriceLists.findByIdAndDelete(priceListId, function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({ data: docs });
          }
        });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to delete the PriceList: " + error });
      }
      break;

    default:
      res.status(500).json({ message: "HTTP method is not valid" });
      break;
  }
}

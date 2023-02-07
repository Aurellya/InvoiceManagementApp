import connectMongo from "../../../database/conn";
import PriceLists from "../../../model/PriceListSchema";
import Groups from "../../../model/GroupSchema";

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  const groupId = req.query.groupId;

  switch (req.method) {
    // get pricelist data based on user's group code
    case "GET":
      try {
        const group = await Groups.findOne({
          group_code: groupId,
        });
        const itemsId = await group.priceLists;

        const data = await PriceLists.find({ _id: { $in: itemsId } })
          .collation({ locale: "en" })
          .sort([["product_name", 1]]);
        return res.status(200).json({ data: data });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the PriceList: " + error });
      }

    // add new item info + add to group
    case "POST":
      try {
        const userInput = JSON.parse(req.body);

        // add to pricelist docs
        const new_priceList = new PriceLists({
          product_name: userInput.product_name,
          amount: userInput.amount,
          unit: userInput.unit,
          price: userInput.price,
          remarks: userInput.remarks,
        });
        new_priceList.save();

        // update groups docs
        const group = await Groups.findOne({
          group_code: groupId,
        });
        const groupInfo = await group;

        if (groupInfo.priceLists) {
          groupInfo.priceLists.push(new_priceList);
        } else {
          groupInfo.priceLists = [new_priceList];
        }
        groupInfo.save();

        return res
          .status(200)
          .json({ message: "Successfully adding PriceList data!" });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to insert the PriceList: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method not valid" });
  }
}

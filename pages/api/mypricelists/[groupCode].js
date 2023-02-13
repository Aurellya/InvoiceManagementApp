import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import PriceLists from "../../../model/PriceListSchema";
import Groups from "../../../model/GroupSchema";
import Users from "../../../model/Schema";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  // Signed in
  if (session) {
    // console.log("Session", JSON.stringify(session, null, 2));

    // connect to db
    await connectMongo().catch((error) =>
      res.json({ error: "Connection Failed...!" })
    );

    // check if user (from session var) exists in db and the role
    let email_from_sess = session.user.email;
    const req_user = await Users.findOne({
      email: email_from_sess,
    }).populate("groupId");
    const check_role = req_user.role == "admin";

    // get req parameter
    const groupCode = req.query.groupCode;

    // check if user req for or post data that belong to them
    if (req_user.groupId.group_code == groupCode) {
      switch (req.method) {
        // get pricelist data based on user's group code
        case "GET":
          try {
            const group = await Groups.findOne({
              group_code: groupCode,
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

            if (check_role == "admin") {
              // add to pricelist docs
              const new_priceList = new PriceLists({
                product_name: userInput.product_name,
                amount: userInput.amount,
                unit: userInput.unit,
                price: userInput.price,
                vip_price: userInput.vip_price,
                remarks: userInput.remarks,
              });
              new_priceList.save();

              // update groups docs
              const group = await Groups.findOne({
                group_code: groupCode,
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
            } else {
              return res.status(400).json({
                message: "You are not authorized to insert this data",
              });
            }
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to insert the PriceList: " + error });
          }

        default:
          return res.status(500).json({ message: "HTTP method not valid" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this route" });
    }
  }

  // Not Signed in
  else {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
}

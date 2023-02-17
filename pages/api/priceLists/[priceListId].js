import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongo from "../../../database/conn";
import PriceLists from "../../../model/PriceListSchema";
import Users from "../../../model/Schema";
import Groups from "../../../model/GroupSchema";

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
    const priceListId = req.query.priceListId;

    // check if req_user.group.customers includes priceListId
    const req_group = await Groups.findOne({
      _id: req_user.groupId._id,
    });

    if (req_group.priceLists.includes(priceListId)) {
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
            // check if req_user is admin
            if (check_role) {
              var userInput = JSON.parse(req.body);
              var updated_priceList = {
                product_name: userInput.product_name,
                amount: userInput.amount,
                unit: userInput.unit,
                price: userInput.price,
                capital_cost: userInput.capital_cost,
                remarks: userInput.remarks,
              };

              const docs = await PriceLists.findByIdAndUpdate(
                priceListId,
                updated_priceList
              );
              return res.status(200).json({ data: docs });
            } else {
              return res.status(401).json({
                message: "You are not authorized to modify the data!",
              });
            }
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to update the PriceList: " + error });
          }

        case "DELETE":
          try {
            // check if req_user is admin
            if (check_role) {
              // remove it from groups
              await Groups.updateOne(
                { group_code: req_user.groupId.group_code },
                {
                  $pull: {
                    priceLists: priceListId,
                  },
                }
              );

              // remove customer
              const docs = await PriceLists.findByIdAndDelete(priceListId);
              return res.status(200).json({ data: docs });
            } else {
              return res.status(401).json({
                message: "You are not authorized to delete the data!",
              });
            }
          } catch (error) {
            return res
              .status(400)
              .json({ message: "Failed to delete the PriceList: " + error });
          }

        default:
          return res.status(500).json({ message: "HTTP method is not valid" });
      }
    } else {
      return res.status(401).json({
        message: "You are not authorized to access this route",
      });
    }
  }

  // Not Signed in
  else {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }
}

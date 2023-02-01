import connectMongo from "../../../database/conn";
import Invoices from "../../../model/InvoiceSchema";
import Groups from "../../../model/GroupSchema";

export default async function handler(req, res) {
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  const groupId = req.query.groupId;

  switch (req.method) {
    // get invoice data based on user's group code
    case "GET":
      try {
        const group = await Groups.find({
          group_code: groupId,
        });
        const invoicesId = await group[0].invoices;
        const data = await Invoices.find({ _id: { $in: invoicesId } }).sort([
          ["date", -1],
        ]);
        return res.status(200).json({ data: data });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to retrieve the Invoice: " + error });
      }
      break;

    case "POST":
      try {
        const userInput = JSON.parse(req.body);

        // add to invoice docs
        const newInvoice = new Invoices({
          customer_name: userInput.customer_name,
          contents: userInput.contents,
          date: userInput.date,
          status: userInput.status,
          total_items: userInput.total_items,
          total: userInput.total,
          notes: userInput.notes,
        });
        newInvoice.save();

        // update groups docs
        const group = await Groups.find({
          group_code: groupId,
        });
        const groupInfo = await group[0];
        if (groupInfo.invoices != null) {
          groupInfo.invoices.push(newInvoice);
        } else {
          groupInfo.invoices = [newInvoice];
        }
        groupInfo.save();

        return res
          .status(200)
          .json({ message: "Successfully adding invoice data!" });
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Failed to insert the Invoice: " + error });
      }

    default:
      return res.status(500).json({ message: "HTTP method not valid" });
      break;
  }
}

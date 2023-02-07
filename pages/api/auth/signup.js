import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";
import Groups from "../../../model/GroupSchema";
import Approvals from "../../../model/ApprovalSchema";
import { hash } from "bcryptjs";

function generateCode() {
  // generate random company code
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 10) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}

export default async function handler(req, res) {
  await connectMongo().catch((error) =>
    res.json({ error: "Connection Failed...!" })
  );

  // process registration
  if (req.method === "POST") {
    // if user submit incomplete data
    if (!req.body) {
      return res.status(404).json({
        error: "Don't have form data...!",
        error_id: "Data tidak lengkap...!",
      });
    }

    const { username, email, password, companycode } = req.body;

    // check duplicate users/email
    const checkexistingEmail = await Users.findOne({ email });
    if (checkexistingEmail) {
      return res.status(422).json({
        error: "User Already Exists...!",
        error_id: "Email telah dipakai...!",
      });
    }

    let role = null,
      cc = null;

    // A. if no company code => register as admin => create new groups
    if (companycode == "") {
      // generate random code
      let result = generateCode();

      // check if code is already exists in db
      const checkExistingCode = await Groups.findOne({ group_code: result });
      while (checkExistingCode) {
        result = generateCode();
      }

      // admin as a role and a new generated code
      role = "admin";

      // A1. create new group docs
      const newGroup = new Groups({
        group_code: result,
        invoices: null,
        customers: null,
        priceLists: null,
      });
      newGroup.save();

      cc = newGroup;
    }

    // A2-B1. add to users docs
    const newUser = new Users({
      username,
      email,
      password: await hash(password, 12),
      groupId: cc,
      role,
    });
    newUser.save();

    // B. if got company code => register as staff => create new approvals (need to wait for admin approvals)
    if (companycode != "") {
      // find the particular group docs from the group code
      const group = await Groups.findOne({
        group_code: companycode,
      });

      if (group) {
        // B2. add to approval docs
        const newApproval = new Approvals({
          applicantId: newUser,
          groupId: group,
        });
        newApproval.save();
      }
    }

    return res.status(201).json({ status: true });
  } else {
    return res
      .status(500)
      .json({ error: "HTTP method not valid only POST Accepted" });
  }
}

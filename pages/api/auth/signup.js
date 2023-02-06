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
  connectMongo().catch((error) => res.json({ error: "Connection Failed...!" }));

  // only post method is accepted
  if (req.method === "POST") {
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

    let role = "";
    let cc = "";

    // A. if register as admin / no company code
    if (companycode == "") {
      // generate random code
      let result = generateCode();

      // todo: check if code is already exists in db
      const checkExistingCode = await Groups.findOne({ group_code: result });

      while (checkExistingCode) {
        result = generateCode();
      }

      cc = result;
      role = "admin";

      // create new group docs
      const newGroup = new Groups({
        group_code: cc,
        members: null,
        invoices: null,
        customers: null,
        priceLists: null,
      });
      newGroup.save();
    }

    // 1. add to users docs
    const newUser = new Users({
      username,
      email,
      password: await hash(password, 12),
      group_code: cc,
      role,
    });
    newUser.save();

    // B. if register as staff / user enter company code
    if (companycode != "") {
      // add to approval docs
      const newApproval = new Approvals({
        applicantId: newUser,
        group_code: companycode,
      });
      newApproval.save();
    }

    // A. if register as admin / no company code
    // 2. add users to groups docs
    if (companycode == "") {
      const group = await Groups.find({
        group_code: cc,
      });
      const groupInfo = await group[0];
      if (groupInfo.members != null) {
        groupInfo.members.push(newUser);
      } else {
        groupInfo.members = [newUser];
      }
      groupInfo.save();
    }

    return res.status(201).json({ status: true });
  } else {
    return res
      .status(500)
      .json({ error: "HTTP method not valid only POST Accepted" });
  }
}

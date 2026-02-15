import userSchema from "../Model/userSchema.js";

// const ROLES = ["user", "mod", "admin"];

const checkDupusernameOrEmail = async (req, res, next) => {
  const ifuserExists = await userSchema.findOne({ username: req.body.username });
  
  if (ifuserExists) {
    res.status(400).send({ message: "user already exists in the database" });
    return;
  }

  const ifEmailExists = await userSchema.findOne({ email: req.body.email });

  if (ifEmailExists) {
    res.status(400).send("email already exists in the database");
    return;
  }
  next();
};

// const checkRolesExisted = async (req, res, next) => {
//   if (req.body.roles) {
//     for (let i = 0; i < req.body.roles.length; i++) {
//       if (!ROLES.includes(req.body.roles[i])) {
//         res.status(400).send(`failed ${req.body.roles[i]} doesnot exist`);
//         return;
//       }
//     }
//   }
//   next();
// };

const verifySignUp = { checkDupusernameOrEmail };

export default verifySignUp;
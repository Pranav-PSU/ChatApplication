const Yup = require("yup");

const registerSchema = Yup.object({
  name: Yup.string()
    .required("Username required")
    .min(3, "Username too short")
    .max(30, "Username too long"),
  email: Yup.string()
    .required("email required")
    .min(5, "email too short")
    .max(45, "email too long"),
  password: Yup.string()
    .required("Password required")
    .min(8, "Password too short")
    .max(30, "Password too long"),
});

const loginSchema = Yup.object({
  email: Yup.string()
    .required("email required")
    .min(5, "email too short")
    .max(45, "email too long"),
  password: Yup.string()
    .required("Password required")
    .min(8, "Password too short")
    .max(30, "Password too long"),
});

//This is not needed anymore, since the frontend is taking care of validation.
// const authenticate_inputs = (body) => {

//   if (!body.name) {
//     loginSchema
//       .validate(body)
//       .catch((err) => {
//         console.log(err.errors);
//       })
//       .then((valid) => {
//         if (valid) console.log("form is valid");
//       });
//   } else {
//     registerSchema
//       .validate(body, { abortEarly: false })
//       .catch((err) => {
//         let errors = [];
//         err.inner.forEach((error) => {
//           errors.push(error.message);
//         });

//         console.log(errors);

//         return errors;
//       })
//       .then((valid) => {
//         if (valid) console.log("form is valid");
      
//       });
//   }
// };

module.exports = {registerSchema, loginSchema};

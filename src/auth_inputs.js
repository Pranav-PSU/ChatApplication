const Yup = require("yup");

// These schemas are Yup objects that conform an input to the specified restrictions, then return the 
// supplied error messages when input is incorrect.
const registerSchema = Yup.object({
  name: Yup.string()
    .required("Username required.")
    .min(3, "Username is too short.")
    .max(30, "Username is too long."),
  email: Yup.string()
    .required("Email required.")
    .email("This is not a proper email.")
    .min(5, "Email is too short.")
    .max(45, "Email is too long."),
  password: Yup.string()
    .required("Password required.")
    .min(8, "Password must be 8 or more characters.")
    .max(30, "Password is too long."),
});

const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email required.")
    .email("This is not a proper email.")
    .min(5, "Email is too short.")
    .max(45, "Email is too long."),
  password: Yup.string()
    .required("Password required.")
    .min(8, "Password must be 8 or more characters.")
    .max(30, "Password is too long."),
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

const login_model = require("../models/login_schema.js");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// This is called in our main to initialize all the passport functions.
const initialize_login = async (passport) => {
  // We define our own strategy to verify the user's login according to our database.
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      //If we find the user by email, get their info back in the callback.
      login_model.findOne({ email: email }, async (err, user) => {
        if (err) {
          // Done sends to the next success/fail/error methods in passport, depending on what we pass.
          return done(err);
        }
        if (!user) {
          console.log("No user with that email.");
          return done(null, false, {
            message: "No user found with that email.",
          });
        }

        // If we have a user, we can now check their password.
        // Compare found password with bcrypt. Since bcrypt encrypts it, it must decrypt to compare.
        const compared_pass = await bcrypt.compare(password, user.password);
        if (!compared_pass) {
          return done(null, false, { message: "Incorrect password!" });
        } else {
          // Success! We can pass the user's data back to passport to serialize.
          return done(null, user);
        }
      });
    })
  );

  // From my understanding, this serializes whatever user data we want and adds it to the session cookie, to be retrieved later.
  passport.serializeUser(function (user, done) {
    // We serialize the user's ID for later.
    done(null, user.id);
  });

  // In a request, passport will deserialize based on the serialized key in session and get our user's data from our database.
  passport.deserializeUser(function (id, done) {
    // Take the key and get the user's data.
    login_model.findById(id, (err, user) => {
      const user_info = {
        // I'm only passing back the user's email to be used in the request. Maybe I should change that later.
        email: user.email,
      };
      done(err, user_info);
    });
  });
};

// Not used yet
// Two functions to check if the user is logged in.

// Used to check if the user is logged in, in order to access homepage.
const redirect_not_auth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  // If they are not, redirect to login.
  else res.redirect("/login");
};

// Used with login and register to redirect if they're already logged in.
const redirect_auth = (req, res, next) => {
  // If the user is logged in and tries to access login/register, redirect to main chat.
  if (req.isAuthenticated()) return res.redirect("/");
  else return next();
};

// Save the user into our mongoDB database
const save_user = async (req, res) => {
  try {
    // Check if the user is already in the database. If they are, no register!
    const existing_user = await login_model.find({ email: req.body.email });
    if (!existing_user[0]) {
      // if not, add them to the database
      const pass_hash = await bcrypt.hash(req.body.password, 10);

      // Add all inputs to the database, with our encrypted pass and a UUID for later
      const response = await login_model.create({
        username: req.body.name,
        email: req.body.email,
        password: pass_hash,
        uuid: uuidv4(),
      });

      // Send a success response to the frontend to redirect.
      console.log(`Document that was added =>`, response);
      return res
        .status(200)
        .json({ logged_in: true, message: "Successful register." })
        .send();
    } else {
      // Send back an error to let them know that it's already in the database
      return res
        .status(422)
        .json({
          logged_in: false,
          message: "An account with this email already exists.",
        })
        .send();
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ logged_in: false, message: `${err}` })
      .send();
  }
};

module.exports = {
  initialize_login,
  redirect_auth,
  redirect_not_auth,
  save_user,
};

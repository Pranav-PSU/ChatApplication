import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "../../auth/auth_inputs";
import axios from "axios";
import "./login.css"

const Login = () => {

  const history = useHistory();

  // useEffect(() => {
  //     axios
  //       .get("http://localhost:4001/chat/auth")
  //       .then((response) => {
  //         // if (response.status == 200) {
  //           console.log("200");
  //           return history.push("/");
  //         // }
  //       })
  //       .catch((err) => {
  //         // console.log(err);
  //       });
  // });

  // Using formik allows us to define a proper schema for each input in our body, and streamlines returning errors when an input is incorrect
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values, actions) => {
      // Post to login and authenticate user login inputs. 
      axios
        .post("http://localhost:4001/chat/login", values)
        .then((response) => {
          if (response.status == 200) {
            console.log(response);            // If logged in correctly, server responds with 200 and we can navigate user to home directory.
            return history.push("/");
          }
        })
        .catch((err) => {
          console.log(err.response.data);     // Otherwise, server passes back error message and we alert the user of it, reset form.
          alert(`${err.response.data.message}`);
          actions.resetForm();
        });
    },
  });

  return (
    <Container className="vh-100 vw-100 d-flex align-items-center justify-content-center">
      <Card className="w-50">
        <Card.Header className="p-4">
          <h1>Login</h1>
        </Card.Header>

        {/*The card body holds the entire form  */}
        <Card.Body className="p-4">
          {/* noValidate allows formik to have full control of validation */}
          <Form
            className="d-flex flex-column gap-3"
            noValidate
            onSubmit={formik.handleSubmit}
          >
            {/* Each form.control and feedback pair must be enclosed in a form.group in order for the feedback to be displayed correctly */}
            <Form.Group controlId="email">
              <Form.Label className="form-label">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formik.values.email}
                onChange={
                  formik.handleChange
                } /* Formik supplies onChange, onBlur, and onSubmit to handle what happens when the user interacts with inputs*/
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.email && formik.errors.email}
                isValid={formik.touched.email && !formik.errors.email}
                placeholder="Enter your email here."
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* controlID neatly assigns the proper ID to the label and input inside it! */}
            <Form.Group controlId="password">
              <Form.Label className="form-label">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && formik.errors.password}
                isValid={formik.touched.password && !formik.errors.password}
                placeholder="What is your password?"
              />
              <Form.Control.Feedback type="invalid">
                {/* The appropriate error is displayed whenever formik.errors has an error, and therefore isInvalid is true */}
                {formik.errors.password}{" "}
                {/* type ="invalid" ensures that this feedback is displayed on invalid input*/}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="d-flex gap-2 mt-4" controlId="buttons">
              <Button className="button"variant="primary" type="submit" size="lg">
                Submit
              </Button>
              {/* LinkContainer is required for react-router-bootstrap to work */}
              <LinkContainer to="/register">
                <Button className="button" variant="secondary" size="lg">
                  Register
                </Button>
              </LinkContainer>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;

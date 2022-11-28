import React from "react";
import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import { useFormik } from "formik";
const { registerSchema } = require("../auth_inputs");
const port = process.env.BACKEND_PORT || "3000";

const Register = () => {
  //Using formik allows us to define a proper schema for each input in our body, and streamlines returning errors when an input is incorrect
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: registerSchema,
    onSubmit: (values, actions) => {
      //The spread operator
      // const form_values = {...values}
      // console.log(values);
      fetch(`http://localhost:${port}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .catch((err) => {
          return;
        })
        .then((res) => {
          if (!res || !res.ok || res.status >= 400) return;
          return res.json();
        })
        .then((data) => {
          if (!data) return;
          // console.log(data);
        });
      actions.resetForm();
    },
  });

  return (
    <main className="">
      <Container className="vh-100 vw-100 d-flex align-items-center justify-content-center">
        <Card className="w-50">
          <Card.Header className = "p-4">
            <h1 className="">Register</h1>
          </Card.Header>

          {/*The card body holds the entire form  */}
          <Card.Body className="p-4">
            {/* noValidate allows formik to have full control of validation */}
            <Form className='d-flex flex-column gap-3 'noValidate onSubmit={formik.handleSubmit}>
              {/* Each form.control and feedback pair must be enclosed in a form.group in order for the feedback to be displayed correctly */}
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  name="name"
                  value={formik.values.name}
                  onChange={
                    formik.handleChange
                  } /* Formik supplies onChange, onBlur, and onSubmit to handle what happens when the user interacts with inputs*/
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.name && formik.errors.name}
                  isValid={formik.touched.name && !formik.errors.name}
                  placeholder="What is your name?"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
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
                <Form.Label>Password</Form.Label>
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

              <Form.Group className = "d-flex gap-2 mt-4"controlId="buttons">
                <Button variant="primary" type="submit" size="lg">
                  Submit
                </Button>
                {/* LinkContainer is required for react-router-bootstrap to work */}
                <LinkContainer to="/login">
                  <Button variant="secondary" size="lg">Login</Button>
                </LinkContainer>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
};

export default Register;

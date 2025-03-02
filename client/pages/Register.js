import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form submit handler
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:8080/api/v1/users/register", values);
      setLoading(false);

      if (data.success) {
        message.success("Registration Successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // ✅ Navigate to login page
        }, 2000);
      } else {
        message.error(data.message || "Registration Failed");
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Prevent logged-in users from accessing register page
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="auth-page">
      {loading && <Spinner />}
      <Form layout="vertical" onFinish={submitHandler}>
        <h1>Register Form</h1>
        <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
          <Input type="email" placeholder="Enter your email" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, min: 6, message: "Password must be at least 6 characters" }]}>
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <div className="d-flex justify-content-between">
          <Link to="/login">Already have an account? Login here</Link>
          <button className="btn btn-primary" type="submit">Register</button>
        </div>
      </Form>
    </div>
  );
};

export default Register;

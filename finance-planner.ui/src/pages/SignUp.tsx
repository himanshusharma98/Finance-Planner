import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { UserAddOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import api from "../services/api";

const { Title, Text } = Typography;

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await api.post("/auth/register", {
                username: values.username,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword, // ✅ add this line
            });
            message.success("🎉 Registration successful! Please login.");
            navigate("/login");
        } catch (err: any) {
            message.error(err.response?.data || "Registration failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#f0f2f5",
                padding: 16,
            }}
        >
            <Card
                style={{ width: 450, boxShadow: "0 0 20px rgba(0,0,0,0.05)" }}
                bordered={false}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3}>📝 Sign Up for Finance Planner</Title>
                    <Text type="secondary">Create a free account to get started</Text>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: "Username is required" }]}
                    >
                        <Input prefix={<UserAddOutlined />} placeholder="Choose a username" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Please enter a valid email" },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="you@example.com" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: "Password is required" }]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Create a password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            { required: true, message: "Please confirm your password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Re-enter password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Sign Up
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                        <Text type="secondary">
                            Already have an account?{" "}
                            <Link to="/login">Login</Link>
                        </Text>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SignUp;

import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
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
                confirmPassword: values.confirmPassword,
            });
            message.success("User registered successfully!");
            navigate("/login");
        } catch (err: any) {
            message.error(err.response?.data || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0f2f5"
        }}>
            <Card
                style={{ maxWidth: 450, width: "100%", boxShadow: "0 2px 15px rgba(0,0,0,0.1)" }}
                bordered={false}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>Sign Up</Title>
                    <Text type="secondary">Create your account to continue</Text>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: "Username is required" }]}
                    >
                        <Input placeholder="e.g. john_doe" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Invalid email address" }
                        ]}
                    >
                        <Input placeholder="e.g. john@example.com" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: "Password is required" }]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Create a password" size="large" />
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
                        <Input.Password placeholder="Confirm your password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Text type="secondary">Already have an account? </Text>
                    <a onClick={() => navigate("/login")}>Log in</a>
                </div>
            </Card>
        </div>
    );
};

export default SignUp;

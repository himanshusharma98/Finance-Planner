import React from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            const res = await api.post("/auth/login", {
                username: values.username,
                password: values.password,
            });

            localStorage.setItem("token", res.data.token);
            message.success("Login successful!");
            navigate("/dashboard");
            window.location.reload(); // Refresh to reset protected route logic
        } catch (err: any) {
            message.error(err.response?.data || "Login failed");
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
                style={{ maxWidth: 400, width: "100%", boxShadow: "0 2px 15px rgba(0,0,0,0.1)" }}
                bordered={false}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>Login</Title>
                    <Text type="secondary">Welcome back! Please enter your credentials.</Text>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "Username is required" }]}
                    >
                        <Input placeholder="Enter your username" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Password is required" }]}
                    >
                        <Input.Password placeholder="Enter your password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Text type="secondary">Don't have an account? </Text>
                    <a onClick={() => navigate("/signup")}>Sign up</a>
                </div>
            </Card>
        </div>
    );
};

export default Login;

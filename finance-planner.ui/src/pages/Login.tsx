import React from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../services/api";

const { Title, Text } = Typography;

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            const res = await api.post("/auth/login", {
                username: values.username,
                password: values.password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.username);
            message.success("🎉 Login successful!");
            onLogin();
            navigate("/dashboard");
        } catch (err: any) {
            message.error(err.response?.data || "Login failed");
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
                style={{ width: 400, boxShadow: "0 0 20px rgba(0,0,0,0.05)" }}
                bordered={false}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3}>🔐 Login to Finance Planner</Title>
                    <Text type="secondary">Welcome back! Please enter your credentials</Text>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: "Please enter your username" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: "Please enter your password" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                        <Text type="secondary">
                            Don't have an account?{" "}
                            <Link to="/signup">Sign Up</Link>
                        </Text>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;

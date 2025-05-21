import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    Progress,
    Row,
    Typography,
    message,
    Divider,
    Space,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    AimOutlined,
    FundOutlined,
} from "@ant-design/icons";
import api from "../services/api";
import EditSavingGoal from "./EditSavingGoal";

const { Title, Text } = Typography;

export interface SavingGoal {
    id: number;
    username: string;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "Active" | "Completed";
}

const SavingGoal: React.FC = () => {
    const [goals, setGoals] = useState<SavingGoal[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);
    const [form] = Form.useForm(); // 🔁 Used to reset form

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const res = await api.get("/savinggoals");
            setGoals(res.data);
        } catch {
            message.error("Failed to fetch saving goals.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddGoal = async (values: any) => {
        try {
            await api.post("/savinggoals", {
                ...values,
                status: "Active",
            });
            message.success("🎯 Goal added successfully!");
            form.resetFields(); // ✅ Clear form after success
            fetchGoals();
        } catch {
            message.error("❌ Failed to add goal. Please try again.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/savinggoals/${id}`);
            message.success("🗑️ Goal deleted.");
            fetchGoals();
        } catch {
            message.error("❌ Failed to delete goal.");
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <div style={{ padding: "32px", maxWidth: 1300, margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
                🎯 Savings Goals Tracker
            </Title>

            <Row gutter={24}>
                {/* ➕ Add Goal Form */}
                <Col xs={24} md={10}>
                    <Card
                        title={
                            <Space>
                                <AimOutlined /> Create New Goal
                            </Space>
                        }
                        bordered={false}
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
                    >
                        <Form layout="vertical" form={form} onFinish={handleAddGoal}>
                            <Form.Item
                                name="title"
                                label="Goal Title"
                                rules={[{ required: true, message: "Title is required" }]}
                            >
                                <Input placeholder="e.g. Europe Vacation" />
                            </Form.Item>

                            <Form.Item
                                name="targetAmount"
                                label="Target Amount (₹)"
                                rules={[{ required: true, message: "Target amount is required" }]}
                            >
                                <InputNumber min={100} style={{ width: "100%" }} placeholder="e.g. 50000" />
                            </Form.Item>

                            <Form.Item
                                name="savedAmount"
                                label="Amount Already Saved (₹)"
                                rules={[{ required: true, message: "Saved amount is required" }]}
                            >
                                <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 5000" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" icon={<PlusOutlined />} htmlType="submit" block>
                                    Add Goal
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* 🧾 Existing Goals Display */}
                <Col xs={24} md={14}>
                    <Row gutter={[16, 16]}>
                        {goals.map((goal) => (
                            <Col xs={24} key={goal.id}>
                                <Card
                                    hoverable
                                    title={
                                        <Space>
                                            <FundOutlined />
                                            {goal.title}
                                        </Space>
                                    }
                                    style={{ borderRadius: 10 }}
                                    extra={
                                        <Space>
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() => setEditingGoal(goal)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                danger
                                                onClick={() => handleDelete(goal.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Space>
                                    }
                                >
                                    <Text>Status: <strong>{goal.status}</strong></Text>
                                    <br />
                                    <Text>
                                        Saved: <strong>₹{goal.savedAmount}</strong> of ₹{goal.targetAmount}
                                    </Text>
                                    <Progress
                                        percent={Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)}
                                        status={goal.status === "Completed" ? "success" : "active"}
                                        strokeColor={goal.status === "Completed" ? "#52c41a" : "#1890ff"}
                                        style={{ marginTop: 8 }}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            {editingGoal && (
                <EditSavingGoal
                    goal={editingGoal}
                    onClose={() => setEditingGoal(null)}
                    onUpdated={fetchGoals}
                />
            )}
        </div>
    );
};

export default SavingGoal;

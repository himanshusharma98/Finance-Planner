import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Progress,
    Row,
    Typography,
    message,
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
import dayjs from "dayjs";

const { Title, Text } = Typography;

export interface SavingGoal {
    id: number;
    username: string;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "Active" | "Completed";
    targetDate?: string;
}

const SavingGoal: React.FC = () => {
    const [goals, setGoals] = useState<SavingGoal[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);
    const [form] = Form.useForm();

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
            const payload = {
                ...values,
                status: "Active",
                targetDate: values.targetDate ? values.targetDate.format("YYYY-MM-DD") : null,
            };
            await api.post("/savinggoals", payload);
            message.success("🎯 Goal added successfully!");
            form.resetFields();
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
                {/* ➕ Create New Goal Form */}
                <Col xs={24} md={10}>
                    <Card title={<Space><AimOutlined /> Create New Goal</Space>} bordered={false}>
                        <Form layout="vertical" form={form} onFinish={handleAddGoal}>
                            <Form.Item
                                name="title"
                                label="Goal Title"
                                rules={[{ required: true, message: "Please enter a goal title" }]}
                            >
                                <Input placeholder="e.g. Buy a Car" />
                            </Form.Item>

                            <Form.Item
                                name="targetAmount"
                                label="Target Amount (₹)"
                                rules={[{ required: true, message: "Please enter the target amount" }]}
                            >
                                <InputNumber min={100} style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                name="savedAmount"
                                label="Saved Amount (₹)"
                                rules={[{ required: true, message: "Please enter the saved amount" }]}
                            >
                                <InputNumber min={0} style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item name="targetDate" label="Target Date">
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block icon={<PlusOutlined />}>
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
                                    title={<Space><FundOutlined /> {goal.title}</Space>}
                                    extra={
                                        <Space>
                                            <Button icon={<EditOutlined />} size="small" onClick={() => setEditingGoal(goal)}>Edit</Button>
                                            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(goal.id)}>Delete</Button>
                                        </Space>
                                    }
                                >
                                    <Text>Status: <strong>{goal.status}</strong></Text><br />
                                    <Text>Saved: <strong>₹{goal.savedAmount}</strong> of ₹{goal.targetAmount}</Text><br />
                                    {goal.targetDate && (
                                        <Text>Target Date: <strong>{dayjs(goal.targetDate).format("DD MMM YYYY")}</strong></Text>
                                    )}
                                    <Progress
                                        percent={Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)}
                                        status={goal.status === "Completed" ? "success" : "active"}
                                        style={{ marginTop: 8 }}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            {/* ✏️ Edit Modal */}
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

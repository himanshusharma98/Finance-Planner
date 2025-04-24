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
    Select,
    message,
    Typography,
} from "antd";
import api from "../services/api";
import EditSavingGoal from "./EditSavingGoal";

const { Title } = Typography;
const { Option } = Select;

export interface SavingGoal {
    id: number;
    username: string;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "Active" | "Completed";
}

const SavingGoalPage: React.FC = () => {
    const [goals, setGoals] = useState<SavingGoal[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const res = await api.get("/savinggoals");
            setGoals(res.data);
        } catch {
            message.error("Failed to fetch saving goals");
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
            message.success("Goal added successfully");
            fetchGoals();
        } catch {
            message.error("Failed to add goal");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/savinggoals/${id}`);
            message.success("Goal deleted");
            fetchGoals();
        } catch {
            message.error("Failed to delete goal");
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>💰 Saving Goals Tracker</Title>

            <Row gutter={24}>
                <Col xs={24} md={10}>
                    <Card title="🎯 Add New Goal" bordered>
                        <Form layout="vertical" onFinish={handleAddGoal}>
                            <Form.Item name="title" label="Goal Title" rules={[{ required: true }]}>
                                <Input placeholder="e.g. Vacation to Goa" />
                            </Form.Item>
                            <Form.Item name="targetAmount" label="Target Amount" rules={[{ required: true }]}>
                                <InputNumber min={100} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="savedAmount" label="Amount Saved So Far" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Add Goal
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={14}>
                    <Row gutter={[16, 16]}>
                        {goals.map((goal) => (
                            <Col span={24} key={goal.id}>
                                <Card
                                    title={`${goal.title}`}
                                    extra={
                                        <>
                                            <Button size="small" onClick={() => setEditingGoal(goal)}>
                                                Edit
                                            </Button>
                                            <Button
                                                danger
                                                size="small"
                                                onClick={() => handleDelete(goal.id)}
                                                style={{ marginLeft: 8 }}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    }
                                >
                                    <p>Status: {goal.status}</p>
                                    <p>Saved: ₹{goal.savedAmount} / ₹{goal.targetAmount}</p>
                                    <Progress
                                        percent={Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)}
                                        status={goal.status === "Completed" ? "success" : "active"}
                                        strokeColor={goal.status === "Completed" ? "#52c41a" : undefined}
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

export default SavingGoalPage;

import React, { useEffect, useState } from "react";
import {
    Card,
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    DatePicker,
    message,
    Table,
    Popconfirm,
    Typography,
    Row,
    Col,
    Space,
} from "antd";
import api from "../services/api";
import { RecurringTransaction } from "../types/recurringTransaction";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

const RecurringTransactionPage: React.FC = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<RecurringTransaction[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/recurringtransaction");
            setData(res.data);
        } catch {
            message.error("Failed to fetch recurring transactions");
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        try {
            await api.post("/recurringtransaction", {
                ...values,
                startDate: values.startDate.format("YYYY-MM-DD"),
                endDate: values.endDate?.format("YYYY-MM-DD"),
            });
            message.success("✅ Recurring transaction created");
            form.resetFields();
            fetchData();
        } catch {
            message.error("❌ Failed to create recurring transaction");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/recurringtransaction/${id}`);
            message.success("🗑️ Deleted successfully");
            fetchData();
        } catch {
            message.error("❌ Delete failed");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
                🔁 Manage Recurring Transactions
            </Title>

            <Row gutter={32}>
                {/* Form */}
                <Col xs={24} md={10}>
                    <Card
                        title="➕ Create New Recurring"
                        bordered={false}
                        bodyStyle={{ padding: 24 }}
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
                    >
                        <Form layout="vertical" form={form} onFinish={onFinish}>
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[{ required: true, message: "Please enter a title" }]}
                            >
                                <Input placeholder="e.g. Rent, Netflix, Salary" />
                            </Form.Item>

                            <Form.Item
                                name="amount"
                                label="Amount"
                                rules={[{ required: true, message: "Please enter the amount" }]}
                            >
                                <InputNumber min={1} style={{ width: "100%" }} prefix="₹" />
                            </Form.Item>

                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[{ required: true, message: "Please enter a category" }]}
                            >
                                <Input placeholder="e.g. Subscription, Salary" />
                            </Form.Item>

                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[{ required: true, message: "Please select a type" }]}
                            >
                                <Select placeholder="Select transaction type">
                                    <Option value="Income">Income</Option>
                                    <Option value="Expense">Expense</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="frequency"
                                label="Frequency"
                                rules={[{ required: true, message: "Please select a frequency" }]}
                            >
                                <Select placeholder="How often?">
                                    <Option value="Daily">Daily</Option>
                                    <Option value="Weekly">Weekly</Option>
                                    <Option value="Monthly">Monthly</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="startDate"
                                label="Start Date"
                                rules={[{ required: true, message: "Please select a start date" }]}
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item name="endDate" label="End Date (Optional)">
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Add Recurring Transaction
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Table */}
                <Col xs={24} md={14}>
                    <Card
                        title="📅 Existing Recurring Transactions"
                        bordered={false}
                        bodyStyle={{ padding: 24 }}
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
                    >
                        <Table
                            loading={loading}
                            dataSource={data}
                            rowKey="id"
                            pagination={{ pageSize: 6 }}
                            columns={[
                                { title: "Title", dataIndex: "title" },
                                {
                                    title: "Amount",
                                    dataIndex: "amount",
                                    render: (amt: number) => `₹${amt}`,
                                },
                                { title: "Category", dataIndex: "category" },
                                { title: "Frequency", dataIndex: "frequency" },
                                {
                                    title: "Start",
                                    dataIndex: "startDate",
                                    render: (d: string) => dayjs(d).format("DD MMM, YYYY"),
                                },
                                {
                                    title: "Action",
                                    render: (_, record) => (
                                        <Popconfirm
                                            title="Are you sure to delete?"
                                            onConfirm={() => handleDelete(record.id!)}
                                        >
                                            <Button danger size="small">
                                                Delete
                                            </Button>
                                        </Popconfirm>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RecurringTransactionPage;

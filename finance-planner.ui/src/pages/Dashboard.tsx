import axios from "axios";
import { useState, useEffect } from "react";
import { baseURL } from "../services/api";
import { Transaction } from "../types/transaction";
import {
    Table,
    Button,
    Input,
    Card,
    Typography,
    message,
    Space,
    Select,
    DatePicker,
    Form,
    Row,
    Col,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const Dashboard = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>({
        title: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
        type: "Expense",
        notes: "",
    });
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Transaction[]>(`${baseURL}/transactions`);
            setTransactions(response.data);
        } catch (error) {
            message.error("Error fetching transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const addTransaction = async () => {
        if (
            !newTransaction.title.trim() ||
            newTransaction.amount <= 0 ||
            !newTransaction.category.trim()
        ) {
            message.error("Please fill in all fields correctly.");
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/transactions`, newTransaction);

            if (response.status === 201 || response.status === 200) {
                message.success("Transaction added successfully");
                await fetchTransactions();
                setNewTransaction({
                    title: "",
                    amount: 0,
                    category: "",
                    date: new Date().toISOString().split("T")[0],
                    type: "Expense",
                    notes: "",
                });
            } else {
                message.error("Failed to add transaction.");
            }
        } catch (error: any) {
            console.error("Add Error:", error);
            message.error(
                error.response?.data?.message || "An unexpected error occurred."
            );
        }
    };

    const deleteTransaction = async (id: number) => {
        try {
            await axios.delete(`${baseURL}/transactions/${id}`);
            message.success("Transaction deleted successfully");
            await fetchTransactions();
        } catch (error) {
            message.error("Error deleting transaction");
        }
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => `₹${amount}`,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Transaction) => (
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteTransaction(record.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
                Finance Dashboard
            </Title>

            <Card style={{ marginBottom: "20px", padding: "20px" }}>
                <Form layout="vertical" onFinish={addTransaction}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Title" required>
                                <Input
                                    placeholder="Enter title"
                                    value={newTransaction.title}
                                    onChange={(e) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Amount" required>
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={newTransaction.amount}
                                    onChange={(e) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            amount: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Category" required>
                                <Input
                                    placeholder="Enter category"
                                    value={newTransaction.category}
                                    onChange={(e) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            category: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Type" required>
                                <Select
                                    value={newTransaction.type}
                                    onChange={(value) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            type: value,
                                        })
                                    }
                                >
                                    <Option value="Income">Income</Option>
                                    <Option value="Expense">Expense</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Date" required>
                                <DatePicker
                                    value={
                                        newTransaction.date
                                            ? dayjs(newTransaction.date)
                                            : null
                                    }
                                    onChange={(date) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            date: date
                                                ? date.format("YYYY-MM-DD")
                                                : "",
                                        })
                                    }
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item label="Notes">
                                <Input
                                    placeholder="Enter notes"
                                    value={newTransaction.notes}
                                    onChange={(e) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            notes: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<PlusOutlined />}
                                block
                            >
                                Add Transaction
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card>
                <Table
                    dataSource={transactions}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    bordered
                />
            </Card>
        </div>
    );
};

export default Dashboard;

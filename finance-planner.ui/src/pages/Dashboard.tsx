import axios from "axios";
import { useState, useEffect } from "react";
import { baseURL } from "../services/api";
import { Transaction } from "../types/transaction";
import EditTransactionModal from "../pages/EditTransactionModal";
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
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Transaction[]>(`${baseURL}/transactions`);
            setTransactions(response.data);
        } catch (error) {
            message.error("Unable to load transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const addTransaction = async () => {
        const { title, amount, category } = newTransaction;

        if (!title.trim()) {
            return message.error("Title is required.");
        }
        if (!category.trim()) {
            return message.error("Category is required.");
        }
        if (amount <= 0) {
            return message.error("Amount must be greater than zero.");
        }

        try {
            const response = await axios.post(`${baseURL}/transactions`, newTransaction);
            if (response.status === 201 || response.status === 200) {
                message.success("Transaction added successfully.");
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
            message.error(error.response?.data?.message || "Something went wrong.");
        }
    };

    const deleteTransaction = async (id: number) => {
        try {
            await axios.delete(`${baseURL}/transactions/${id}`);
            message.success("Transaction deleted.");
            await fetchTransactions();
        } catch {
            message.error("Failed to delete transaction.");
        }
    };

    const columns = [
        { title: "Title", dataIndex: "title", key: "title" },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => `₹${amount}`,
        },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Type", dataIndex: "type", key: "type" },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        { title: "Notes", dataIndex: "notes", key: "notes" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Transaction) => (
                <Space>
                    <Button
                        onClick={() => {
                            setEditTransaction(record);
                            setEditModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteTransaction(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
            <Title level={2}>💼 Finance Dashboard</Title>

            <Row gutter={24}>
                <Col xs={24} md={10}>
                    <Card title="➕ Add Transaction" bordered style={{ height: "100%" }}>
                        <Form layout="vertical" onFinish={addTransaction}>
                            <Form.Item label="Title" required>
                                <Input
                                    placeholder="e.g. Grocery, Rent"
                                    value={newTransaction.title}
                                    onChange={(e) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>

                            <Form.Item label="Amount" required>
                                <Input
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={newTransaction.amount}
                                    onChange={(e) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            amount: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                />
                            </Form.Item>

                            <Form.Item label="Category" required>
                                <Input
                                    placeholder="e.g. Bills, Food"
                                    value={newTransaction.category}
                                    onChange={(e) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            category: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>

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

                            <Form.Item label="Date" required>
                                <DatePicker
                                    style={{ width: "100%" }}
                                    value={
                                        newTransaction.date
                                            ? dayjs(newTransaction.date)
                                            : null
                                    }
                                    onChange={(date) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            date: date ? date.format("YYYY-MM-DD") : "",
                                        })
                                    }
                                />
                            </Form.Item>

                            <Form.Item label="Notes">
                                <Input.TextArea
                                    placeholder="Optional notes"
                                    value={newTransaction.notes}
                                    onChange={(e) =>
                                        setNewTransaction({
                                            ...newTransaction,
                                            notes: e.target.value.slice(0, 250),
                                        })
                                    }
                                    showCount
                                    maxLength={250}
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<PlusOutlined />}
                                    block
                                >
                                    Add Transaction
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={14}>
                    <Card title="📃 Recent Transactions" bordered bodyStyle={{ padding: 16 }}>
                        <Table
                            dataSource={transactions}
                            columns={columns}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 5 }}
                            scroll={{ x: "max-content" }}
                            bordered
                        />
                    </Card>
                </Col>
            </Row>

            <EditTransactionModal
                open={editModalVisible}
                transaction={editTransaction}
                onClose={() => {
                    setEditModalVisible(false);
                    setEditTransaction(null);
                }}
                onUpdate={fetchTransactions}
            />
        </div>
    );
};

export default Dashboard;

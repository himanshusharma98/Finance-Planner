import {
    Modal,
    Input,
    Select,
    DatePicker,
    message,
    Form,
    Typography,
    Divider,
} from "antd";
import { Transaction } from "../types/transaction";
import dayjs from "dayjs";
import axios from "axios";
import { baseURL } from "../services/api";
import { useState, useEffect } from "react";

const { Option } = Select;
const { Title, Text } = Typography;

interface Props {
    open: boolean;
    transaction: Transaction | null;
    onClose: () => void;
    onUpdate: () => void;
}

const EditTransactionModal = ({ open, transaction, onClose, onUpdate }: Props) => {
    const [updatedTransaction, setUpdatedTransaction] = useState<Transaction | null>(transaction);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setUpdatedTransaction(transaction);
    }, [transaction]);

    const handleUpdate = async () => {
        if (!updatedTransaction) return;

        setSaving(true);
        try {
            await axios.put(`${baseURL}/transactions/${updatedTransaction.id}`, updatedTransaction);
            message.success("✅ Transaction updated successfully");
            onUpdate();
            onClose();
        } catch (error) {
            message.error("❌ Failed to update transaction. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>✏️ Edit Transaction</Title>}
            open={open}
            onCancel={onClose}
            onOk={handleUpdate}
            okText="Update"
            cancelText="Cancel"
            confirmLoading={saving}
            centered
            maskClosable={false}
            destroyOnClose
        >
            <Divider style={{ margin: "12px 0" }} />

            <Form layout="vertical">
                <Form.Item label="Title" required>
                    <Input
                        placeholder="Enter transaction title"
                        value={updatedTransaction?.title}
                        onChange={(e) =>
                            setUpdatedTransaction((prev) => ({ ...prev!, title: e.target.value }))
                        }
                    />
                </Form.Item>

                <Form.Item label="Amount (₹)" required>
                    <Input
                        type="number"
                        placeholder="Enter amount"
                        value={updatedTransaction?.amount}
                        onChange={(e) =>
                            setUpdatedTransaction((prev) => ({
                                ...prev!,
                                amount: parseFloat(e.target.value) || 0,
                            }))
                        }
                    />
                </Form.Item>

                <Form.Item label="Category" required>
                    <Input
                        placeholder="e.g. Rent, Food, Salary"
                        value={updatedTransaction?.category}
                        onChange={(e) =>
                            setUpdatedTransaction((prev) => ({ ...prev!, category: e.target.value }))
                        }
                    />
                </Form.Item>

                <Form.Item label="Type" required>
                    <Select
                        value={updatedTransaction?.type}
                        onChange={(value) =>
                            setUpdatedTransaction((prev) => ({ ...prev!, type: value }))
                        }
                    >
                        <Option value="Income">Income</Option>
                        <Option value="Expense">Expense</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Date" required>
                    <DatePicker
                        allowClear
                        style={{ width: "100%" }}
                        value={updatedTransaction?.date ? dayjs(updatedTransaction.date) : null}
                        onChange={(date) =>
                            setUpdatedTransaction((prev) => ({
                                ...prev!,
                                date: date ? date.format("YYYY-MM-DD") : "",
                            }))
                        }
                    />
                </Form.Item>

                <Form.Item label="Notes">
                    <Input.TextArea
                        placeholder="Optional notes (max 250 characters)"
                        value={updatedTransaction?.notes}
                        onChange={(e) =>
                            setUpdatedTransaction((prev) => ({
                                ...prev!,
                                notes: e.target.value.slice(0, 250),
                            }))
                        }
                        showCount
                        maxLength={250}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>
            </Form>

            <Text type="secondary" style={{ fontSize: "12px" }}>
                Please double-check before saving your changes.
            </Text>
        </Modal>
    );
};

export default EditTransactionModal;

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
import api from "../services/api";
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
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        if (transaction) {
            form.setFieldsValue({
                ...transaction,
                date: transaction.date ? dayjs(transaction.date) : null,
            });
            setIsChanged(false);
        }
    }, [transaction, form]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                title: values.title,
                amount: values.amount,
                category: values.category,
                type: values.type,
                date: values.date ? values.date.format("YYYY-MM-DD") : "",
                notes: values.notes,
            };

            setSaving(true);
            await api.put(`/transactions/${transaction?.id}`, payload);
            message.success("✅ Transaction updated successfully");
            onUpdate();
            onClose();
        } catch (error) {
            message.error("❌ Failed to update transaction. Please check the inputs.");
        } finally {
            setSaving(false);
        }
    };

    const checkIfChanged = (_, allValues: any) => {
        if (!transaction) return;
        const changed =
            transaction.title !== allValues.title ||
            transaction.amount !== allValues.amount ||
            transaction.category !== allValues.category ||
            transaction.type !== allValues.type ||
            dayjs(transaction.date).format("YYYY-MM-DD") !== allValues.date?.format("YYYY-MM-DD") ||
            transaction.notes !== allValues.notes;

        setIsChanged(changed);
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
            okButtonProps={{ disabled: !isChanged }}
        >
            <Divider style={{ margin: "12px 0" }} />

            <Form layout="vertical" form={form} onValuesChange={checkIfChanged}>
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: "Title is required" }]}
                >
                    <Input placeholder="Enter transaction title" />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Amount (₹)"
                    rules={[{ required: true, message: "Amount is required" }]}
                >
                    <Input type="number" placeholder="Enter amount" />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: "Category is required" }]}
                >
                    <Input placeholder="e.g. Rent, Food, Salary" />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true, message: "Transaction type is required" }]}
                >
                    <Select placeholder="Select type">
                        <Option value="Income">Income</Option>
                        <Option value="Expense">Expense</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Date"
                    rules={[{ required: true, message: "Date is required" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="notes" label="Notes">
                    <Input.TextArea
                        placeholder="Optional notes (max 250 characters)"
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

import React, { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    message,
    Typography,
    Divider,
    Space,
} from "antd";
import { SavingGoal } from "./SavingGoal";
import api from "../services/api";
import {
    EditOutlined,
    DollarCircleOutlined,
    CheckCircleOutlined,
    FlagOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

interface Props {
    goal: SavingGoal;
    onClose: () => void;
    onUpdated: () => void;
}

const EditSavingGoal: React.FC<Props> = ({ goal, onClose, onUpdated }) => {
    const [form] = Form.useForm();
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        if (goal) {
            form.setFieldsValue({
                ...goal,
                targetDate: goal.targetDate ? dayjs(goal.targetDate) : null,
            });
            setIsChanged(false);
        }
    }, [goal, form]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const updatedGoal = {
                ...values,
                targetDate: values.targetDate ? values.targetDate.format("YYYY-MM-DD") : null,
            };

            await api.put(`/savinggoals/${goal.id}`, updatedGoal);
            message.success("🎯 Goal updated successfully");
            onUpdated();
            onClose();
        } catch {
            message.error("❌ Failed to update goal");
        }
    };

    const handleFormChange = (_: any, allValues: any) => {
        const changed =
            allValues.title !== goal.title ||
            allValues.targetAmount !== goal.targetAmount ||
            allValues.savedAmount !== goal.savedAmount ||
            allValues.status !== goal.status ||
            (goal.targetDate
                ? !dayjs(goal.targetDate).isSame(allValues.targetDate, "day")
                : !!allValues.targetDate);

        setIsChanged(changed);
    };

    return (
        <Modal
            open={true}
            title={
                <Space>
                    <EditOutlined />
                    <Title level={4} style={{ margin: 0 }}>
                        Edit Saving Goal
                    </Title>
                </Space>
            }
            onCancel={onClose}
            onOk={handleUpdate}
            okText="Update"
            cancelText="Cancel"
            okButtonProps={{ disabled: !isChanged }}
            destroyOnClose
            maskClosable={false}
        >
            <Divider style={{ margin: "12px 0 24px" }} />

            <Form
                layout="vertical"
                form={form}
                onValuesChange={handleFormChange}
            >
                <Form.Item
                    name="title"
                    label="Goal Title"
                    rules={[{ required: true, message: "Please enter a title" }]}
                >
                    <Input prefix={<FlagOutlined />} placeholder="e.g. Buy a New Laptop" />
                </Form.Item>

                <Form.Item
                    name="targetAmount"
                    label="Target Amount (₹)"
                    rules={[{ required: true, message: "Please enter target amount" }]}
                >
                    <InputNumber
                        min={100}
                        style={{ width: "100%" }}
                        prefix={<DollarCircleOutlined />}
                        placeholder="Enter your goal target"
                    />
                </Form.Item>

                <Form.Item
                    name="savedAmount"
                    label="Saved So Far (₹)"
                    rules={[{ required: true, message: "Please enter saved amount" }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        prefix={<DollarCircleOutlined />}
                        placeholder="Amount saved so far"
                    />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Goal Status"
                    rules={[{ required: true, message: "Please select a status" }]}
                >
                    <Select placeholder="Select goal status">
                        <Option value="Active">
                            <span style={{ color: "#1890ff" }}>Active</span>
                        </Option>
                        <Option value="Completed">
                            <span style={{ color: "#52c41a" }}>Completed</span>
                        </Option>
                    </Select>
                </Form.Item>

                <Form.Item name="targetDate" label="Target Date">
                    <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Select due date"
                        suffixIcon={<CalendarOutlined />}
                    />
                </Form.Item>
            </Form>

            <Text type="secondary" style={{ fontSize: 12 }}>
                ✅ You can only update when changes are detected.
            </Text>
        </Modal>
    );
};

export default EditSavingGoal;

import React, { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
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
} from "@ant-design/icons";

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
            form.setFieldsValue(goal);
            setIsChanged(false);
        }
    }, [goal, form]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            await api.put(`/savinggoals/${goal.id}`, values);
            message.success("🎯 Goal updated successfully");
            onUpdated();
            onClose();
        } catch (error) {
            message.error("❌ Failed to update goal");
        }
    };

    const handleFormChange = (_: any, allValues: any) => {
        const changed =
            allValues.title !== goal.title ||
            allValues.targetAmount !== goal.targetAmount ||
            allValues.savedAmount !== goal.savedAmount ||
            allValues.status !== goal.status;

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
                initialValues={goal}
                onValuesChange={handleFormChange}
            >
                <Form.Item name="title" label="Goal Title" rules={[{ required: true }]}>
                    <Input prefix={<FlagOutlined />} placeholder="e.g. Buy a New Laptop" />
                </Form.Item>

                <Form.Item name="targetAmount" label="Target Amount (₹)" rules={[{ required: true }]}>
                    <InputNumber
                        min={100}
                        style={{ width: "100%" }}
                        prefix={<DollarCircleOutlined />}
                        placeholder="Enter your goal target"
                    />
                </Form.Item>

                <Form.Item name="savedAmount" label="Saved So Far (₹)" rules={[{ required: true }]}>
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        prefix={<DollarCircleOutlined />}
                        placeholder="Amount saved so far"
                    />
                </Form.Item>

                <Form.Item name="status" label="Goal Status" rules={[{ required: true }]}>
                    <Select placeholder="Select goal status">
                        <Option value="Active">
                            <span style={{ color: "#1890ff" }}>Active</span>
                        </Option>
                        <Option value="Completed">
                            <span style={{ color: "#52c41a" }}>Completed</span>
                        </Option>
                    </Select>
                </Form.Item>
            </Form>

            <Text type="secondary" style={{ fontSize: 12 }}>
                ✅ You can only update when there are changes. Be sure to double-check before saving!
            </Text>
        </Modal>
    );
};

export default EditSavingGoal;

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { SavingGoal } from "./SavingGoal";
import api from "../services/api";

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
            setIsChanged(false); // reset change detection
        }
    }, [goal, form]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            await api.put(`/savinggoals/${goal.id}`, values);
            message.success("Goal updated successfully");
            onUpdated();
            onClose();
        } catch (error) {
            message.error("Failed to update goal");
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
            title={`Edit Goal: ${goal.title}`}
            onCancel={onClose}
            onOk={handleUpdate}
            okText="Update"
            cancelText="Cancel"
            destroyOnClose
            okButtonProps={{ disabled: !isChanged }}
        >
            <Form
                layout="vertical"
                form={form}
                initialValues={goal}
                onValuesChange={handleFormChange}
            >
                <Form.Item name="title" label="Goal Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="targetAmount" label="Target Amount" rules={[{ required: true }]}>
                    <InputNumber min={100} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="savedAmount" label="Saved Amount" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="status" label="Goal Status" rules={[{ required: true }]}>
                    <Select>
                        <Option value="Active">Active</Option>
                        <Option value="Completed">Completed</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditSavingGoal;

import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, Select, Typography, message, Divider } from "antd";
import api from "../services/api";
import { useTheme } from "../themes/ThemeContext";

const { Title } = Typography;
const { Option } = Select;

const UserProfile: React.FC = () => {
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<any>({});

    const username = localStorage.getItem("username") || "";
    const { theme } = useTheme(); // used to persist theme with update

    useEffect(() => {
        if (!username) {
            message.error("Username not found. Please login again.");
            return;
        }

        setLoading(true);
        api.get(`/user/profile?username=${username}`)
            .then((res) => {
                profileForm.setFieldsValue(res.data);
                setInitialValues(res.data);
            })
            .catch(() => message.error("Failed to load profile"))
            .finally(() => setLoading(false));
    }, [username]);

    const handleProfileUpdate = async () => {
        try {
            const values = await profileForm.validateFields();
            const hasChanged =
                values.email !== initialValues.email ||
                values.preferredCurrency !== initialValues.preferredCurrency;

            if (!hasChanged) {
                message.info("No changes made to the profile.");
                return;
            }

            await api.put(`/user/update?username=${username}`, {
                ...values,
                theme,
            });

            message.success("✅ Profile updated");
            setInitialValues({ ...values, theme });
        } catch {
            message.error("❌ Failed to update profile");
        }
    };

    const handlePasswordChange = async () => {
        const { currentPassword, newPassword } = passwordForm.getFieldsValue();

        if (!currentPassword || !newPassword) {
            message.warning("Please enter both current and new passwords.");
            return;
        }

        try {
            await api.put(`/user/change-password?username=${username}`, {
                currentPassword,
                newPassword,
            });
            message.success("🔐 Password changed");
            passwordForm.resetFields();
        } catch (err: any) {
            message.error(err.response?.data || "❌ Password update failed");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 32 }}>
            <Card title={<Title level={4}>👤 User Profile</Title>} loading={loading} bordered>
                {/* ✅ Profile Update Form */}
                <Form layout="vertical" form={profileForm}>
                    <Form.Item label="Username" name="username">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Email is required" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Preferred Currency"
                        name="preferredCurrency"
                        rules={[{ required: true, message: "Please select a currency" }]}
                    >
                        <Select placeholder="Select currency">
                            <Option value="₹">₹ INR</Option>
                            <Option value="$">$ USD</Option>
                            <Option value="€">€ EUR</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={handleProfileUpdate} block>
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>

                <Divider />

                {/* ✅ Password Change Form */}
                <Title level={5}>🔐 Change Password</Title>
                <Form layout="vertical" form={passwordForm}>
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: "Enter current password" }]}
                    >
                        <Input.Password placeholder="Current password" />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[{ required: true, message: "Enter new password" }]}
                    >
                        <Input.Password placeholder="New password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="dashed" onClick={handlePasswordChange} block>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UserProfile;

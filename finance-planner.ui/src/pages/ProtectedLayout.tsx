﻿import { Layout, Menu } from "antd";
import {
    PieChartOutlined,
    DashboardOutlined,
    LogoutOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import MainLayout from "../pages/layouts/MainLayout"; // ✅ Import MainLayout

const { Sider } = Layout;

const ProtectedLayout = ({ onLogout }: { onLogout: () => void }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                        lineHeight: "32px",
                    }}
                >
                    Finance Planner
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
                    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="analytics" icon={<PieChartOutlined />}>
                        <Link to="/analytics">Analytics</Link>
                    </Menu.Item>
                    <Menu.Item key="saving-goals" icon={<DollarOutlined />}>
                        <Link to="/saving-goals">Saving Goals</Link>
                    </Menu.Item>
                    <Menu.Item key="/recurring-transactions" icon={<ClockCircleOutlined />}>
                        <Link to="/recurring-transactions">Recurring Trans.</Link>
                    </Menu.Item>
                    <Menu.Item key="calendar" icon={<CalendarOutlined />}>
                        <Link to="/calendar">Calendar</Link>
                    </Menu.Item>
                    <Menu.Item key="profile" icon={<UserOutlined />}>
                        <Link to="/profile">Profile</Link>
                    </Menu.Item>
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Logout
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Wrap outlet in main layout to show header and footer */}
            <MainLayout>
                <Outlet />
            </MainLayout>
        </Layout>
    );
};

export default ProtectedLayout;

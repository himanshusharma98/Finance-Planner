import { Layout, Menu } from "antd";
import {
    PieChartOutlined,
    DashboardOutlined,
    LogoutOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

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
                    💰 Planner
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
                    <Menu.Item key="/recurring-transactions" icon={<ClockCircleOutlined />}> {/* ✅ */}
                        <Link to="/recurring-transactions">Recurring Trans.</Link>
                    </Menu.Item>
                    <Menu.Item key="calendar" icon={<CalendarOutlined />}>
                        <Link to="/calendar">Calendar</Link>
                    </Menu.Item>
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Logout
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: "#fff", padding: 0 }} />
                <Content style={{ margin: "24px 16px 0" }}>
                    <div style={{ padding: 24, minHeight: 360 }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProtectedLayout;

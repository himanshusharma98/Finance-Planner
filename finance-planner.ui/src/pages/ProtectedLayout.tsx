// ProtectedLayout.tsx
import React from "react";
import { Layout, Menu } from "antd";
import {
    DashboardOutlined,
    BarChartOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const ProtectedLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = (key: string) => {
        if (key === "logout") {
            onLogout();
            navigate("/login");
        } else {
            navigate(`/${key}`);
        }
    };

    const selectedKey = location.pathname.replace("/", "") || "dashboard";

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <div className="logo" style={{ color: "#fff", textAlign: "center", padding: "16px", fontWeight: "bold" }}>
                    💰 Planner
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={(e) => handleMenuClick(e.key)}
                    items={[
                        { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
                        { key: "analytics", icon: <BarChartOutlined />, label: "Analytics" },
                        { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ background: "#fff", padding: 0 }} />
                <Content style={{ margin: "16px" }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProtectedLayout;

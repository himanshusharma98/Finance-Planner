import React from "react";
import { Layout } from "antd";
import { Typography } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
    return (
        <Header
            style={{
                background: "#001529", // Matches dark sidebar
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
        >
            {/* Logo & App Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <DollarCircleOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <Title level={4} style={{ margin: 0, color: "#fff" }}>
                    Finance Planner
                </Title>
            </div>

            {/* Right-side space (e.g., user name or logout) */}
            {/* Add items here if needed in the future */}
            <div></div>
        </Header>
    );
};

export default AppHeader;

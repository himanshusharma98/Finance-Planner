import React from "react";
import { Layout } from "antd";
import { Typography } from "antd";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
    return (
        <Header
            style={{
                background: "#001529",
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
                <img
                    src="https://ik.imagekit.io/pzh1tjej22d/Finance%20Planner%20Logo/logo_xnVTbUffJF.png?updatedAt=1750766745531
"
                    alt="Logo"
                    style={{ height: "28px", objectFit: "contain" }}
                />
                <Title level={4} style={{ margin: 0, color: "#fff" }}>
                    Finance Planner
                </Title>
            </div>

            {/* Right-side space */}
            <div></div>
        </Header>
    );
};

export default AppHeader;
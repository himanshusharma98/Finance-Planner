import React from "react";
import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter: React.FC = () => {
    return (
        <Footer
            style={{
                textAlign: "center",
                background: "#001529", // Matches the sidebar
                padding: "16px 24px",
                color: "#fff",
            }}
        >
            <Text style={{ color: "#ccc" }}>
                © {new Date().getFullYear()} Finance Planner · All rights reserved
            </Text>
        </Footer>
    );
};

export default AppFooter;

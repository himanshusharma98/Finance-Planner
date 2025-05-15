import React from "react";
import { Layout } from "antd";
import AppHeader from "./Header";
import AppFooter from "./Footer";

const { Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <AppHeader />
            <Content style={{ margin: "24px", padding: "24px", background: "#fff" }}>
                {children}
            </Content>
            <AppFooter />
        </Layout>
    );
};

export default MainLayout;

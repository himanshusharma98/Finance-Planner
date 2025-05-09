import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../services/api";
import {
    Card,
    Col,
    Row,
    Statistic,
    Typography,
    Divider,
    Spin,
    Select,
    DatePicker,
    Space,
    message,
    Switch,
} from "antd";
import dayjs from "dayjs";
import { Chart } from "react-google-charts";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Analytics = () => {
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[any, any] | null>(null);
    const [loading, setLoading] = useState(true);

    const [is3D, setIs3D] = useState(() => {
        const stored = localStorage.getItem("analytics_3d_mode");
        return stored === null ? true : stored === "true";
    });

    const handle3DToggle = (checked: boolean) => {
        setIs3D(checked);
        localStorage.setItem("analytics_3d_mode", String(checked));
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            message.error("Unauthorized. Please login.");
            window.location.href = "/login";
            return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        loadAllCategories();
        fetchAnalytics();
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [selectedCategory, dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);

        const baseParams: any = {};
        if (dateRange?.[0] && dateRange?.[1]) {
            baseParams.startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
            baseParams.endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");
        }

        const summaryParams = { ...baseParams };
        if (selectedCategory && selectedCategory !== "") {
            summaryParams.category = selectedCategory;
        }

        try {
            const [summaryRes, categoryRes, trendRes] = await Promise.all([
                axios.get(`${baseURL}/analytics/summary`, { params: summaryParams }),
                axios.get(`${baseURL}/analytics/category-summary`, { params: baseParams }),
                axios.get(`${baseURL}/analytics/monthly-trend`, { params: summaryParams }),
            ]);

            setSummary(summaryRes.data);
            setCategoryData(categoryRes.data);

            const groupedTrend: { [key: string]: any } = {};
            trendRes.data.forEach((item: any) => {
                const label = `${item.month}/${item.year}`;
                if (!groupedTrend[label]) groupedTrend[label] = { label, income: 0, expense: 0 };
                groupedTrend[label][item.type.toLowerCase()] = item.total;
            });

            setMonthlyTrend(Object.values(groupedTrend));
        } catch (err) {
            console.error("Analytics fetch error", err);
            message.error("Error fetching analytics data.");
        } finally {
            setLoading(false);
        }
    };

    const loadAllCategories = async () => {
        try {
            const res = await axios.get(`${baseURL}/transactions`);
            const unique = Array.from(new Set(res.data.map((t: any) => t.category)));
            setAllCategories(unique);
        } catch (err) {
            console.error("Category fetch error");
            message.error("Error loading categories.");
        }
    };

    const pieChartData = [
        ["Category", "Amount"],
        ...categoryData.map((item) => [item.category, item.total]),
    ];

    const lineChartData = [
        ["Month", "Income", "Expense"],
        ...monthlyTrend.map((item) => [item.label, item.income || 0, item.expense || 0]),
    ];

    return (
        <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
                📊 Finance Analytics Dashboard
                <Switch
                    style={{ marginLeft: 16 }}
                    checkedChildren="3D"
                    unCheckedChildren="2D"
                    checked={is3D}
                    onChange={handle3DToggle}
                />
            </Title>

            <Card style={{ marginBottom: 24 }} bordered={false} bodyStyle={{ padding: 16 }}>
                <Space size="middle" wrap>
                    <Select
                        allowClear
                        placeholder="Filter by category"
                        value={selectedCategory}
                        onChange={(val) => setSelectedCategory(val)}
                        style={{ width: 220 }}
                    >
                        {allCategories.map((cat) => (
                            <Option key={cat} value={cat}>
                                {cat}
                            </Option>
                        ))}
                    </Select>

                    <RangePicker onChange={(range) => setDateRange(range as any)} allowClear />
                </Space>
            </Card>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: 100 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Row gutter={24} style={{ marginBottom: 32 }}>
                        <Col xs={24} md={8}>
                            <Card bordered style={{ borderLeft: "5px solid #3f8600" }}>
                                <Statistic
                                    title="Total Income"
                                    value={summary.income}
                                    prefix="₹"
                                    valueStyle={{ color: "#3f8600" }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card bordered style={{ borderLeft: "5px solid #cf1322" }}>
                                <Statistic
                                    title="Total Expense"
                                    value={summary.expense}
                                    prefix="₹"
                                    valueStyle={{ color: "#cf1322" }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card bordered style={{ borderLeft: "5px solid #2f54eb" }}>
                                <Statistic
                                    title="Balance"
                                    value={summary.balance}
                                    prefix="₹"
                                    valueStyle={{ color: "#2f54eb" }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Divider style={{ margin: "32px 0" }} />

                    <Row gutter={32}>
                        <Col xs={24} md={12}>
                            <Card title="📎 Category-wise Expenses" hoverable>
                                <Chart
                                    chartType="PieChart"
                                    data={pieChartData}
                                    options={{ is3D: is3D }}
                                    width="100%"
                                    height="300px"
                                />
                            </Card>
                        </Col>

                        <Col xs={24} md={12}>
                            <Card title="📅 Monthly Income vs Expense" hoverable>
                                <Chart
                                    chartType="LineChart"
                                    data={lineChartData}
                                    options={{
                                        is3D: is3D,
                                        legend: { position: "bottom" },
                                        curveType: "function",
                                    }}
                                    width="100%"
                                    height="300px"
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default Analytics;

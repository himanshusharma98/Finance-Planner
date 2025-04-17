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
} from "antd";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#82ca9d', '#f39c12', '#9b59b6'];

const Analytics = () => {
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
    const [allCategories, setAllCategories] = useState<string[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[any, any] | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);

        const baseParams: any = {};
        if (dateRange) {
            baseParams.startDate = dateRange[0]?.format("YYYY-MM-DD");
            baseParams.endDate = dateRange[1]?.format("YYYY-MM-DD");
        }

        const summaryParams = { ...baseParams };
        if (selectedCategory) summaryParams.category = selectedCategory;

        try {
            const [summaryRes, categoryRes, trendRes] = await Promise.all([
                axios.get(`${baseURL}/analytics/summary`, { params: summaryParams }),
                axios.get(`${baseURL}/analytics/category-summary`, { params: baseParams }),
                axios.get(`${baseURL}/analytics/monthly-trend`, { params: summaryParams })
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
            console.error("Error fetching analytics", err);
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
            console.error("Error loading categories");
        }
    };

    useEffect(() => {
        loadAllCategories();
        fetchAnalytics();
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [selectedCategory, dateRange]);

    return (
        <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
                📊 Finance Analytics Dashboard
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

                    <RangePicker
                        onChange={(range) => setDateRange(range as any)}
                        allowClear
                    />
                </Space>
            </Card>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: 100 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
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

                    {/* Charts */}
                    <Row gutter={32}>
                        <Col xs={24} md={12}>
                            <Card title="📎 Category-wise Expenses" hoverable>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            dataKey="total"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {categoryData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        <Col xs={24} md={12}>
                            <Card title="📅 Monthly Income vs Expense" hoverable>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="label" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="income"
                                            stroke="#36A2EB"
                                            name="Income"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expense"
                                            stroke="#FF6384"
                                            name="Expense"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default Analytics;

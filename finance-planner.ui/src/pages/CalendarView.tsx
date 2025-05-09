import React, { useEffect, useState } from "react";
import {
    Typography,
    Row,
    Col,
    Card,
    Badge,
    Tooltip,
    List,
    Divider,
    theme as antdTheme,
} from "antd";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import api from "../services/api";

const { Title, Text } = Typography;

interface EventItem {
    title: string;
    date: string;
    color?: string;
    details?: string;
}

const CalendarView: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const { token: themeToken } = antdTheme.useToken();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const [txnRes, goalRes] = await Promise.all([
                    api.get("/transactions"),
                    api.get("/savinggoals"),
                ]);

                const transactions = txnRes.data;
                const goals = goalRes.data;

                const txnEvents: EventItem[] = transactions.map((txn: any) => ({
                    title: `${txn.type === "Expense" ? "🟥" : "🟩"} ₹${txn.amount} - ${txn.category}`,
                    date: txn.date,
                    color: txn.type === "Expense" ? "#ff4d4f" : "#52c41a",
                    details: `Type: ${txn.type}\nCategory: ${txn.category}\nAmount: ₹${txn.amount}\nDate: ${txn.date}`,
                }));

                const goalEvents: EventItem[] = goals.map((goal: any) => ({
                    title: `🎯 ${goal.title} Due`,
                    date: goal.targetDate,
                    color: "#1890ff",
                    details: `Goal: ${goal.title}\nTarget Amount: ₹${goal.targetAmount}\nDue: ${goal.targetDate}`,
                }));

                setEvents([...txnEvents, ...goalEvents]);
            } catch (error) {
                console.error("Error fetching calendar data:", error);
            }
        };

        fetchEvents();
    }, []);

    const getEventsForDate = (date: Dayjs) => {
        return events.filter(
            (event) => dayjs(event.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
        );
    };

    const dateCellRender = (date: Dayjs) => {
        const dayEvents = getEventsForDate(date);

        return (
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                {dayEvents.map((event, index) => (
                    <li key={index}>
                        <Tooltip title={event.title}>
                            <Badge color={event.color} />
                        </Tooltip>
                    </li>
                ))}
            </ul>
        );
    };

    const onSelect = (date: Dayjs) => {
        setSelectedDate(date);
    };

    const selectedDayEvents = getEventsForDate(selectedDate);

    return (
        <div style={{ padding: "32px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
                📅 Calendar View
            </Title>

            <Row gutter={32}>
                <Col xs={24} md={14}>
                    <Card
                        title="Select a Date"
                        bordered
                        style={{ borderRadius: 8, backgroundColor: themeToken.colorBgContainer }}
                    >
                        <Calendar
                            fullscreen={true}
                            value={selectedDate}
                            onSelect={onSelect}
                            dateCellRender={dateCellRender}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={10}>
                    <Card
                        title={`Transactions & Saving Goals



                        on ${selectedDate.format("DD MMM YYYY")}`}
                        bordered
                        style={{ borderRadius: 8, minHeight: 450 }}
                    >
                        {selectedDayEvents.length > 0 ? (
                            <List
                                itemLayout="vertical"
                                dataSource={selectedDayEvents}
                                renderItem={(event, idx) => (
                                    <List.Item key={idx}>
                                        <List.Item.Meta
                                            title={<Text style={{ color: event.color }}>{event.title}</Text>}
                                            description={event.details?.split("\n").map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))}
                                        />
                                        <Divider style={{ margin: "12px 0" }} />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text type="secondary">No transactions or goals for this date.</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CalendarView;

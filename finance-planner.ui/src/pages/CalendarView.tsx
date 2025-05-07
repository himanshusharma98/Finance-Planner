import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Tooltip,
    Badge,
    useTheme,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, DateCalendar, PickersDayProps } from '@mui/x-date-pickers';
import { format, isSameDay } from 'date-fns';
import api from '../services/api';

interface EventItem {
    title: string;
    date: string;
    color?: string;
    details?: string;
}

const CalendarView: React.FC = () => {
    const theme = useTheme();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const [txnRes, goalRes] = await Promise.all([
                    api.get('/transactions'),
                    api.get('/savinggoals'),
                ]);

                const transactions = txnRes.data;
                const goals = goalRes.data;

                const txnEvents: EventItem[] = transactions.map((txn: any) => ({
                    title: `${txn.type === 'Expense' ? '🟥' : '🟩'} ₹${txn.amount} - ${txn.category}`,
                    date: txn.date,
                    color: txn.type === 'Expense' ? theme.palette.error.main : theme.palette.success.main,
                    details: `Type: ${txn.type}\nCategory: ${txn.category}\nAmount: ₹${txn.amount}\nDate: ${txn.date}`,
                }));

                const goalEvents: EventItem[] = goals.map((goal: any) => ({
                    title: `🎯 ${goal.title} Due`,
                    date: goal.targetDate,
                    color: theme.palette.primary.main,
                    details: `Goal: ${goal.title}\nTarget Amount: ₹${goal.targetAmount}\nDue: ${goal.targetDate}`,
                }));

                setEvents([...txnEvents, ...goalEvents]);
            } catch (error) {
                console.error('Error loading events:', error);
            }
        };

        loadEvents();
    }, [theme]);

    const isValidDate = (date: string) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
    };

    const filteredEvents = events.filter((event) => {
        return isValidDate(event.date) && isSameDay(new Date(event.date), selectedDate);
    });

    const renderDay = (
        day: Date,
        _value: Date | null,
        DayComponentProps: PickersDayProps<Date>
    ) => {
        const formattedDay = format(day, 'yyyy-MM-dd');
        const dayEvents = events.filter((event) => {
            if (!isValidDate(event.date)) return false;
            return format(new Date(event.date), 'yyyy-MM-dd') === formattedDay;
        });

        const hasEvent = dayEvents.length > 0;

        return (
            <Tooltip
                title={
                    hasEvent ? (
                        <Box>
                            {dayEvents.map((e, i) => (
                                <Typography
                                    key={i}
                                    variant="caption"
                                    style={{ color: e.color || '#555' }}
                                >
                                    {e.title}
                                </Typography>
                            ))}
                        </Box>
                    ) : ''
                }
                arrow
                placement="top"
            >
                <Badge
                    overlap="circular"
                    color="secondary"
                    variant={hasEvent ? 'dot' : undefined}
                >
                    <PickersDay {...DayComponentProps} />
                </Badge>
            </Tooltip>
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                p: 4,
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    minWidth: 320,
                    borderRadius: 3,
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    📅 Calendar
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateCalendar
                        value={selectedDate}
                        onChange={(newDate) => newDate && setSelectedDate(newDate)}
                        slotProps={{
                            day: (ownerState) => ({
                                ...ownerState,
                                children: renderDay(ownerState.day, selectedDate, ownerState),
                            }),
                        }}
                    />
                </LocalizationProvider>
            </Paper>

            <Paper
                elevation={4}
                sx={{
                    flex: 1,
                    p: 3,
                    minHeight: 400,
                    borderRadius: 3,
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Trabsactions & Goals on {format(selectedDate, 'dd MMM yyyy')}
                </Typography>

                {filteredEvents.length > 0 ? (
                    <List>
                        {filteredEvents.map((event, idx) => (
                            <React.Fragment key={idx}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <span style={{ color: event.color || theme.palette.text.primary }}>
                                                {event.title}
                                            </span>
                                        }
                                        secondary={
                                            event.details?.split('\n').map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No transactions or goals for this date.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default CalendarView;

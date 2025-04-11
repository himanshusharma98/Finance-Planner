import { useEffect, useState } from "react";
import axios from "axios";
import { Transaction } from "../Types/transaction";
import {
    Box,
    Button,
    Input,
    Typography,
    Card,
    CardContent,
    IconButton,
    Modal,
    Select,
    Option
} from "@mui/joy";

// Axios instance configuration
const api = axios.create({
    baseURL: "https://localhost:7079/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const Dashboard = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>({
        title: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
        type: "Expense",
        notes: "",
    });
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch transactions
    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<Transaction[]>("/transactions");
            setTransactions(response.data);
        } catch (err) {
            setError("Failed to fetch transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Add a new transaction
    const addTransaction = async () => {
        setLoading(true);
        try {
            await api.post("/transactions", newTransaction);
            await fetchTransactions();
            setNewTransaction({
                title: "",
                amount: 0,
                category: "",
                date: new Date().toISOString().split("T")[0],
                type: "Expense",
                notes: "",
            });
        } catch (err) {
            setError("Failed to add transaction.");
        } finally {
            setLoading(false);
        }
    };

    // Delete a transaction
    const deleteTransaction = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        setLoading(true);
        try {
            await api.delete(`/transactions/${id}`);
            await fetchTransactions();
        } catch (err) {
            setError("Failed to delete transaction.");
        } finally {
            setLoading(false);
        }
    };

    // Update a transaction
    const updateTransaction = async () => {
        if (!editTransaction) return;
        setLoading(true);
        try {
            await api.put(`/transactions/${editTransaction.id}`, editTransaction);
            await fetchTransactions();
            setEditTransaction(null);
        } catch (err) {
            setError("Failed to update transaction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
            <Typography level="h1" sx={{ mb: 3 }}>
                Finance Dashboard
            </Typography>

            {error && <Typography color="danger" sx={{ mb: 2 }}>{error}</Typography>}

            {/* Add new transaction */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
                <Input placeholder="Title" value={newTransaction.title} onChange={(e) =>
                    setNewTransaction({ ...newTransaction, title: e.target.value })} />
                <Input type="number" placeholder="Amount" value={newTransaction.amount} onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })} />
                <Input placeholder="Category" value={newTransaction.category} onChange={(e) =>
                    setNewTransaction({ ...newTransaction, category: e.target.value })} />
                <Select value={newTransaction.type} onChange={(e, value) =>
                    setNewTransaction({ ...newTransaction, type: value as "Income" | "Expense" })}>
                    <Option value="Income">Income</Option>
                    <Option value="Expense">Expense</Option>
                </Select>
                <Button onClick={addTransaction} disabled={loading}>
                    {loading ? "Adding..." : "Add"}
                </Button>
            </Box>

            {/* Transactions List */}
            {transactions.length === 0 && !loading && <Typography>No transactions yet.</Typography>}
            {loading && <Typography>Loading...</Typography>}

            {transactions.map((txn) => (
                <Card key={txn.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography level="h3">{txn.title}</Typography>
                        <Typography level="body2">
                            ₹{txn.amount} • {txn.category} • {txn.type} • {new Date(txn.date).toLocaleDateString()}
                        </Typography>
                        {txn.notes && <Typography level="body2">Note: {txn.notes}</Typography>}
                    </CardContent>
                    <Box sx={{ display: "flex", gap: 1, p: 2 }}>
                        <Button variant="outlined" onClick={() => setEditTransaction(txn)}>Edit</Button>
                        <Button color="danger" onClick={() => deleteTransaction(txn.id)}>Delete</Button>
                    </Box>
                </Card>
            ))}

            {/* Edit Modal */}
            {editTransaction && (
                <Modal open onClose={() => setEditTransaction(null)}>
                    <Box sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8, bgcolor: "background.surface", borderRadius: 2 }}>
                        <Typography level="h2" sx={{ mb: 2 }}>Edit Transaction</Typography>
                        <Input placeholder="Title" value={editTransaction.title} onChange={(e) =>
                            setEditTransaction({ ...editTransaction, title: e.target.value })} sx={{ mb: 2 }} />
                        <Input type="number" placeholder="Amount" value={editTransaction.amount} onChange={(e) =>
                            setEditTransaction({ ...editTransaction, amount: parseFloat(e.target.value) || 0 })} sx={{ mb: 2 }} />
                        <Input placeholder="Category" value={editTransaction.category} onChange={(e) =>
                            setEditTransaction({ ...editTransaction, category: e.target.value })} sx={{ mb: 2 }} />
                        <Select value={editTransaction.type} onChange={(e, value) =>
                            setEditTransaction({ ...editTransaction, type: value as "Income" | "Expense" })} sx={{ mb: 2 }}>
                            <Option value="Income">Income</Option>
                            <Option value="Expense">Expense</Option>
                        </Select>
                        <Input placeholder="Notes" value={editTransaction.notes || ""} onChange={(e) =>
                            setEditTransaction({ ...editTransaction, notes: e.target.value })} sx={{ mb: 2 }} />
                        <Button onClick={updateTransaction} disabled={loading}>
                            {loading ? "Updating..." : "Update"}
                        </Button>
                    </Box>
                </Modal>
            )}
        </Box>
    );
};

export default Dashboard;

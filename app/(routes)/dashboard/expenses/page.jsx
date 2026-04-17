"use client"
import React, { useEffect, useState } from 'react'
import { FaTrashCan } from "react-icons/fa6";

const defaultExpenses = [
    { id: 1, name: "Lunch", amount: 200, date: "2026-04-17", category: "Food" },
    { id: 2, name: "Uber", amount: 150, date: "2026-04-16", category: "Travel" },
    { id: 3, name: "Groceries", amount: 500, date: "2026-04-15", category: "Food" }
];

const categoryColors = {
    Food: "bg-orange-500/20 text-orange-500",
    Travel: "bg-blue-500/20 text-blue-500",
    Other: "bg-gray-500/20 text-gray-400"
};

const ExpensesPage = () => {
    const [expensesList, setExpensesList] = useState([]);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    // Ensure we don't render localStorage mismatch on first hydration
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("expenses");
        if (saved) {
            setExpensesList(JSON.parse(saved));
        } else {
            setExpensesList(defaultExpenses);
            localStorage.setItem("expenses", JSON.stringify(defaultExpenses));
        }
    }, []);

    const addExpense = (e) => {
        e.preventDefault();
        if (!name || !amount) return;

        const newExpense = {
            id: Date.now(),
            name,
            amount: Number(amount),
            date: new Date().toISOString().split('T')[0],
            category
        };
        const updated = [newExpense, ...expensesList];
        setExpensesList(updated);
        localStorage.setItem("expenses", JSON.stringify(updated));
        console.log("Saved expenses:", localStorage.getItem("expenses"));
        setName("");
        setAmount("");
    };

    const deleteExpense = (id) => {
        const updated = expensesList.filter(e => e.id !== id);
        setExpensesList(updated);
        localStorage.setItem("expenses", JSON.stringify(updated));
    };

    const totalExpenses = expensesList.reduce((acc, curr) => acc + Number(curr.amount), 0);

    if (!mounted) return null; // Avoid hydration layout shift

    return (
        <div className="mt-16 md:mt-0 p-5 md:p-10 text-white min-h-screen">
            <h2 className="font-bold text-2xl md:text-3xl py-3 mb-4">All Expenses</h2>

            {/* Summary */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8 flex gap-10">
                <div>
                    <p className="text-zinc-400 text-sm mb-1">Total expenses</p>
                    <p className="text-3xl font-bold text-blue-400">₹{totalExpenses}</p>
                </div>
                <div>
                    <p className="text-zinc-400 text-sm mb-1">Count of entries</p>
                    <p className="text-3xl font-bold text-white">{expensesList.length}</p>
                </div>
            </div>

            {/* Add form */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8">
                <h3 className="font-semibold text-lg mb-4 text-zinc-200">Add New Expense</h3>
                <form onSubmit={addExpense} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-zinc-400 text-sm mb-1 block">Expense Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-blue-500" placeholder="e.g. Lunch" />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="text-zinc-400 text-sm mb-1 block">Amount (₹)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-blue-500" placeholder="e.g. 200" />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="text-zinc-400 text-sm mb-1 block">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-blue-500">
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors w-full md:w-auto h-[42px]">
                        Add
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-950">
                            <th className="p-3 border-b border-zinc-700 font-bold text-zinc-300">Name</th>
                            <th className="p-3 border-b border-zinc-700 font-bold text-zinc-300">Category</th>
                            <th className="p-3 border-b border-zinc-700 font-bold text-zinc-300">Amount</th>
                            <th className="p-3 border-b border-zinc-700 font-bold text-zinc-300">Date</th>
                            <th className="p-3 border-b border-zinc-700 font-bold text-zinc-300 w-20 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expensesList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-500">No expenses found.</td>
                            </tr>
                        ) : (
                            expensesList.map((exp) => (
                                <tr key={exp.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="p-3 border-b border-zinc-700 font-medium">{exp.name}</td>
                                    <td className="p-3 border-b border-zinc-700">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[exp.category] || categoryColors.Other}`}>
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td className="p-3 border-b border-zinc-700 font-medium">₹{exp.amount}</td>
                                    <td className="p-3 border-b border-zinc-700 text-zinc-400">{exp.date}</td>
                                    <td className="p-3 border-b border-zinc-700 text-center">
                                        <button onClick={() => deleteExpense(exp.id)} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                                            <FaTrashCan />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ExpensesPage

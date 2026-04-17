"use client"

import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import { db } from '@/utils/dbConfig';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budget/_components/BudgetItem';


function Page() {

    const user = { fullName: 'Guest', primaryEmailAddress: { emailAddress: 'test@example.com' } };

    const [budgetList, setBudgetList] = useState([]);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
        if (stored.length === 0) {
            setExpenses([
                { id: 1, name: "Lunch", amount: 200, date: "2026-04-17" }
            ]);
        } else {
            setExpenses(stored);
        }
    }, []);

    const handleDelete = (id) => {
        const updated = expenses.filter((e) => e.id !== id);
        setExpenses(updated);
        localStorage.setItem("expenses", JSON.stringify(updated));
    };

    useEffect(() => {
        user && getBudgetList();
    }, [user]);

    const getBudgetList = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sql`SUM(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress))
            .groupBy(Budgets.id)
            .orderBy(desc(Budgets.id));

        setBudgetList(result);
    }

    // useEffect(() => {
    //     console.log(expensesList);
    // }, [expensesList])

    return (
        <div className="mt-16 md:mt-0 text-white p-8">
            {user ?
                <div>
                    <h2 className="font-bold text-3xl">Hi, {user?.fullName}</h2>
                    <p className="text-gray-500">Here's what happening with your money, let's manage your expenses</p>
                </div> :
                <div>
                    <h2 className="w-[160px] p-2 h-[30px] rounded-lg bg-slate-800 animate-pulse"></h2>
                    <p className="w-[260px] mt-3 h-[20px] rounded-lg bg-slate-800 animate-pulse"></p>
                </div>
            }
            <CardInfo
                budgetList={budgetList}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 mt-10 gap-5">
                {user ?
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <BarChartDashboard
                            budgetList={budgetList}
                        />

                        <div className="flex flex-col gap-1 mt-2">
                            <h2 className="text-lg font-bold">Latest Expenses</h2>
                            <table className="w-full text-left mt-3">
                                <thead>
                                    <tr className="bg-slate-800 text-white font-bold">
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Amount</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((exp) => (
                                        <tr key={exp.id} className="border-b border-slate-800 bg-slate-900/50">
                                            <td className="p-3">{exp.name}</td>
                                            <td className="p-3">₹{exp.amount}</td>
                                            <td className="p-3">{exp.date}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleDelete(exp.id)}
                                                    className="text-red-400 font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div> :
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <div className="w-full h-[350px] bg-slate-800 rounded-lg animate-pulse"></div>
                        <div className="w-1/3 h-[20px] rounded-lg animate-pulse bg-slate-800"></div>
                        <div className="w-full h-[350px] bg-slate-800 rounded-lg animate-pulse"></div>
                    </div>
                }
                <div className="grid gap-3">
                    {user ?
                        <h2 className="font-bold text-lg">Latest Budgets</h2> :
                        <h2 className="w-1/2 h-[20px] rounded-lg animate-pulse bg-slate-800"></h2>
                    }
                    {user ?
                        budgetList.map((budget, index) => (
                            /** index < 4 && **/
                            <BudgetItem
                                budget={budget}
                                key={index}
                            />
                        )) :
                        [1, 2, 3, 4].map((index) => (
                            <div key={index} className="rounded-lg bg-slate-800 animate-pulse h-[150px]">

                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Page

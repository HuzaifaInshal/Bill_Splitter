"use client";
import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Users,
  Calculator,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

interface Expense {
  id: string;
  name: string;
  price: number;
  units: number;
}

interface Member {
  id: string;
  name: string;
  amount: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export default function BillSplitter() {
  const [activeTab, setActiveTab] = useState<"expenses" | "members">(
    "expenses"
  );
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", name: "", price: 0, units: 1 },
  ]);
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "", amount: 0 },
  ]);
  const [showReport, setShowReport] = useState(false);

  // Expense functions
  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now().toString(), name: "", price: 0, units: 1 },
    ]);
  };

  const removeExpense = (id: string) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((e) => e.id !== id));
    }
  };

  const updateExpense = (
    id: string,
    field: "name" | "price" | "units",
    value: string | number
  ) => {
    setExpenses(
      expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const getExpensesTotal = () => {
    return expenses.reduce(
      (sum, e) => sum + (Number(e.price) || 0) * (Number(e.units) || 0),
      0
    );
  };

  // Member functions
  const addMember = () => {
    setMembers([
      ...members,
      { id: Date.now().toString(), name: "", amount: 0 },
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const updateMember = (
    id: string,
    field: "name" | "amount",
    value: string | number
  ) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const getMembersTotal = () => {
    return members.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
  };

  const getDifference = () => {
    return getMembersTotal() - getExpensesTotal();
  };

  const canCalculate = () => {
    const hasValidExpenses = expenses.some((e) => e.name.trim() !== "");
    const hasValidMembers = members.some((m) => m.name.trim() !== "");
    const totalsMatch = Math.abs(getDifference()) < 0.01;
    return (
      hasValidExpenses &&
      hasValidMembers &&
      totalsMatch &&
      getExpensesTotal() > 0
    );
  };

  const calculateSettlements = (): Settlement[] => {
    const validMembers = members.filter((m) => m.name.trim() !== "");
    const total = getExpensesTotal();
    const perPerson = total / validMembers.length;

    const balances = validMembers.map((m) => ({
      name: m.name,
      balance: (Number(m.amount) || 0) - perPerson,
    }));

    const settlements: Settlement[] = [];
    const debtors = balances
      .filter((b) => b.balance < -0.01)
      .map((b) => ({ ...b }));
    const creditors = balances
      .filter((b) => b.balance > 0.01)
      .map((b) => ({ ...b }));

    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debt = Math.abs(debtors[i].balance);
      const credit = creditors[j].balance;
      const amount = Math.min(debt, credit);

      settlements.push({
        from: debtors[i].name,
        to: creditors[j].name,
        amount: Math.round(amount * 100) / 100,
      });

      debtors[i].balance += amount;
      creditors[j].balance -= amount;

      if (Math.abs(debtors[i].balance) < 0.01) i++;
      if (Math.abs(creditors[j].balance) < 0.01) j++;
    }

    return settlements;
  };

  const handleCalculate = () => {
    if (canCalculate()) {
      setShowReport(true);
    }
  };

  const handleBack = () => {
    setShowReport(false);
  };

  if (showReport) {
    const settlements = calculateSettlements();
    const total = getExpensesTotal();
    const validMembers = members.filter((m) => m.name.trim() !== "");
    const perPerson = total / validMembers.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Edit</span>
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Settlement Report
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Calculator className="w-5 h-5" />
                <p>Here's who owes whom</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900">
                    Rs.{total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Per Person</p>
                  <p className="text-3xl font-bold text-gray-900">
                    Rs.{perPerson.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Individual Contributions
              </h2>
              {validMembers.map((member) => {
                const balance = (Number(member.amount) || 0) - perPerson;
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">
                      {member.name}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Paid: Rs.{member.amount}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          balance >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {balance >= 0
                          ? `Gets back: Rs.${balance.toFixed(2)}`
                          : `Owes: Rs.${Math.abs(balance).toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {settlements.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Settlements
                </h2>
                <div className="space-y-3">
                  {settlements.map((settlement, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 p-4 rounded-lg"
                    >
                      <p className="text-gray-900">
                        <span className="font-semibold">{settlement.from}</span>
                        <span className="text-gray-600 mx-2">pays</span>
                        <span className="font-bold text-orange-600">
                          Rs.{settlement.amount}
                        </span>
                        <span className="text-gray-600 mx-2">to</span>
                        <span className="font-semibold">{settlement.to}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {settlements.length === 0 && (
              <div className="text-center p-8 bg-green-50 rounded-lg">
                <p className="text-green-700 font-medium">
                  ✓ All settled! Everyone paid their fair share.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const difference = getDifference();
  const expensesTotal = getExpensesTotal();
  const membersTotal = getMembersTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Bill Splitter
            </h1>
            <p className="text-gray-600">Split expenses fairly among friends</p>
          </div>

          {/* Status Display */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rs.{expensesTotal.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rs.{membersTotal.toFixed(2)}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-sm text-gray-600 mb-1">Difference</p>
                <p
                  className={`text-2xl font-bold ${
                    Math.abs(difference) < 0.01
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {difference >= 0 ? "+" : ""}Rs.{difference.toFixed(2)}
                </p>
              </div>
            </div>
            {Math.abs(difference) >= 0.01 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-red-600 font-medium">
                  {difference > 0
                    ? "⚠️ Paid amount exceeds expenses!"
                    : "⚠️ Expenses exceed paid amount!"}
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("expenses")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition border-b-2 ${
                activeTab === "expenses"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition border-b-2 ${
                activeTab === "members"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-5 h-5" />
              Members
            </button>
          </div>

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <div>
              <div className="space-y-4 mb-6">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Name
                        </label>
                        <input
                          type="text"
                          value={expense.name}
                          onChange={(e) =>
                            updateExpense(expense.id, "name", e.target.value)
                          }
                          placeholder="e.g., Pizza"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          value={expense.price || ""}
                          onChange={(e) =>
                            updateExpense(
                              expense.id,
                              "price",
                              Number(e.target.value)
                            )
                          }
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Units
                        </label>
                        <input
                          type="number"
                          value={expense.units || ""}
                          onChange={(e) =>
                            updateExpense(
                              expense.id,
                              "units",
                              Number(e.target.value)
                            )
                          }
                          placeholder="1"
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                    {expenses.length > 1 && (
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="mt-7 p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove expense"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addExpense}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                Add Expense
              </button>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div>
              <div className="space-y-4 mb-6">
                {members.map((member) => (
                  <div key={member.id} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            updateMember(member.id, "name", e.target.value)
                          }
                          placeholder="Enter name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount Paid
                        </label>
                        <input
                          type="number"
                          value={member.amount || ""}
                          onChange={(e) =>
                            updateMember(
                              member.id,
                              "amount",
                              Number(e.target.value)
                            )
                          }
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                    {members.length > 1 && (
                      <button
                        onClick={() => removeMember(member.id)}
                        className="mt-7 p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove member"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addMember}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                Add Member
              </button>
            </div>
          )}

          {/* Calculate Button */}
          <div className="mt-6">
            <button
              onClick={handleCalculate}
              disabled={!canCalculate()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-blue-500"
            >
              <Calculator className="w-5 h-5" />
              Calculate Split
            </button>
            {!canCalculate() && (
              <p className="text-sm text-gray-600 text-center mt-3">
                {Math.abs(difference) >= 0.01
                  ? "Totals must match to calculate split"
                  : "Add expenses and members to continue"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

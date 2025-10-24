import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Dashboard from "./components/Dashboard";
import BudgetSettings from "./components/BudgetSettings";
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingExpense, setEditingExpense] = useState(null);

  const API_BASE_URL = "https://knsqqj7143.execute-api.ap-south-1.amazonaws.com"; // 🟢 Replace with your actual API URL

  // ✅ Fetch Expenses from API Gateway
  const fetchExpenses = useCallback(async () => {
    try {
      const token = auth.user?.id_token;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, [auth.user?.id_token]);

  // ✅ Fetch Budget Limits from API Gateway
  const fetchBudgets = useCallback(async () => {
    try {
      const token = auth.user?.id_token;
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/budgets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBudgetLimits(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  }, [auth.user?.id_token]);

  // ✅ Initial Load
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchExpenses();
      fetchBudgets();
    }
  }, [auth.isAuthenticated, fetchExpenses, fetchBudgets]);

  // ✅ Add Expense (POST)
  const addExpense = async (expense) => {
    try {
      const token = auth.user.id_token;
      const newExpense = {
        ...expense,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };

      await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      setExpenses([newExpense, ...expenses]);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // ✅ Update Expense (PUT)
  const updateExpense = async (updatedExpense) => {
    try {
      const token = auth.user.id_token;
      await fetch(`${API_BASE_URL}/expenses/${updatedExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedExpense),
      });

      setExpenses(
        expenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
      );
      setEditingExpense(null);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  // ✅ Delete Expense (DELETE)
  const deleteExpense = async (id) => {
    try {
      const token = auth.user.id_token;
      await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // ✅ Update Budget Limit (POST)
  const updateBudgetLimit = async (category, limit) => {
    try {
      const token = auth.user.id_token;
      const updatedBudgets = { ...budgetLimits, [category]: parseFloat(limit) };

      await fetch(`${API_BASE_URL}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBudgets),
      });

      setBudgetLimits(updatedBudgets);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  // ✅ Sign out redirect
  const signOutRedirect = () => {
    const clientId = "49n44heamsp64gsnrohap7m3s";
    const logoutUri = window.location.origin;
    const cognitoDomain =
      "https://ap-south-1skr5vdpnc.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  // ✅ Render States
  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  if (!auth.isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Welcome to Personal Finance Tracker 💰</h2>
        <p>Sign in to view your dashboard and manage expenses.</p>
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-actions">
          <button onClick={() => signOutRedirect()} className="signout-btn">
            Sign Out
          </button>
        </div>
        <h1>💰 Personal Finance Tracker</h1>
        <p className="subtitle">
          Take control of your finances with smart budgeting and analytics
        </p>

        <nav className="nav-tabs">
          <button
            className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab ${activeTab === "add-expense" ? "active" : ""}`}
            onClick={() => setActiveTab("add-expense")}
          >
            ➕ Add Expense
          </button>
          <button
            className={`tab ${activeTab === "budget-settings" ? "active" : ""}`}
            onClick={() => setActiveTab("budget-settings")}
          >
            🎯 Budget Settings
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === "dashboard" && (
          <Dashboard expenses={expenses} budgetLimits={budgetLimits} />
        )}
        {activeTab === "add-expense" && (
          <div className="expenses-section">
            <ExpenseForm
              onAddExpense={addExpense}
              onUpdateExpense={updateExpense}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={deleteExpense}
              onEditExpense={setEditingExpense}
            />
          </div>
        )}
        {activeTab === "budget-settings" && (
          <BudgetSettings
            budgetLimits={budgetLimits}
            onUpdateBudgetLimit={updateBudgetLimit}
          />
        )}
      </main>
    </div>
  );
}

export default App;

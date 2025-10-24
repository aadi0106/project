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

  const API_BASE_URL = "https://knsqqj7143.execute-api.ap-south-1.amazonaws.com"; // 🟢 Your API Gateway URL

  // ✅ Fetch Expenses from API Gateway (DynamoDB)
  const fetchExpenses = useCallback(async () => {
    try {
      const token = auth.user?.id_token;
      if (!token) {
        console.log("No authentication token available");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/expenses`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpenses(data);
      console.log("Expenses fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      // Set empty array on error to prevent UI issues
      setExpenses([]);
    }
  }, [auth.user?.id_token]);

  // ✅ Fetch Budget Limits from API Gateway (DynamoDB)
  const fetchBudgets = useCallback(async () => {
    try {
      const token = auth.user?.id_token;
      if (!token) {
        console.log("No authentication token available");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/budgets`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBudgetLimits(data);
      console.log("Budgets fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      // Set empty object on error to prevent UI issues
      setBudgetLimits({});
    }
  }, [auth.user?.id_token]);

  // ✅ Initial Load
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchExpenses();
      fetchBudgets();
    }
  }, [auth.isAuthenticated, fetchExpenses, fetchBudgets]);

  // ✅ Add Expense (POST to DynamoDB)
  const addExpense = async (expense) => {
    try {
      const token = auth.user?.id_token;
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      const newExpense = {
        ...expense,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Expense added successfully:", result);
      
      // Update local state
      setExpenses([newExpense, ...expenses]);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  // ✅ Update Expense (PUT to DynamoDB)
  const updateExpense = async (updatedExpense) => {
    try {
      const token = auth.user?.id_token;
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/expenses/${updatedExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedExpense),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Expense updated successfully:", result);

      // Update local state
      setExpenses(
        expenses.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
      );
      setEditingExpense(null);
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense. Please try again.");
    }
  };

  // ✅ Delete Expense (DELETE from DynamoDB)
  const deleteExpense = async (id) => {
    try {
      const token = auth.user?.id_token;
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Expense deleted successfully:", result);

      // Update local state
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  // ✅ Update Budget Limit (POST to DynamoDB)
  const updateBudgetLimit = async (category, limit) => {
    try {
      const token = auth.user?.id_token;
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      const updatedBudgets = { ...budgetLimits, [category]: parseFloat(limit) };

      const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBudgets),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Budget updated successfully:", result);

      // Update local state
      setBudgetLimits(updatedBudgets);
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Failed to update budget. Please try again.");
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
  if (auth.isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Loading...</h2>
        <p>Please wait while we authenticate you.</p>
      </div>
    );
  }

  if (auth.error) {
    console.error("Authentication error:", auth.error);
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Authentication Error</h2>
        <p>Error: {auth.error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Welcome to Personal Finance Tracker 💰</h2>
        <p>Sign in to view your dashboard and manage expenses.</p>
        <button 
          onClick={() => {
            try {
              auth.signinRedirect();
            } catch (error) {
              console.error("Sign-in error:", error);
              alert("Sign-in failed. Please try again.");
            }
          }}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Sign in
        </button>
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

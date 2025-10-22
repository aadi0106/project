import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import BudgetSettings from './components/BudgetSettings';
import { useAuth } from 'react-oidc-context';

function App() {
  const auth = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudgets = localStorage.getItem('budgetLimits');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedBudgets) {
      setBudgetLimits(JSON.parse(savedBudgets));
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save budget limits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgetLimits', JSON.stringify(budgetLimits));
  }, [budgetLimits]);

  const addExpense = (expense) => {
    const newExpense = { ...expense, id: Date.now().toString(), timestamp: new Date().toISOString() };
    setExpenses([newExpense, ...expenses]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(exp => (exp.id === updatedExpense.id ? updatedExpense : exp)));
    setEditingExpense(null);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const updateBudgetLimit = (category, limit) => {
    setBudgetLimits({ ...budgetLimits, [category]: parseFloat(limit) });
  };

  const signOutRedirect = () => {
    const clientId = "49n44heamsp64gsnrohap7m3s";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://ap-south-1skr5vdpnc.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div>
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
        <button onClick={() => signOutRedirect()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Personal Finance Tracker</h1>
        <p className="subtitle">Welcome back, {auth.user?.profile.email}</p>
        <div className="header-actions">
          <button className="signout-btn" onClick={() => auth.removeUser()}>
            Sign Out
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'add-expense' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-expense')}
        >
          ➕ Add Expense
        </button>
        <button 
          className={`tab ${activeTab === 'budget-settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget-settings')}
        >
          ⚙️ Budget Settings
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard expenses={expenses} budgetLimits={budgetLimits} />
        )}
        {activeTab === 'add-expense' && (
          <ExpenseForm
            onAddExpense={addExpense}
            editingExpense={editingExpense}
            onUpdateExpense={updateExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />
        )}
        {activeTab === 'budget-settings' && (
          <BudgetSettings
            budgetLimits={budgetLimits}
            onUpdateBudgetLimit={updateBudgetLimit}
          />
        )}
        {activeTab !== 'dashboard' && (
          <div className="expenses-section">
            <ExpenseList
              expenses={expenses}
              onEditExpense={(expense) => setEditingExpense(expense)}
              onDeleteExpense={deleteExpense}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

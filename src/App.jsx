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

  // Debug authentication state
  useEffect(() => {
    console.log('Auth state:', {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      error: auth.error,
      user: auth.user
    });
    
    // Clear any existing auth errors on mount
    if (auth.error && auth.error.message.includes('No matching state found')) {
      console.log('Clearing auth state and retrying...');
      // Clear localStorage auth data
      localStorage.removeItem('oidc.user:https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_SkR5VDPNC:49n44heamsp64gsnrohap7m3s');
      localStorage.removeItem('oidc.state:https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_SkR5VDPNC:49n44heamsp64gsnrohap7m3s');
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.error, auth.user]);

  if (auth.isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        🔄 Loading...
      </div>
    );
  }

  if (auth.error) {
    console.error('Authentication error:', auth.error);
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>❌ Authentication Error</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          {auth.error.message || 'An authentication error occurred'}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Retry
          </button>
          <button 
            onClick={() => auth.signinRedirect()} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔑 Sign In Again
          </button>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          💰 Personal Finance Tracker
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9 }}>
          Take control of your finances with smart budgeting and expense tracking
        </p>
        <button 
          onClick={() => auth.signinRedirect()} 
          style={{
            padding: '15px 30px',
            fontSize: '1.1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🔑 Sign In to Continue
        </button>
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

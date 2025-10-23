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
    } else {
      // Add some sample data if no expenses exist
      const sampleExpenses = [
        {
          id: '1',
          amount: 45.50,
          category: 'Food & Dining',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          note: 'Lunch at restaurant',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          amount: 120.00,
          category: 'Transportation',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          note: 'Gas fill-up',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          amount: 89.99,
          category: 'Shopping',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          note: 'New shirt',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          amount: 25.00,
          category: 'Entertainment',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          note: 'Movie ticket',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setExpenses(sampleExpenses);
    }
    
    if (savedBudgets) {
      setBudgetLimits(JSON.parse(savedBudgets));
    } else {
      // Add some sample budget limits
      const sampleBudgets = {
        'Food & Dining': 500,
        'Transportation': 300,
        'Shopping': 200,
        'Entertainment': 150,
        'Bills & Utilities': 400
      };
      setBudgetLimits(sampleBudgets);
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
    // Get the current origin, handling both local development and Amplify deployment
    const getLogoutUri = () => {
      // For Amplify deployment, use the production domain
      if (window.location.hostname.includes('amplifyapp.com')) 
        {
        return window.location.origin;
      }
      // For local development
      return "http://localhost:3000";
    };
    const logoutUri = getLogoutUri();
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
        <div className="header-actions">
          <button onClick={() => auth.removeUser()} className="signout-btn">
            Sign Out
          </button>
        </div>
        <h1>💰 Personal Finance Tracker</h1>
        <p className="subtitle">Take control of your finances with smart budgeting and expense tracking</p>
        
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
            🎯 Budget Settings
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard expenses={expenses} budgetLimits={budgetLimits} />
        )}
        {activeTab === 'add-expense' && (
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
        {activeTab === 'budget-settings' && (
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

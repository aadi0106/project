import React, { useState } from 'react';
import './ExpenseList.css';

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills & Utilities': '💡',
      'Healthcare': '⚕️',
      'Education': '📚',
      'Travel': '✈️',
      'Other': '📦'
    };
    return emojiMap[category] || '📦';
  };

  const filteredExpenses = expenses.filter(exp => {
    if (filter === 'all') return true;
    return exp.category === filter;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    return 0;
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="expense-list-container">
      <div className="list-header">
        <h2>📝 Expense History</h2>
        <div className="total-display">
          Total: <strong>${totalAmount.toFixed(2)}</strong>
        </div>
      </div>

      <div className="list-controls">
        <div className="filter-group">
          <label htmlFor="filter">Filter by Category:</label>
          <select 
            id="filter"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills & Utilities">Bills & Utilities</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found. Start by adding your first expense!</p>
        </div>
      ) : (
        <div className="expense-list">
          {sortedExpenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-icon">
                {getCategoryEmoji(expense.category)}
              </div>
              <div className="expense-details">
                <div className="expense-category">{expense.category}</div>
                <div className="expense-date">{new Date(expense.date).toLocaleDateString()}</div>
                {expense.note && <div className="expense-note">{expense.note}</div>}
              </div>
              <div className="expense-amount">
                ${expense.amount.toFixed(2)}
              </div>
              <div className="expense-actions">
                <button 
                  onClick={() => onEditExpense(expense)}
                  className="btn-edit"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this expense?')) {
                      onDeleteExpense(expense.id);
                    }
                  }}
                  className="btn-delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;

import React, { useState } from 'react';
import './BudgetSettings.css';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

function BudgetSettings({ budgetLimits, onUpdateBudgetLimit }) {
  const [editingCategory, setEditingCategory] = useState('');
  const [tempLimit, setTempLimit] = useState('');

  const handleEdit = (category) => {
    setEditingCategory(category);
    setTempLimit(budgetLimits[category] || '');
  };

  const handleSave = () => {
    if (tempLimit && parseFloat(tempLimit) > 0) {
      onUpdateBudgetLimit(editingCategory, tempLimit);
      setEditingCategory('');
      setTempLimit('');
    } else {
      alert('Please enter a valid budget amount greater than 0');
    }
  };

  const handleCancel = () => {
    setEditingCategory('');
    setTempLimit('');
  };

  return (
    <div className="budget-settings">
      <h2>🎯 Set Monthly Budget Limits</h2>
      <p className="subtitle">Set spending limits for each category to track your budget</p>

      <div className="budget-list">
        {CATEGORIES.map(category => (
          <div key={category} className="budget-item">
            <div className="budget-category">{category}</div>
            
            {editingCategory === category ? (
              <div className="budget-edit">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    } else if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }}
                  placeholder="Enter limit"
                  autoFocus
                />
                <button onClick={handleSave} className="btn-save">✓</button>
                <button onClick={handleCancel} className="btn-cancel">✗</button>
              </div>
            ) : (
              <div className="budget-display">
                <span className="budget-amount">
                  {budgetLimits[category] 
                    ? `$${budgetLimits[category].toFixed(2)}` 
                    : 'Not set'}
                </span>
                <button 
                  onClick={() => handleEdit(category)}
                  className="btn-edit-budget"
                >
                  {budgetLimits[category] ? 'Edit' : 'Set Limit'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="budget-info">
        <h3>💡 Tips for Setting Budgets</h3>
        <ul>
          <li>Review your past spending to set realistic limits</li>
          <li>Start with higher limits and adjust as needed</li>
          <li>Leave some buffer for unexpected expenses</li>
          <li>Update your budgets monthly based on your needs</li>
        </ul>
      </div>
    </div>
  );
}

export default BudgetSettings;

import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function Dashboard({ expenses, budgetLimits }) {
  
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // This week
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekExpenses = expenses.filter(exp => new Date(exp.date) >= weekAgo);
    const weekTotal = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // This month
    const monthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // This year
    const yearExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getFullYear() === currentYear;
    });
    const yearTotal = yearExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Category breakdown
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    return { weekTotal, monthTotal, yearTotal, categoryTotals, monthExpenses };
  }, [expenses]);

  // Category Pie Chart
  const categoryChartData = {
    labels: Object.keys(stats.categoryTotals),
    datasets: [{
      label: 'Spending by Category',
      data: Object.values(stats.categoryTotals),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF',
        '#4BC0C0'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Monthly trend (last 6 months)
  const monthlyTrendData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const months = [];
    const totals = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      months.push(monthName);

      const monthTotal = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === date.getMonth() && 
                 expDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      totals.push(monthTotal);
    }

    return { months, totals };
  }, [expenses]);

  const monthlyLineChart = {
    labels: monthlyTrendData.months,
    datasets: [{
      label: 'Monthly Spending',
      data: monthlyTrendData.totals,
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.4,
      fill: true
    }]
  };

  // Budget vs Actual
  const budgetComparisonData = useMemo(() => {
    const categories = Object.keys(budgetLimits);
    const budgets = categories.map(cat => budgetLimits[cat]);
    const actuals = categories.map(cat => {
      return stats.monthExpenses
        .filter(exp => exp.category === cat)
        .reduce((sum, exp) => sum + exp.amount, 0);
    });

    return { categories, budgets, actuals };
  }, [budgetLimits, stats.monthExpenses]);

  const budgetBarChart = {
    labels: budgetComparisonData.categories,
    datasets: [
      {
        label: 'Budget Limit',
        data: budgetComparisonData.budgets,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Actual Spending',
        data: budgetComparisonData.actuals,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  // Budget alerts
  const budgetAlerts = useMemo(() => {
    const alerts = [];
    Object.keys(budgetLimits).forEach(category => {
      const spent = stats.monthExpenses
        .filter(exp => exp.category === category)
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      const limit = budgetLimits[category];
      const percentage = (spent / limit) * 100;

      if (percentage >= 90) {
        alerts.push({
          category,
          spent,
          limit,
          percentage,
          level: percentage >= 100 ? 'critical' : 'warning'
        });
      }
    });
    return alerts;
  }, [budgetLimits, stats.monthExpenses]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-label">This Week</div>
            <div className="stat-value">${stats.weekTotal.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-content">
            <div className="stat-label">This Month</div>
            <div className="stat-value">${stats.monthTotal.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">This Year</div>
            <div className="stat-value">${stats.yearTotal.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🧾</div>
          <div className="stat-content">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{expenses.length}</div>
          </div>
        </div>
      </div>

      {budgetAlerts.length > 0 && (
        <div className="alerts-section">
          <h3>⚠️ Budget Alerts</h3>
          <div className="alerts-list">
            {budgetAlerts.map(alert => (
              <div 
                key={alert.category} 
                className={`alert-item ${alert.level}`}
              >
                <div className="alert-header">
                  <strong>{alert.category}</strong>
                  <span className="alert-percentage">{alert.percentage.toFixed(0)}%</span>
                </div>
                <div className="alert-details">
                  Spent ${alert.spent.toFixed(2)} of ${alert.limit.toFixed(2)}
                </div>
                {alert.level === 'critical' && (
                  <div className="alert-message">Budget exceeded!</div>
                )}
                {alert.level === 'warning' && (
                  <div className="alert-message">Approaching budget limit</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <div className="chart-container">
            {Object.keys(stats.categoryTotals).length > 0 ? (
              <Pie data={categoryChartData} options={chartOptions} />
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3>Monthly Trend (Last 6 Months)</h3>
          <div className="chart-container">
            <Line data={monthlyLineChart} options={chartOptions} />
          </div>
        </div>

        {Object.keys(budgetLimits).length > 0 && (
          <div className="chart-card full-width">
            <h3>Budget vs Actual (This Month)</h3>
            <div className="chart-container">
              <Bar data={budgetBarChart} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect } from 'react';
import "./List.css";
import { FaUtensils, FaClipboardList, FaUsers, FaDollarSign } from 'react-icons/fa';
import ExploreMenu from "../../components/exploremenu/ExploreMenu";
import FoodDisplay from "../../components/fooddisplay/FoodDisplay";
import Header from '../../components/header/Header';
import axios from 'axios';

const List = () => {
  const [category, setCategory] = useState("All");
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    totalCategories: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, you would fetch these from your API
        // const response = await axios.get('/api/dashboard/stats');
        // setStats(response.data);
        
        // Mock data for demonstration
        setStats({
          totalItems: 42,
          activeItems: 36,
          totalCategories: 8,
          totalRevenue: 12540.75
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className='list'>
      <div className="list-content">
        <Header />
        
        <div className="list-header">
          <h1>Menu Management</h1>
          <p>Manage your food items, categories, and view analytics</p>
        </div>

        {!loading && (
          <div className="stats-container">
            <div className="stat-card fade-in" style={{ '--delay': '0.1s' }}>
              <div className="stat-icon">
                <FaUtensils />
              </div>
              <h3>Total Items</h3>
              <p>{stats.totalItems}</p>
            </div>
            
            <div className="stat-card fade-in" style={{ '--delay': '0.2s' }}>
              <div className="stat-icon">
                <FaClipboardList />
              </div>
              <h3>Active Items</h3>
              <p>{stats.activeItems}</p>
            </div>
            
            <div className="stat-card fade-in" style={{ '--delay': '0.3s' }}>
              <div className="stat-icon">
                <FaUsers />
              </div>
              <h3>Categories</h3>
              <p>{stats.totalCategories}</p>
            </div>
            
            <div className="stat-card fade-in" style={{ '--delay': '0.4s' }}>
              <div className="stat-icon">
                <FaDollarSign />
              </div>
              <h3>Monthly Revenue</h3>
              <p>{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        )}

        <div className="menu-section">
          <div className="section-header">
            <h2>Food Items</h2>
            <button className="add-item-btn">
              + Add New Item
            </button>
          </div>
          
          <ExploreMenu 
            category={category} 
            setCategory={setCategory} 
          />
          
          <FoodDisplay category={category} />
        </div>
      </div>
    </div>
  );
};

export default List;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('liquidity');
  const [data, setData] = useState({});
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const loadAnalysis = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(prev => ({ ...prev, [type]: null }));

    try {
      let response;
      switch (type) {
        case 'liquidity':
          response = await api.getLiquidityAnalysis();
          break;
        case 'cashflow':
          response = await api.getCashFlowAnalysis();
          break;
        case 'profitability':
          response = await api.getProfitabilityAnalysis();
          break;
        default:
          throw new Error('Ukjent analysetype');
      }

      setData(prev => ({ ...prev, [type]: response.data }));
      setInsights(prev => ({ ...prev, [type]: response.aiInsight }));
    } catch (err) {
      setError(prev => ({ ...prev, [type]: err.message }));
      if (err.message.includes('Tripletex')) {
        navigate('/setup');
      }
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    loadAnalysis(activeTab);
  }, [activeTab]);

  const renderLiquidityChart = () => {
    if (!data.liquidity) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.liquidity}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value, name) => [`${value.toLocaleString('nb-NO')} kr`, name]} />
          <Legend />
          <Line type="monotone" dataKey="inn" stroke="#10b981" name="Inntekter" strokeWidth={2} />
          <Line type="monotone" dataKey="ut" stroke="#ef4444" name="Utgifter" strokeWidth={2} />
          <Line type="monotone" dataKey="akkumulert" stroke="#3b82f6" name="Akkumulert" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderCashFlowChart = () => {
    if (!data.cashflow) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.cashflow}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value, name) => value ? [`${value.toLocaleString('nb-NO')} kr`, name] : ['Ingen data', name]} />
          <Legend />
          <Bar dataKey="faktisk" fill="#10b981" name="Faktisk" />
          <Bar dataKey="prognose" fill="#3b82f6" name="Prognose" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderProfitabilityChart = () => {
    if (!data.profitability) return null;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data.profitability} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
          <YAxis dataKey="kategori" type="category" width={100} />
          <Tooltip formatter={(value, name) => [`${value.toLocaleString('nb-NO')} kr`, name]} />
          <Legend />
          <Bar dataKey="faktisk" fill="#10b981" name="Faktisk" />
          <Bar dataKey="budsjett" fill="#3b82f6" name="Budsjett" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const formatTableValue = (value) => {
    if (typeof value === 'number') {
      return value.toLocaleString('nb-NO');
    }
    return value;
  };

  const getTableHeaders = (type) => {
    switch (type) {
      case 'liquidity':
        return ['Uke', 'Inntekter', 'Utgifter', 'Netto', 'Akkumulert'];
      case 'cashflow':
        return ['Måned', 'Faktisk', 'Prognose'];
      case 'profitability':
        return ['Kategori', 'Faktisk', 'Budsjett'];
      default:
        return [];
    }
  };

  const getTableData = (type) => {
    const currentData = data[type];
    if (!currentData) return [];

    switch (type) {
      case 'liquidity':
        return currentData.map(item => [
          item.week,
          formatTableValue(item.inn),
          formatTableValue(item.ut),
          formatTableValue(item.netto),
          formatTableValue(item.akkumulert)
        ]);
      case 'cashflow':
        return currentData.map(item => [
          item.month,
          item.faktisk ? formatTableValue(item.faktisk) : '-',
          formatTableValue(item.prognose)
        ]);
      case 'profitability':
        return currentData.map(item => [
          item.kategori,
          formatTableValue(item.faktisk),
          formatTableValue(item.budsjett)
        ]);
      default:
        return [];
    }
  };

  const tabs = [
    { id: 'liquidity', name: 'Likviditet', icon: '💰' },
    { id: 'cashflow', name: 'Kontantstrøm', icon: '📈' },
    { id: 'profitability', name: 'Lønnsomhet', icon: '💼' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DriftAI</h1>
              <p className="text-sm text-gray-600">
                Velkommen, {user?.company_name || user?.email || 'Bruker'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/setup')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Innstillinger
              </button>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logg ut
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading[activeTab] ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Laster analyse...</p>
            </div>
          ) : error[activeTab] ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-red-800">Feil ved lasting av data</h3>
              <p className="mt-1 text-sm text-red-700">{error[activeTab]}</p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => loadAnalysis(activeTab)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                >
                  Prøv igjen
                </button>
                {error[activeTab].includes('Tripletex') && (
                  <button
                    onClick={() => navigate('/setup')}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm"
                  >
                    Gå til innstillinger
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'liquidity' && renderLiquidityChart()}
              {activeTab === 'cashflow' && renderCashFlowChart()}
              {activeTab === 'profitability' && renderProfitabilityChart()}
              {/* Mer som AI insights og tabell kan evt. legges til her */}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

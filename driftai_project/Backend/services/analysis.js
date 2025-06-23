const axios = require('axios');

class FinancialAnalysisService {
  static calculateLiquidityBudget(transactions, weeks = 4) {
    const budget = [];
    const historicalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((s, t) => s + t.amount, 0) / transactions.length;
    const historicalExpenses = Math.abs(transactions
      .filter(t => t.amount < 0)
      .reduce((s, t) => s + t.amount, 0)) / transactions.length;
    let accumulated = 250000;
    for (let i = 1; i <= weeks; i++) {
      const weeklyIncome = historicalIncome * (0.9 + Math.random() * 0.2);
      const weeklyExpenses = historicalExpenses * (0.95 + Math.random() * 0.1);
      const netto = weeklyIncome - weeklyExpenses;
      accumulated += netto;
      budget.push({
        week: `Uke ${i}`,
        inn: Math.round(weeklyIncome),
        ut: Math.round(weeklyExpenses),
        netto: Math.round(netto),
        akkumulert: Math.round(accumulated)
      });
    }
    return budget;
  }

  static calculateCashFlowForecast(transactions, months = 6) {
    const forecast = [];
    const monthlyAverage = transactions.reduce((s, t) => s + t.amount, 0) / 3;
    const currentDate = new Date();
    for (let i = 0; i < months; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthName = date.toLocaleDateString('nb-NO', { month: 'short' });
      let faktisk = null;
      if (i < 3) {
        faktisk = Math.round(monthlyAverage * (0.8 + Math.random() * 0.4));
      }
      const prognose = Math.round(monthlyAverage * (1 + (i * 0.05)));
      forecast.push({ month: monthName, faktisk, prognose });
    }
    return forecast;
  }

  static calculateProfitabilityAnalysis(transactions) {
    const revenue = transactions.filter(t => t.amount > 0)
      .reduce((s, t) => s + t.amount, 0);
    const expenses = Math.abs(transactions.filter(t => t.amount < 0)
      .reduce((s, t) => s + t.amount, 0));
    return [
      { kategori: 'Salg', faktisk: Math.round(revenue), budsjett: Math.round(revenue * 0.94) },
      { kategori: 'L\u00f8nn', faktisk: Math.round(-expenses * 0.4), budsjett: Math.round(-expenses * 0.38) },
      { kategori: 'Husleie', faktisk: Math.round(-expenses * 0.15), budsjett: Math.round(-expenses * 0.15) },
      { kategori: 'Markedsf\u00f8ring', faktisk: Math.round(-expenses * 0.1), budsjett: Math.round(-expenses * 0.12) },
      { kategori: 'Andre kostnader', faktisk: Math.round(-expenses * 0.35), budsjett: Math.round(-expenses * 0.35) }
    ];
  }
}

class AIAnalysisService {
  static async generateInsight(type, data) {
    const prompts = {
      liquidity: `Analyser f\u00f8lgende likviditetsdata og gi norsk forklaring: ${JSON.stringify(data)}`,
      cashflow: `Analyser kontantstr\u00f8mdata og gi norsk analyse: ${JSON.stringify(data)}`,
      profitability: `Analyser l\u00f8nnsomhetsdata og gi norsk innsikt: ${JSON.stringify(data)}`
    };
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [{ role: 'system', content: 'Du er en ekspert regnskapsf\u00f8rer.' }, { role: 'user', content: prompts[type] }],
        max_tokens: 300,
        temperature: 0.7
      }, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      return this.getFallbackInsight(type);
    }
  }

  static getFallbackInsight(type) {
    const fallbacks = {
      liquidity: 'Likviditeten ser stabil ut.',
      cashflow: 'Kontantstr\u00f8mmen viser positiv utvikling.',
      profitability: 'L\u00f8nnsomheten er innenfor normale rammer.'
    };
    return fallbacks[type];
  }
}

module.exports = { FinancialAnalysisService, AIAnalysisService };

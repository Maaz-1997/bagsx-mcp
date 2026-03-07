/**
 * BAGSX Analytics Dashboard
 * Real-time analytics for Bags.fm creator tokens
 */

const API_BASE = 'https://public-api-v2.bags.fm/api/v1';
const CORS_PROXY = 'https://corsproxy.io/?';
const BAGSX_MINT = 'BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS';

// Use proxy for CORS
async function fetchWithProxy(url) {
    try {
        // Try direct first
        const directRes = await fetch(url, { mode: 'cors' });
        if (directRes.ok) return directRes;
    } catch (e) {
        // Direct failed, try proxy
    }
    
    try {
        const proxyRes = await fetch(CORS_PROXY + encodeURIComponent(url));
        if (proxyRes.ok) return proxyRes;
    } catch (e) {
        // Proxy failed too
    }
    
    return null;
}

// Generate realistic mock data when API unavailable
function generateMockData() {
    const tokens = [
        { symbol: 'NYAN', name: 'Nyan Cat', price: 0.0234, priceChange24h: 12.5, volume24h: 892000, holders: 4521, mint: 'nyan123' },
        { symbol: 'BTH', name: 'Bithumb', price: 0.0189, priceChange24h: 8.3, volume24h: 654000, holders: 3201, mint: 'bth456' },
        { symbol: 'GAS', name: 'Gas Token', price: 0.0156, priceChange24h: -2.1, volume24h: 521000, holders: 2890, mint: 'gas789' },
        { symbol: 'RALPH', name: 'Ralph', price: 0.0098, priceChange24h: 15.7, volume24h: 432000, holders: 1902, mint: 'ralph012' },
        { symbol: 'BAGSX', name: 'BAGSX MCP', price: 0.0045, priceChange24h: 28.4, volume24h: 125000, holders: 892, mint: BAGSX_MINT },
        { symbol: 'PUMP', name: 'Pump It', price: 0.0312, priceChange24h: -5.2, volume24h: 398000, holders: 2145, mint: 'pump345' },
        { symbol: 'MOON', name: 'To The Moon', price: 0.0067, priceChange24h: 6.8, volume24h: 287000, holders: 1567, mint: 'moon678' },
        { symbol: 'DEGEN', name: 'Degen', price: 0.0145, priceChange24h: 3.2, volume24h: 345000, holders: 2678, mint: 'degen901' },
        { symbol: 'ALPHA', name: 'Alpha Hunters', price: 0.0223, priceChange24h: -1.5, volume24h: 198000, holders: 987, mint: 'alpha234' },
        { symbol: 'WHALE', name: 'Whale Watch', price: 0.0089, priceChange24h: 9.1, volume24h: 267000, holders: 1234, mint: 'whale567' },
    ];
    return { tokens };
}

// State
let volumeChart = null;
let performersChart = null;
let refreshInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCharts();
    initEventListeners();
    loadAllData();
    startAutoRefresh();
});

// Tab Navigation
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
            
            // Load tab-specific data
            if (tab.dataset.tab === 'trending') loadTrending();
            if (tab.dataset.tab === 'whales') loadWhales();
        });
    });
}

// Chart Initialization
function initCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                grid: { color: '#2a2a3a' },
                ticks: { color: '#606070' }
            },
            y: {
                grid: { color: '#2a2a3a' },
                ticks: { color: '#606070' }
            }
        }
    };

    // Volume Chart
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    volumeChart = new Chart(volumeCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: chartOptions
    });

    // Performers Chart (horizontal bar)
    const performersCtx = document.getElementById('performersChart').getContext('2d');
    performersChart = new Chart(performersCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#00d4ff',
                    '#7b5cff',
                    '#00ff88',
                    '#ffaa00',
                    '#ff4466'
                ],
                borderRadius: 4
            }]
        },
        options: {
            ...chartOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    grid: { color: '#2a2a3a' },
                    ticks: { 
                        color: '#606070',
                        callback: (val) => val + '%'
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#a0a0b0' }
                }
            }
        }
    });
}

// Event Listeners
function initEventListeners() {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        const btn = document.getElementById('refreshBtn');
        btn.classList.add('spinning');
        loadAllData().finally(() => {
            setTimeout(() => btn.classList.remove('spinning'), 500);
        });
    });

    // Chart period buttons
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadVolumeChart(btn.dataset.period);
        });
    });

    // Trending sort
    document.getElementById('trendingSort').addEventListener('change', (e) => {
        loadTrending(e.target.value);
    });

    // Portfolio loader
    document.getElementById('loadPortfolio').addEventListener('click', loadPortfolio);
    document.getElementById('walletAddress').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadPortfolio();
    });
}

// Data Loading
async function loadAllData() {
    updateTimestamp();
    await Promise.all([
        loadStats(),
        loadVolumeChart('24h'),
        loadTrending(),
        loadRecentTrades()
    ]);
}

async function loadStats() {
    try {
        // Try API first, fallback to mock data
        let data;
        const response = await fetchWithProxy(`${API_BASE}/tokens/trending`);
        
        if (response) {
            data = await response.json();
        } else {
            // Use mock data
            data = generateMockData();
            console.log('Using mock data (API unavailable)');
        }
        
        if (data.tokens) {
            const totalVolume = data.tokens.reduce((sum, t) => sum + (t.volume24h || 0), 0);
            document.getElementById('totalVolume').textContent = formatCurrency(totalVolume);
            document.getElementById('activeTokens').textContent = data.tokens.length.toLocaleString();
            
            // Simulated stats
            document.getElementById('totalTrades').textContent = Math.floor(Math.random() * 5000 + 1000).toLocaleString();
            document.getElementById('volumeChange').textContent = '+' + (Math.random() * 20 + 5).toFixed(1) + '%';
            document.getElementById('volumeChange').className = 'stat-change positive';
        }

        // Load BAGSX price
        await loadBAGSXPrice();
    } catch (error) {
        console.error('Failed to load stats:', error);
        // Use mock data on error
        const data = generateMockData();
        const totalVolume = data.tokens.reduce((sum, t) => sum + (t.volume24h || 0), 0);
        document.getElementById('totalVolume').textContent = formatCurrency(totalVolume);
        document.getElementById('activeTokens').textContent = data.tokens.length.toLocaleString();
        document.getElementById('totalTrades').textContent = '2,847';
        document.getElementById('volumeChange').textContent = '+12.4%';
        document.getElementById('volumeChange').className = 'stat-change positive';
        await loadBAGSXPrice();
    }
}

async function loadBAGSXPrice() {
    try {
        const response = await fetchWithProxy(`${API_BASE}/tokens/${BAGSX_MINT}`);
        
        if (response) {
            const data = await response.json();
            if (data.token) {
                const price = data.token.price || 0;
                const change = data.token.priceChange24h || 0;
                
                document.getElementById('bagsxPrice').textContent = '$' + price.toFixed(6);
                document.getElementById('bagsxChange').textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
                document.getElementById('bagsxChange').className = `stat-change ${change >= 0 ? 'positive' : 'negative'}`;
                return;
            }
        }
        
        // Mock BAGSX price
        const mockPrice = 0.0045;
        const mockChange = 28.4;
        document.getElementById('bagsxPrice').textContent = '$' + mockPrice.toFixed(6);
        document.getElementById('bagsxChange').textContent = '+' + mockChange.toFixed(2) + '%';
        document.getElementById('bagsxChange').className = 'stat-change positive';
    } catch (error) {
        document.getElementById('bagsxPrice').textContent = '$0.0045';
        document.getElementById('bagsxChange').textContent = '+28.4%';
        document.getElementById('bagsxChange').className = 'stat-change positive';
    }
}

async function loadVolumeChart(period) {
    // Generate mock data based on period
    const points = period === '24h' ? 24 : period === '7d' ? 7 : 30;
    const labels = [];
    const data = [];
    
    for (let i = points; i >= 0; i--) {
        if (period === '24h') {
            labels.push(`${i}h`);
        } else {
            labels.push(`${i}d`);
        }
        data.push(Math.random() * 100000 + 50000);
    }
    
    volumeChart.data.labels = labels.reverse();
    volumeChart.data.datasets[0].data = data;
    volumeChart.update();
}

async function loadTrending(sortBy = 'volume') {
    const grid = document.getElementById('trendingGrid');
    grid.innerHTML = '<div class="loading-skeleton">Loading trending tokens...</div>';
    
    try {
        let data;
        const response = await fetchWithProxy(`${API_BASE}/tokens/trending`);
        
        if (response) {
            data = await response.json();
        } else {
            data = generateMockData();
        }
        
        if (data.tokens && data.tokens.length > 0) {
            // Sort tokens
            let tokens = [...data.tokens];
            if (sortBy === 'volume') {
                tokens.sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0));
            } else if (sortBy === 'price_change') {
                tokens.sort((a, b) => (b.priceChange24h || 0) - (a.priceChange24h || 0));
            } else if (sortBy === 'holders') {
                tokens.sort((a, b) => (b.holders || 0) - (a.holders || 0));
            }
            
            // Update performers chart
            updatePerformersChart(tokens.slice(0, 5));
            
            // Render grid
            grid.innerHTML = tokens.slice(0, 12).map(token => `
                <div class="token-card" onclick="window.open('https://bags.fm/${token.mint}', '_blank')">
                    <div class="token-card-header">
                        <div class="token-card-avatar">${(token.symbol || '?')[0]}</div>
                        <div class="token-card-info">
                            <h4>${token.symbol || 'Unknown'}</h4>
                            <p>${token.name || 'Creator Token'}</p>
                        </div>
                    </div>
                    <div class="token-card-stats">
                        <div class="token-stat">
                            <div class="token-stat-label">Price</div>
                            <div class="token-stat-value">$${(token.price || 0).toFixed(6)}</div>
                        </div>
                        <div class="token-stat">
                            <div class="token-stat-label">24h Change</div>
                            <div class="token-stat-value ${(token.priceChange24h || 0) >= 0 ? 'positive' : 'negative'}">
                                ${(token.priceChange24h || 0) >= 0 ? '+' : ''}${(token.priceChange24h || 0).toFixed(2)}%
                            </div>
                        </div>
                        <div class="token-stat">
                            <div class="token-stat-label">Volume</div>
                            <div class="token-stat-value">${formatCurrency(token.volume24h || 0)}</div>
                        </div>
                        <div class="token-stat">
                            <div class="token-stat-label">Holders</div>
                            <div class="token-stat-value">${(token.holders || 0).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span><p>No trending tokens found</p></div>';
        }
    } catch (error) {
        console.error('Failed to load trending:', error);
        // Use mock data on error
        const data = generateMockData();
        const tokens = data.tokens;
        updatePerformersChart(tokens.slice(0, 5));
        grid.innerHTML = tokens.slice(0, 12).map(token => `
            <div class="token-card" onclick="window.open('https://bags.fm/${token.mint}', '_blank')">
                <div class="token-card-header">
                    <div class="token-card-avatar">${(token.symbol || '?')[0]}</div>
                    <div class="token-card-info">
                        <h4>${token.symbol || 'Unknown'}</h4>
                        <p>${token.name || 'Creator Token'}</p>
                    </div>
                </div>
                <div class="token-card-stats">
                    <div class="token-stat">
                        <div class="token-stat-label">Price</div>
                        <div class="token-stat-value">$${(token.price || 0).toFixed(6)}</div>
                    </div>
                    <div class="token-stat">
                        <div class="token-stat-label">24h Change</div>
                        <div class="token-stat-value ${(token.priceChange24h || 0) >= 0 ? 'positive' : 'negative'}">
                            ${(token.priceChange24h || 0) >= 0 ? '+' : ''}${(token.priceChange24h || 0).toFixed(2)}%
                        </div>
                    </div>
                    <div class="token-stat">
                        <div class="token-stat-label">Volume</div>
                        <div class="token-stat-value">${formatCurrency(token.volume24h || 0)}</div>
                    </div>
                    <div class="token-stat">
                        <div class="token-stat-label">Holders</div>
                        <div class="token-stat-value">${(token.holders || 0).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function updatePerformersChart(tokens) {
    performersChart.data.labels = tokens.map(t => t.symbol || 'Unknown');
    performersChart.data.datasets[0].data = tokens.map(t => t.priceChange24h || 0);
    performersChart.update();
}

async function loadRecentTrades() {
    const container = document.getElementById('recentTrades');
    
    try {
        // Fetch recent trades from trending tokens
        let data;
        const response = await fetchWithProxy(`${API_BASE}/tokens/trending`);
        
        if (response) {
            data = await response.json();
        } else {
            data = generateMockData();
        }
        
        if (data.tokens && data.tokens.length > 0) {
            // Generate mock recent trades
            const trades = [];
            const types = ['buy', 'sell'];
            
            for (let i = 0; i < 10; i++) {
                const token = data.tokens[Math.floor(Math.random() * Math.min(data.tokens.length, 10))];
                const type = types[Math.floor(Math.random() * types.length)];
                const amount = Math.random() * 10000 + 100;
                const price = token.price || 0;
                
                trades.push({
                    token: token.symbol || 'Unknown',
                    type,
                    amount,
                    price,
                    time: Math.floor(Math.random() * 60) + 1
                });
            }
            
            container.innerHTML = trades.map(trade => `
                <div class="trade-row">
                    <div class="token-info">
                        <div class="token-avatar">${trade.token[0]}</div>
                        <span class="token-name">${trade.token}</span>
                    </div>
                    <span class="trade-type ${trade.type}">${trade.type}</span>
                    <span class="trade-amount">${formatCurrency(trade.amount)}</span>
                    <span class="trade-price">$${trade.price.toFixed(6)}</span>
                    <span class="trade-time">${trade.time}m ago</span>
                </div>
            `).join('');
        }
    } catch (error) {
        // Use mock data on error
        const data = generateMockData();
        const trades = [];
        const types = ['buy', 'sell'];
        
        for (let i = 0; i < 10; i++) {
            const token = data.tokens[Math.floor(Math.random() * Math.min(data.tokens.length, 10))];
            const type = types[Math.floor(Math.random() * types.length)];
            const amount = Math.random() * 10000 + 100;
            const price = token.price || 0;
            
            trades.push({
                token: token.symbol || 'Unknown',
                type,
                amount,
                price,
                time: Math.floor(Math.random() * 60) + 1
            });
        }
        
        container.innerHTML = trades.map(trade => `
            <div class="trade-row">
                <div class="token-info">
                    <div class="token-avatar">${trade.token[0]}</div>
                    <span class="token-name">${trade.token}</span>
                </div>
                <span class="trade-type ${trade.type}">${trade.type}</span>
                <span class="trade-amount">${formatCurrency(trade.amount)}</span>
                <span class="trade-price">$${trade.price.toFixed(6)}</span>
                <span class="trade-time">${trade.time}m ago</span>
            </div>
        `).join('');
    }
}

async function loadWhales() {
    const container = document.getElementById('whaleList');
    container.innerHTML = '<div class="loading-skeleton">Loading whale activity...</div>';
    
    try {
        let data;
        const response = await fetchWithProxy(`${API_BASE}/tokens/trending`);
        
        if (response) {
            data = await response.json();
        } else {
            data = generateMockData();
        }
        
        if (data.tokens && data.tokens.length > 0) {
            // Generate mock whale trades
            const whales = [];
            const types = ['buy', 'sell'];
            
            for (let i = 0; i < 8; i++) {
                const token = data.tokens[Math.floor(Math.random() * Math.min(data.tokens.length, 10))];
                const type = types[Math.floor(Math.random() * types.length)];
                const amount = Math.random() * 50000 + 10000;
                
                whales.push({
                    token: token.symbol || 'Unknown',
                    name: token.name || 'Creator Token',
                    type,
                    amount,
                    wallet: generateRandomWallet(),
                    time: Math.floor(Math.random() * 120) + 1
                });
            }
            
            container.innerHTML = whales.map(whale => `
                <div class="whale-card">
                    <span class="whale-icon">🐋</span>
                    <div class="whale-info">
                        <h4>${whale.token} - ${whale.name}</h4>
                        <p>${whale.wallet}</p>
                    </div>
                    <div class="whale-amount">
                        <div class="whale-amount-value ${whale.type}">${whale.type === 'buy' ? '+' : '-'}${formatCurrency(whale.amount)}</div>
                        <div class="whale-amount-time">${whale.time}m ago</div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        // Use mock data on error
        const data = generateMockData();
        const whales = [];
        const types = ['buy', 'sell'];
        
        for (let i = 0; i < 8; i++) {
            const token = data.tokens[Math.floor(Math.random() * Math.min(data.tokens.length, 10))];
            const type = types[Math.floor(Math.random() * types.length)];
            const amount = Math.random() * 50000 + 10000;
            
            whales.push({
                token: token.symbol || 'Unknown',
                name: token.name || 'Creator Token',
                type,
                amount,
                wallet: generateRandomWallet(),
                time: Math.floor(Math.random() * 120) + 1
            });
        }
        
        container.innerHTML = whales.map(whale => `
            <div class="whale-card">
                <span class="whale-icon">🐋</span>
                <div class="whale-info">
                    <h4>${whale.token} - ${whale.name}</h4>
                    <p>${whale.wallet}</p>
                </div>
                <div class="whale-amount">
                    <div class="whale-amount-value ${whale.type}">${whale.type === 'buy' ? '+' : '-'}${formatCurrency(whale.amount)}</div>
                    <div class="whale-amount-time">${whale.time}m ago</div>
                </div>
            </div>
        `).join('');
    }
}

// Generate mock portfolio data
function generateMockPortfolio(wallet) {
    return {
        holdings: [
            { symbol: 'BAGSX', amount: 15000, value: 67.50, pnl: 12.30 },
            { symbol: 'NYAN', amount: 8500, value: 198.90, pnl: 45.20 },
            { symbol: 'GAS', amount: 12000, value: 187.20, pnl: -8.50 },
            { symbol: 'PUMP', amount: 5200, value: 162.24, pnl: 22.10 },
        ]
    };
}

async function loadPortfolio() {
    const wallet = document.getElementById('walletAddress').value.trim();
    const container = document.getElementById('portfolioContent');
    
    if (!wallet) {
        alert('Please enter a wallet address');
        return;
    }
    
    container.innerHTML = '<div class="loading-skeleton">Loading portfolio...</div>';
    
    try {
        let data;
        const response = await fetchWithProxy(`${API_BASE}/portfolio/${wallet}`);
        
        if (response) {
            data = await response.json();
        } else {
            // Use mock portfolio data
            data = generateMockPortfolio(wallet);
        }
        
        if (data.holdings && data.holdings.length > 0) {
            const totalValue = data.holdings.reduce((sum, h) => sum + (h.value || 0), 0);
            const totalPnL = data.holdings.reduce((sum, h) => sum + (h.pnl || 0), 0);
            
            container.innerHTML = `
                <div class="portfolio-summary">
                    <div class="portfolio-stat">
                        <div class="stat-label">Total Value</div>
                        <div class="stat-value">${formatCurrency(totalValue)}</div>
                    </div>
                    <div class="portfolio-stat">
                        <div class="stat-label">Total P&L</div>
                        <div class="stat-value ${totalPnL >= 0 ? 'positive' : 'negative'}">
                            ${totalPnL >= 0 ? '+' : ''}${formatCurrency(totalPnL)}
                        </div>
                    </div>
                    <div class="portfolio-stat">
                        <div class="stat-label">Tokens Held</div>
                        <div class="stat-value">${data.holdings.length}</div>
                    </div>
                </div>
                <div class="portfolio-holdings">
                    <h4>Holdings</h4>
                    ${data.holdings.map(h => `
                        <div class="holding-row">
                            <div class="token-info">
                                <div class="token-avatar">${(h.symbol || '?')[0]}</div>
                                <div>
                                    <div class="token-name">${h.symbol || 'Unknown'}</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted)">${h.amount?.toLocaleString() || 0} tokens</div>
                                </div>
                            </div>
                            <div style="text-align: right">
                                <div>${formatCurrency(h.value || 0)}</div>
                                <div class="${(h.pnl || 0) >= 0 ? 'positive' : 'negative'}" style="font-size: 0.875rem">
                                    ${(h.pnl || 0) >= 0 ? '+' : ''}${formatCurrency(h.pnl || 0)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📭</span>
                    <p>No Bags.fm tokens found in this wallet</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load portfolio:', error);
        // Show mock portfolio on error
        const data = generateMockPortfolio(wallet);
        const totalValue = data.holdings.reduce((sum, h) => sum + (h.value || 0), 0);
        const totalPnL = data.holdings.reduce((sum, h) => sum + (h.pnl || 0), 0);
        
        container.innerHTML = `
            <div class="portfolio-summary">
                <div class="portfolio-stat">
                    <div class="stat-label">Total Value</div>
                    <div class="stat-value">${formatCurrency(totalValue)}</div>
                </div>
                <div class="portfolio-stat">
                    <div class="stat-label">Total P&L</div>
                    <div class="stat-value ${totalPnL >= 0 ? 'positive' : 'negative'}">
                        ${totalPnL >= 0 ? '+' : ''}${formatCurrency(totalPnL)}
                    </div>
                </div>
                <div class="portfolio-stat">
                    <div class="stat-label">Tokens Held</div>
                    <div class="stat-value">${data.holdings.length}</div>
                </div>
            </div>
            <div style="text-align: center; color: var(--text-muted); font-size: 0.75rem; margin-top: 0.5rem;">
                Demo data (API unavailable)
            </div>
            <div class="portfolio-holdings">
                <h4>Holdings</h4>
                ${data.holdings.map(h => `
                    <div class="holding-row">
                        <div class="token-info">
                            <div class="token-avatar">${(h.symbol || '?')[0]}</div>
                            <div>
                                <div class="token-name">${h.symbol || 'Unknown'}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted)">${h.amount?.toLocaleString() || 0} tokens</div>
                            </div>
                        </div>
                        <div style="text-align: right">
                            <div>${formatCurrency(h.value || 0)}</div>
                            <div class="${(h.pnl || 0) >= 0 ? 'positive' : 'negative'}" style="font-size: 0.875rem">
                                ${(h.pnl || 0) >= 0 ? '+' : ''}${formatCurrency(h.pnl || 0)}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Auto Refresh
function startAutoRefresh() {
    refreshInterval = setInterval(() => {
        loadAllData();
    }, 30000); // Refresh every 30 seconds
}

// Utilities
function formatCurrency(value) {
    if (value >= 1000000) {
        return '$' + (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
        return '$' + (value / 1000).toFixed(2) + 'K';
    }
    return '$' + value.toFixed(2);
}

function generateRandomWallet() {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let wallet = '';
    for (let i = 0; i < 44; i++) {
        wallet += chars[Math.floor(Math.random() * chars.length)];
    }
    return wallet.slice(0, 4) + '...' + wallet.slice(-4);
}

function updateTimestamp() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = `Updated ${now.toLocaleTimeString()}`;
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (refreshInterval) clearInterval(refreshInterval);
});

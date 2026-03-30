import { initPerformanceChart, updatePerformanceData } from './modules/performance_chart.js?v=4.5';
import { initSynapseNetwork, updateSynapses } from './modules/synapse_viewer.js?v=4.5';
import { updateLogs, updatePromptTab, updateResponseTab } from './modules/log_viewer.js?v=4.5';
import { updateVisuals } from './modules/visuals.js?v=4.5';
import { initVectorPanel, updateVectorData } from './modules/vector_panel.js?v=4.5';
import { initFullscreen } from './modules/fullscreen.js?v=4.5';
import { initWebSocket, startCountdownLoop } from './modules/websocket.js?v=4.5';
import { initPositionPanel, updatePositionData } from './modules/position_panel.js?v=4.5';
import { initUI } from './modules/ui.js?v=4.5';
import { initStatisticsPanel, updateStatisticsData } from './modules/statistics_panel.js?v=4.5';
import { initNewsPanel, updateNewsData } from './modules/news_panel.js?v=4.5';

const state = {
    isConnected: false,
    fastPollInterval: 10000,
    slowPollInterval: 30000,
    lastUpdateTime: null
};

function formatCost(cost) {
    if (cost === 0 || cost === null || cost === undefined) return '$0.00';
    if (cost < 0.0001) return `$${cost.toFixed(8)}`;
    if (cost < 0.01) return `$${cost.toFixed(6)}`;
    if (cost < 1) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(2)}`;
}

async function fetchCosts() {
    try {
        const response = await fetch('/api/monitor/costs');
        const data = await response.json();
        updateCostDisplay(data);
    } catch (e) {
        console.error("Failed to fetch costs", e);
    }
}

function updateCostDisplay(data) {
    const costs = data.costs_by_provider || {};
    const total = data.total_session_cost || 0;
    const orCost = costs.openrouter || 0;
    const googleCost = costs.google || 0;

    // Update main total
    document.getElementById('overview-cost').textContent = formatCost(total);

    // Update tooltip or detailed view if we add one, for now just ensures these elements exist if we want to show them
    // The user requested removing LM Studio (free) from costs.
    // We already have specific IDs in index.html for specific providers if we want to show them in a detail view, 
    // but the request was "Overview with graph... Session Cost... I should have reset button". 
    // The reset button is in HTML. We just need to make sure the costs are accurate.
}





async function fetchBrainStatus() {
    try {
        const response = await fetch('/api/brain/status');
        const data = await response.json();
        
        // Update Connection UI
        const connStatus = document.getElementById('connection-status');
        const statusDot = document.querySelector('.status-dot');
        if (connStatus) {
            connStatus.textContent = 'Connected';
            connStatus.classList.remove('disconnected');
            connStatus.classList.add('connected');
        }
        if (statusDot) {
            statusDot.classList.remove('disconnected');
            statusDot.classList.add('connected');
        }

        // Update Header Active Pair
        const headerPair = document.getElementById('header-active-pair');
        if (headerPair) {
            headerPair.textContent = `${data.symbol || '--'} @ ${data.timeframe || '--'}`;
        }

        // Update Overview KPIs
        const trendEl = document.getElementById('overview-trend');
        if (trendEl) {
            trendEl.textContent = data.trend || '--';
            trendEl.className = 'value ' + (data.trend === 'BULLISH' ? 'start-green' : (data.trend === 'BEARISH' ? 'start-red' : ''));
        }

        const confEl = document.getElementById('overview-conf');
        if (confEl) confEl.textContent = data.confidence ? `${data.confidence}%` : '--%';

        const actionEl = document.getElementById('overview-action');
        if (actionEl) actionEl.textContent = data.action || 'WAITING';

        state.lastUpdateTime = new Date();
        updateLastUpdated();
    } catch (e) {
        console.warn("Brain status fetch failed", e);
    }
}

async function fetchManualSettings() {
    try {
        const response = await fetch('/api/settings/overrides');
        const data = await response.json();
        
        const map = {
            'setting-coin': data.manual_coin,
            'setting-timeframe': data.timeframe,
            'setting-work-interval': data.check_interval_mins,
            'setting-sl': data.stop_loss_pct,
            'setting-tp': data.take_profit_pct,
            'setting-initial-capital': data.initial_capital,
            'setting-min-alloc': data.min_allocation_pct,
            'setting-max-alloc': data.max_allocation_pct
        };
        
        Object.keys(map).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = map[id] || (el.tagName === 'SELECT' ? '' : '');
        });
        
    } catch (e) {
        console.error("Failed to fetch settings", e);
    }
}

async function saveManualSettingsGroup(group) {
    const statusEl = document.getElementById('settings-save-status');
    const payload = {};
    
    if (group === 'target') {
        payload.manual_coin = document.getElementById('setting-coin').value.trim().toUpperCase();
        payload.timeframe = document.getElementById('setting-timeframe').value;
        payload.check_interval_mins = parseInt(document.getElementById('setting-work-interval').value) || 0;
    } else if (group === 'risk') {
        payload.stop_loss_pct = parseFloat(document.getElementById('setting-sl').value) || 0;
        payload.take_profit_pct = parseFloat(document.getElementById('setting-tp').value) || 0;
    } else if (group === 'capital') {
        payload.initial_capital = parseFloat(document.getElementById('setting-initial-capital').value) || 0;
        payload.min_allocation_pct = parseFloat(document.getElementById('setting-min-alloc').value) || 0;
        payload.max_allocation_pct = parseFloat(document.getElementById('setting-max-alloc').value) || 0;
    }
    
    try {
        const response = await fetch('/api/settings/overrides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            if (statusEl) {
                statusEl.style.display = 'block';
                setTimeout(() => { statusEl.style.display = 'none'; }, 2000);
            }
            // If capital changed, refresh performance
            if (group === 'capital') updatePerformanceData();
        }
    } catch (err) {
        console.error("Save failed", err);
    }
}

// Initialize application
function initApp() {
    console.log('Initializing Dashboard App...');
    window.updateAll = updateAll;
    window.togglePanelMinimize = togglePanelMinimize;

    try {
        initUI();
        initPerformanceChart();
        initSynapseNetwork();
        initVectorPanel();
        initFullscreen();
        initPositionPanel();
        initStatisticsPanel();
        initNewsPanel();
        initWebSocket();
        startCountdownLoop();

        // New Apply buttons
        document.querySelectorAll('.btn-partial-save').forEach(btn => {
            btn.addEventListener('click', () => {
                const group = btn.getAttribute('data-group');
                saveManualSettingsGroup(group);
            });
        });

        const btnSysStart = document.getElementById('btn-system-start');
        if (btnSysStart) {
            btnSysStart.addEventListener('click', async () => {
                btnSysStart.innerHTML = '<span class="spinner spinner-sm"></span> Booting...';
                btnSysStart.disabled = true;
                await fetch('/api/system/start', { method: 'POST' });
                setTimeout(updateFastLane, 2000);
            });
        }
        
        const btnSysStop = document.getElementById('btn-system-stop');
        if (btnSysStop) {
            btnSysStop.addEventListener('click', async () => {
                btnSysStop.innerHTML = '<span class="spinner spinner-sm"></span> Halting...';
                btnSysStop.disabled = true;
                await fetch('/api/system/stop', { method: 'POST' });
                setTimeout(updateFastLane, 2000);
            });
        }

        // Initial updates
        updateAll();
        fetchManualSettings();

        // Polling
        setInterval(updateFastLane, state.fastPollInterval);
        setInterval(updateSlowLane, state.slowPollInterval);

        document.addEventListener('analysis-complete', () => {
            updateFastLane();
            updateSlowLane();
        });

    } catch (e) {
        console.error('Error initializing dashboard:', e);
    }
}

async function updateAll() {
    await updateFastLane();
    await updateSlowLane();
}

async function updateFastLane() {
    await fetchSystemStatus();
    await fetchBrainStatus();
    await updatePositionData();
}

async function updateSlowLane() {
    await fetchRules();
    await fetchCosts();
    await updatePerformanceData();
    await updateSynapses();
    await updateLogs();
    await updateVisuals();
    await updateVectorData();
    await updateStatisticsData();
    await updateNewsData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

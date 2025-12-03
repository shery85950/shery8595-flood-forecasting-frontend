/**
 * AI Weather Forecast Agent
 * Analyzes weekly weather forecasts and generates flood warning levels
 * Now uses backend proxy to avoid CORS and secure API keys
 */

const AI_CONFIG = {
    BACKEND_API_URL: 'https://flood-forecast-backend-production.up.railway.app/api/forecasts/ai-analysis'
};

/**
 * Main function to analyze weekly forecast and generate warnings
 * @param {string} location - Location name or coordinates
 * @returns {Promise<Object>} AI-generated forecast analysis
 */
async function analyzeWeeklyForecast(location) {
    try {
        console.log(`[AI Agent] Starting weekly forecast analysis for: ${location}`);

        // Call backend proxy endpoint
        const url = `${AI_CONFIG.BACKEND_API_URL}?location=${encodeURIComponent(location)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Analysis failed');
        }

        return result;
    } catch (error) {
        console.error('[AI Agent] Error:', error);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Get color class for warning level
 * @param {string} level - Warning level
 * @returns {string} CSS class name
 */
function getWarningColor(level) {
    const colors = {
        'Low': 'success',
        'Moderate': 'warning',
        'High': 'danger',
        'Critical': 'critical'
    };
    return colors[level] || 'secondary';
}

/**
 * Get icon for warning level
 * @param {string} level - Warning level
 * @returns {string} Font Awesome icon class
 */
function getWarningIcon(level) {
    const icons = {
        'Low': 'fa-check-circle',
        'Moderate': 'fa-exclamation-triangle',
        'High': 'fa-exclamation-circle',
        'Critical': 'fa-skull-crossbones'
    };
    return icons[level] || 'fa-info-circle';
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeWeeklyForecast,
        getWarningColor,
        getWarningIcon
    };
}

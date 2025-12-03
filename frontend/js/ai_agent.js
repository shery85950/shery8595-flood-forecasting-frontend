const AI_CONFIG = {
    API_KEY: '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',
    MODEL: 'SentientAGI/Dobby-Unhinged-Llama-3.3-70B:fireworks-ai',
    API_URL: 'https://api-inference.huggingface.co/models/SentientAGI/Dobby-Unhinged-Llama-3.3-70B:fireworks-ai'
};

async function getAIForecastAnalysis(weatherData) {
    const prompt = `
You are a weather forecasting assistant. Analyze the following weather data and provide a warning level (Low, Medium, High, Critical) and a brief summary of the forecast and any potential risks.

Weather Data:
${JSON.stringify(weatherData, null, 2)}

Please provide the output in the following JSON format:
{
    "warning_level": "Level",
    "summary": "Your summary here"
}
`;

    try {
        const response = await fetch(AI_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 500,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            throw new Error(`AI API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        // Handle the response format for chat models which might return an array or object
        // and content might be in generated_text or similar fields depending on the specific model/API version
        let content = '';
        if (Array.isArray(result) && result.length > 0) {
            content = result[0].generated_text;
        } else if (result.generated_text) {
            content = result.generated_text;
        } else if (result.content) {
            content = result.content;
        } else {
            // Fallback if structure is unexpected, try to stringify
            content = JSON.stringify(result);
        }

        // Attempt to parse JSON from the content if the model followed instructions
        // The model might include markdown code blocks, so we clean that up
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            // Fallback if no JSON found
            return {
                warning_level: "Unknown",
                summary: content
            };
        }

    } catch (error) {
        console.error('AI Analysis Failed:', error);
        return {
            warning_level: "Error",
            summary: "Failed to generate AI analysis. Please try again later."
        };
    }
}

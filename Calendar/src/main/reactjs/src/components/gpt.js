export const getTodaySaju = async ({ birthDate, birthTime }) => {
    const messages = [
        {
            role: "system",
            content: `You are an expert fortune teller specializing in the Four Pillars of Destiny (Saju). Based on the given birth date and birth time, generate an analysis for today's fortune. The response should be in Korean and include:
            
            1. [오늘의 사주 개요]: A brief analysis of the person's energy flow and overall luck for today.
            2. [재물운]: Financial fortune analysis.
            3. [직장운]: Career-related predictions.
            4. [연애운]: Romantic relationship forecast.
            5. [건강운]: Health insights.
            6. [행운의 요소]: Lucky colors, numbers, and directions.`
        },
        {
            role: "user",
            content: `사용자의 생년월일: ${birthDate}, 출생 시간: ${birthTime} 
            오늘의 사주를 분석해줘.`
        }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_GPT_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages,
            temperature: 0.7,
            max_tokens: 1000,
        }),
    });

    const responseData = await response.json();

    return responseData.choices[0].message.content;
};

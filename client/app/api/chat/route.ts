import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Use OpenAI or Perplexity (OpenAI compatible API)
        // Preference: Perplexity Sonar as requested by user
        const apiKey = process.env.OPENAI_API_KEY || process.env.PERPLEXITY_API_KEY;
        const apiUrl = process.env.PERPLEXITY_API_KEY
            ? 'https://api.perplexity.ai/chat/completions'
            : 'https://api.openai.com/v1/chat/completions';

        const model = process.env.PERPLEXITY_API_KEY ? 'llama-3.1-sonar-small-128k-online' : 'gpt-4o-mini';

        if (!apiKey) {
            // Fallback for demo if no API key is provided
            console.warn("AI API Key missing. Using mock response.");
            return NextResponse.json({
                role: 'assistant',
                content: "Désolé, l'assistant IA n'est pas encore configuré avec une clé API. Veuillez ajouter votre clé OPENAI_API_KEY ou PERPLEXITY_API_KEY dans le fichier .env"
            });
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: "Tu es un assistant médical virtuel pour SahaLink, une plateforme de télémédecine en Algérie. Ton rôle est de fournir des conseils de santé généraux, d'expliquer des termes médicaux, et d'aider les patients à comprendre leurs symptômes sans toutefois donner un diagnostic définitif. Rappelle toujours au patient de consulter un médecin en cas de doute ou d'urgence. Réponds de manière empathique, professionnelle et précise. Réponds en français par défaut."
                    },
                    ...messages
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("AI API Error:", data.error);

            // Handle Quota Exceeded specifically
            if (data.error.code === 'insufficient_quota') {
                return NextResponse.json({
                    role: 'assistant',
                    content: "Désolé, mon quota d'utilisation OpenAI est épuisé. Cela signifie que le compte associé à la clé API n'a plus de crédits. Veuillez recharger votre compte OpenAI ou utiliser une autre clé."
                });
            }

            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        return NextResponse.json(data.choices[0].message);
    } catch (error: any) {
        console.error("Chat API Route Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

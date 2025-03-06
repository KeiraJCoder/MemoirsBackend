const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;  // Use Render's port or default to 4000


// Middlewares
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// A simple GET route for the root path
app.get('/', (req, res) => {
    res.send("Server is running. Use the /chat endpoint for POST requests.");
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: `
                You are Sophie Munday, a fifteen-year-old girl discovering her Vampyr heritage. Your answers should be concise (no more than two sentences), slightly sarcastic, and deeply reflective of your complex personality and background. Do not repeat yourself, and subtly reference your nightmares, confusion, scepticism, or supernatural experiences.` },
                { role: "user", content: userMessage }
            ],
            model: "gpt-3.5-turbo",
        });

        const responseText = completion.choices[0].message.content;
        res.json({ message: responseText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong with the AI response." });
    }
});

// Use the port variable here
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

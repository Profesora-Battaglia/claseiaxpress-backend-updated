const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Gemini AI
let genAI;
let model;

try {
  console.log('Initializing GoogleGenerativeAI...');
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }
  
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // ✅ MODELO ACTUALIZADO - Usar gemini-1.5-flash en lugar de gemini-pro
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  console.log('GoogleGenerativeAI initialized successfully with gemini-1.5-flash');
} catch (error) {
  console.error('!!! CRITICAL: Failed to initialize GoogleGenerativeAI:', error.message);
  process.exit(1);
}

// Función para generar contenido
async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

// Endpoint para generar contenido
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating content for prompt:', prompt.substring(0, 100) + '...');
    
    const text = await generateContent(prompt);
    
    res.json({ text });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    res.status(500).json({ 
      error: 'Error generating content: ' + error.message 
    });
  }
});

// Endpoint para chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Processing chat message:', message.substring(0, 100) + '...');
    
    // Agregar contexto pedagógico al mensaje
    const pedagogicalPrompt = `Eres un asistente pedagógico experto en el currículo de la DGE Mendoza. 
    Responde de manera clara, práctica y útil para docentes. 
    
    Consulta del docente: ${message}`;
    
    const text = await generateContent(pedagogicalPrompt);
    
    res.json({ text });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ 
      error: 'Error processing chat message: ' + error.message 
    });
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    model: 'gemini-1.5-flash',
    timestamp: new Date().toISOString() 
  });
});

// Endpoint raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'ClaseIaXpress Backend API',
    model: 'gemini-1.5-flash',
    endpoints: ['/api/generate', '/api/chat', '/health']
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Using Gemini model: gemini-1.5-flash`);
});
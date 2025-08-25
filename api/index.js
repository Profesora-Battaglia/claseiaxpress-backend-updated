const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar Gemini AI
let genAI;
let model;

try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }
  
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} catch (error) {
  console.error('Failed to initialize GoogleGenerativeAI:', error.message);
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

// Función principal de Vercel
module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    // Endpoint raíz
    if (pathname === '/' && req.method === 'GET') {
      return res.json({ 
        message: 'ClaseIaXpress Backend API',
        model: 'gemini-1.5-flash',
        endpoints: ['/api/generate', '/api/chat', '/health']
      });
    }

    // Endpoint de salud
    if (pathname === '/health' && req.method === 'GET') {
      return res.json({ 
        status: 'OK', 
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString() 
      });
    }

    // Endpoint para generar contenido
    if (pathname === '/api/generate' && req.method === 'POST') {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const text = await generateContent(prompt);
      return res.json({ text });
    }

    // Endpoint para chat
    if (pathname === '/api/chat' && req.method === 'POST') {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const pedagogicalPrompt = `Eres un asistente pedagógico experto en el currículo de la DGE Mendoza. 
      Responde de manera clara, práctica y útil para docentes. 
      
      Consulta del docente: ${message}`;
      
      const text = await generateContent(pedagogicalPrompt);
      return res.json({ text });
    }

    // Ruta no encontrada
    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error: ' + error.message 
    });
  }
};
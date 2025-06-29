// pages/api/ai-proxy.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { model, inputs, parameters, task } = req.body;

    // Validate required fields
    if (!model || !inputs) {
      return res.status(400).json({ 
        error: 'Missing required fields: model and inputs' 
      });
    }

    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
    
    if (!apiKey) {
      console.warn('No Hugging Face API key configured');
      return res.status(503).json({ 
        error: 'AI service not configured',
        fallback: true 
      });
    }

    // Prepare the request to Hugging Face
    const huggingFaceUrl = `https://api-inference.huggingface.co/models/${model}`;
    
    console.log('🤖 Calling Hugging Face API:', {
      model,
      url: huggingFaceUrl,
      hasApiKey: !!apiKey,
      inputLength: typeof inputs === 'string' ? inputs.length : JSON.stringify(inputs).length
    });

    const requestBody = {
      inputs,
      ...(parameters && { parameters }),
      ...(task && { task })
    };

    const response = await fetch(huggingFaceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PrivScore/1.0',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Hugging Face response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Hugging Face API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      // Return structured error for client to handle
      return res.status(response.status).json({
        error: `Hugging Face API error: ${response.status} ${response.statusText}`,
        details: errorText,
        fallback: true
      });
    }

    const result = await response.json();
    
    console.log('✅ Hugging Face API success:', {
      resultType: typeof result,
      isArray: Array.isArray(result),
      hasContent: !!(result && (result.length || Object.keys(result).length))
    });

    // Return successful result
    return res.status(200).json({
      success: true,
      data: result,
      model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 AI Proxy error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      fallback: true
    });
  }
}

// Export config for larger payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
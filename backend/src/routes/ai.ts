import { Router } from 'express';
import { z } from 'zod';
import { resolveBarcode } from '../services/barcodeResolver';
import { chatWithAI } from '../services/aiAssistant';
import type { ChatMessage } from '@foodlens/core';

export const aiRouter = Router();

const chatSchema = z.object({
  productBarcodes: z.array(z.string()).min(1).max(3),
  messages: z.array(z.object({
    role: z.string(),
    content: z.string(),
    timestamp: z.any().optional(),
  })).optional().default([]),
  userMessage: z.string().min(1).max(1000),
  language: z.enum(['en', 'hi', 'auto']).optional().default('auto'),
});

// POST /api/ai/chat
aiRouter.post('/chat', async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    console.warn('[ai/chat] Validation error:', parsed.error.issues);
    return res.status(400).json({
      success: false,
      error: 'Invalid request format',
      details: parsed.error.issues,
    });
  }

  const { productBarcodes, messages, userMessage } = parsed.data;

  try {
    // Resolve products
    const products = (
      await Promise.all(productBarcodes.map((b) => resolveBarcode(b)))
    ).filter(Boolean) as Awaited<ReturnType<typeof resolveBarcode>>[];

    if (products.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found for analysis' });
    }

    const response = await chatWithAI(
      products as NonNullable<typeof products[0]>[],
      messages as ChatMessage[],
      userMessage
    );

    return res.json({ success: true, data: { reply: response } });
  } catch (err: any) {
    console.error('[ai/chat] Error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'AI assistant failed to generate response' });
  }
});

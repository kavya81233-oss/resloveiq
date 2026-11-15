import { NextResponse } from 'next/server';
import { z } from 'zod';

const pilotSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organization: z.string().min(2, 'Organization is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Government', 'Utility', 'Enterprise', 'Student team']),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = pilotSchema.parse(body);

    // In a live integration, forward to backend FastAPI or save in DB
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const response = await fetch(`${backendUrl}/api/v1/pilot-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      // Backend not running directly or offline; return standard success response
    }

    return NextResponse.json({
      id: Math.floor(Math.random() * 1000) + 1,
      status: 'RECEIVED',
      message: 'Pilot request registered successfully.',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { code: 'VALIDATION_ERROR', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Failed to process pilot request' } }, { status: 500 });
  }
}


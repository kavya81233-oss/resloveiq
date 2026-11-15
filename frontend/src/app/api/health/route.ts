import { NextResponse } from 'next/server';

export async function GET() {
  const hasGuard = Boolean(process.env.NVIDIA_GUARD_API_KEY || process.env.NVIDIA_API_KEY);
  const hasNemotron = Boolean(process.env.NVIDIA_NEMOTRON_API_KEY || process.env.NVIDIA_MULTILINGUAL_API_KEY || process.env.NVIDIA_API_KEY);

  return NextResponse.json({
    status: 'operational',
    version: '1.0.0',
    deployment: 'vercel-edge',
    model_readiness: {
      nvidia_nim_llama_guard: hasGuard,
      nvidia_nim_nemotron: hasNemotron,
      understand_agent: true,
      cluster_engine: true,
      priority_engine: true,
      router_engine: true,
      resolution_copilot: true,
      risk_guard: true,
      closure_agent: true,
    },
  });
}


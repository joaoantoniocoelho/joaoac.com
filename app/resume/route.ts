import { NextResponse } from 'next/server';
import { RESUME_PATH } from '@/lib/site';

export function GET(request: Request) {
  return NextResponse.redirect(new URL(RESUME_PATH, request.url), 308);
}

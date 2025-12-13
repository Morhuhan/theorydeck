import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getTheories, createTheory } from '@/lib/api/theories';
import { validateTheoryForm } from '@/lib/utils/validation';
import { TheoryFormData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const realm = searchParams.get('realm');
    const topic = searchParams.get('topic');
    const search = searchParams.get('search');

    const theories = await getTheories({
      status: status as any,
      realm: realm || undefined,
      topic: topic || undefined,
      search: search || undefined,
    });

    return NextResponse.json({ data: theories });
  } catch (error) {
    console.error('Error fetching theories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = validateTheoryForm(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const theory = await createTheory(body as TheoryFormData, session.user.id);

    return NextResponse.json({ data: theory }, { status: 201 });
  } catch (error) {
    console.error('Error creating theory:', error);
    return NextResponse.json(
      { error: 'Failed to create theory' },
      { status: 500 }
    );
  }
}
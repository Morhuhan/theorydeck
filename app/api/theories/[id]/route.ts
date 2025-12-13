import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getTheoryById, updateTheory, deleteTheory } from '@/lib/api/theories';
import { validateTheoryForm } from '@/lib/utils/validation';
import { canEditTheory, canDeleteTheory } from '@/lib/utils/permissions';
import { TheoryFormData } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const theory = await getTheoryById(params.id);

    if (!theory) {
      return NextResponse.json(
        { error: 'Theory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: theory });
  } catch (error) {
    console.error('Error fetching theory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theory' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const theory = await getTheoryById(params.id);

    if (!theory) {
      return NextResponse.json(
        { error: 'Theory not found' },
        { status: 404 }
      );
    }

    if (!canEditTheory(session.user.id, theory.authorId, session.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = validateTheoryForm({ ...theory, ...body });

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const updatedTheory = await updateTheory(params.id, body as Partial<TheoryFormData>);

    return NextResponse.json({ data: updatedTheory });
  } catch (error) {
    console.error('Error updating theory:', error);
    return NextResponse.json(
      { error: 'Failed to update theory' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const theory = await getTheoryById(params.id);

    if (!theory) {
      return NextResponse.json(
        { error: 'Theory not found' },
        { status: 404 }
      );
    }

    if (!canDeleteTheory(session.user.id, theory.authorId, session.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await deleteTheory(params.id);

    return NextResponse.json({ message: 'Theory deleted successfully' });
  } catch (error) {
    console.error('Error deleting theory:', error);
    return NextResponse.json(
      { error: 'Failed to delete theory' },
      { status: 500 }
    );
  }
}
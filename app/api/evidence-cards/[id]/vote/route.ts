import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { voteOnCard, removeVote } from '@/lib/api/votes';
import { validateVoteStrength } from '@/lib/utils/validation';

export async function POST(
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

    const { strength } = await request.json();

    if (!validateVoteStrength(strength)) {
      return NextResponse.json(
        { error: 'Invalid vote strength. Must be 0, 2, 5, 8, or 10' },
        { status: 400 }
      );
    }

    const vote = await voteOnCard(params.id, session.user.id, strength);

    return NextResponse.json({ data: vote });
  } catch (error) {
    console.error('Error voting on card:', error);
    return NextResponse.json(
      { error: 'Failed to vote on card' },
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

    await removeVote(params.id, session.user.id);

    return NextResponse.json({ message: 'Vote removed successfully' });
  } catch (error) {
    console.error('Error removing vote:', error);
    return NextResponse.json(
      { error: 'Failed to remove vote' },
      { status: 500 }
    );
  }
}
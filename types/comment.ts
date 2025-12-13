import { Comment } from '@prisma/client';

export type CommentWithAuthor = Comment & {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count?: {
    replies: number;
  };
};

export type CommentWithReplies = CommentWithAuthor & {
  replies: CommentWithAuthor[];
};

export type CommentFormData = {
  content: string;
  theoryId?: string;
  cardId?: string;
  parentId?: string;
};

export type { Comment };
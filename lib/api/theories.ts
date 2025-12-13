import { TheoryFormData, TheoryFilters } from '@/types';
import { generateUniqueSlug } from '@/lib/utils/slug';
import { TheoryStatus } from '@prisma/client';
import prisma from '../db/prisma';

export async function getTheories(filters: TheoryFilters = {}) {
  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.realm) {
    where.realm = filters.realm;
  }

  if (filters.topic) {
    where.topic = filters.topic;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { claim: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const theories = await prisma.theory.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          evidenceCards: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return theories;
}

export async function getTheoryBySlug(slug: string) {
  const theory = await prisma.theory.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      evidenceCards: {
        where: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
          stance: true,
          status: true,
          _count: {
            select: {
              votes: true,
            },
          },
        },
      },
      _count: {
        select: {
          evidenceCards: true,
          comments: true,
        },
      },
    },
  });

  return theory;
}

export async function getTheoryById(id: string) {
  const theory = await prisma.theory.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          evidenceCards: true,
          comments: true,
        },
      },
    },
  });

  return theory;
}

export async function createTheory(data: TheoryFormData, authorId: string) {
  const slug = await generateUniqueSlug(data.title, async (slug) => {
    const existing = await prisma.theory.findUnique({ where: { slug } });
    return !!existing;
  });

  const theory = await prisma.theory.create({
    data: {
      title: data.title,
      slug,
      claim: data.claim,
      tldr: data.tldr,
      realm: data.realm,
      topic: data.topic,
      tags: data.tags || [],
      authorId,
      status: TheoryStatus.ACTIVE,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return theory;
}

export async function updateTheory(id: string, data: Partial<TheoryFormData>) {
  const theory = await prisma.theory.update({
    where: { id },
    data: {
      title: data.title,
      claim: data.claim,
      tldr: data.tldr,
      realm: data.realm,
      topic: data.topic,
      tags: data.tags,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return theory;
}

export async function deleteTheory(id: string) {
  await prisma.theory.delete({
    where: { id },
  });
}

export async function updateTheoryStatus(id: string, status: TheoryStatus) {
  const theory = await prisma.theory.update({
    where: { id },
    data: { status },
  });

  return theory;
}
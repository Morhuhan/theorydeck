'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { validateTheoryForm } from '@/lib/utils/validation';
import { TheoryFormData } from '@/types';

export function TheoryForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data: TheoryFormData = {
      title: formData.get('title') as string,
      claim: formData.get('claim') as string,
      tldr: formData.get('tldr') as string,
      realm: formData.get('realm') as string || undefined,
      topic: formData.get('topic') as string || undefined,
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
    };

    const validation = validateTheoryForm(data);

    if (!validation.valid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/theories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: errorData.error });
        return;
      }

      const result = await response.json();
      router.push(`/theories/${result.data.slug}`);
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., The Matrix is a documentary"
            disabled={isLoading}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="claim">Claim *</Label>
          <Textarea
            id="claim"
            name="claim"
            rows={4}
            placeholder="Detailed explanation of what you're claiming..."
            disabled={isLoading}
            className={errors.claim ? 'border-red-500' : ''}
          />
          {errors.claim && (
            <p className="text-sm text-red-600">{errors.claim}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tldr">TL;DR *</Label>
          <Textarea
            id="tldr"
            name="tldr"
            rows={2}
            placeholder="Brief summary in 2-3 sentences..."
            disabled={isLoading}
            className={errors.tldr ? 'border-red-500' : ''}
          />
          {errors.tldr && (
            <p className="text-sm text-red-600">{errors.tldr}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="realm">Realm</Label>
            <Input
              id="realm"
              name="realm"
              placeholder="e.g., Entertainment, Science"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="e.g., Movies, Physics"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            placeholder="e.g., sci-fi, philosophy, simulation"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Creating...' : 'Create Theory'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
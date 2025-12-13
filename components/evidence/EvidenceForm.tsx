'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateEvidenceForm } from '@/lib/utils/validation';
import { EvidenceFormData, Stance } from '@/types';

interface EvidenceFormProps {
  theoryId: string;
  theorySlug: string;
  defaultStance?: 'FOR' | 'AGAINST';
}

export function EvidenceForm({ theoryId, theorySlug, defaultStance }: EvidenceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stance, setStance] = useState<Stance>(defaultStance || 'FOR');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data: EvidenceFormData = {
      content: formData.get('content') as string,
      source: formData.get('source') as string || undefined,
      sourceTitle: formData.get('sourceTitle') as string || undefined,
      context: formData.get('context') as string || undefined,
      stance,
    };

    const validation = validateEvidenceForm(data);

    if (!validation.valid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/evidence-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, theoryId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: errorData.error });
        return;
      }

      router.push(`/theories/${theorySlug}`);
      router.refresh();
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
          <Label htmlFor="stance">Stance *</Label>
          <Select value={stance} onValueChange={(value) => setStance(value as Stance)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FOR">Supporting (For)</SelectItem>
              <SelectItem value="AGAINST">Opposing (Against)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Evidence *</Label>
          <Textarea
            id="content"
            name="content"
            rows={6}
            placeholder="Describe the evidence and why it supports or opposes the theory..."
            disabled={isLoading}
            className={errors.content ? 'border-red-500' : ''}
          />
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source URL</Label>
          <Input
            id="source"
            name="source"
            type="url"
            placeholder="https://example.com/article"
            disabled={isLoading}
            className={errors.source ? 'border-red-500' : ''}
          />
          {errors.source && (
            <p className="text-sm text-red-600">{errors.source}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sourceTitle">Source Title</Label>
          <Input
            id="sourceTitle"
            name="sourceTitle"
            placeholder="Article or document title"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="context">Additional Context</Label>
          <Textarea
            id="context"
            name="context"
            rows={3}
            placeholder="Any additional context or background information..."
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Adding...' : 'Add Evidence'}
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
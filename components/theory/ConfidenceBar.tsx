import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ConfidenceScore, getConfidenceLabel, getConfidenceColor } from '@/lib/utils/confidence';

interface ConfidenceBarProps {
  confidence: ConfidenceScore;
}

export function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  const label = getConfidenceLabel(confidence.confidence);
  const colorClass = getConfidenceColor(confidence.confidence);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Community Confidence</h3>
        <div className="text-right">
          <div className="text-2xl font-bold">{confidence.confidence}%</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>

      <Progress value={confidence.confidence} className="h-3 mb-4" />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">For:</span>
          <span className="font-semibold text-green-600">
            {confidence.forCards} cards ({Math.round(confidence.forScore)})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Against:</span>
          <span className="font-semibold text-red-600">
            {confidence.againstCards} cards ({Math.round(confidence.againstScore)})
          </span>
        </div>
      </div>
    </Card>
  );
}
import { Badge } from "../ui/badge";

interface TagBadgeProps {
  text: string;
  variant?: 'realm' | 'topic' | 'default';
}

export function TagBadge({ text, variant = 'default' }: TagBadgeProps) {
  const variantClasses = {
    realm: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    topic: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  };

  return (
    <Badge variant="secondary" className={variantClasses[variant]}>
      {text}
    </Badge>
  );
}
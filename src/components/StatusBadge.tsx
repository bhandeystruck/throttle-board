import { FlightStatus } from '@/types/flight';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: FlightStatus;
  className?: string;
}

const statusConfig = {
  requested: {
    label: 'Requested',
    color: 'bg-status-requested text-white',
  },
  queued: {
    label: 'Queued',
    color: 'bg-status-queued text-white',
  },
  planning: {
    label: 'Planning',
    color: 'bg-status-planning text-white',
  },
  underway: {
    label: 'Underway',
    color: 'bg-status-underway text-white',
  },
  edited: {
    label: 'Edited',
    color: 'bg-status-edited text-white',
  },
  published: {
    label: 'Published',
    color: 'bg-status-published text-white',
  },
  declined: {
    label: 'Declined',
    color: 'bg-status-declined text-white',
  },
  archived: {
    label: 'Archived',
    color: 'bg-status-archived text-white',
  },
} as const;

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'status-badge',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
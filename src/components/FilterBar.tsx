import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { FlightStatus, FilterOptions } from '@/types/flight';

interface FilterBarProps {
  onFiltersChange: (filters: FilterOptions) => void;
  totalResults: number;
}

const statusOptions: { value: FlightStatus; label: string }[] = [
  { value: 'requested', label: 'Requested' },
  { value: 'queued', label: 'Queued' },
  { value: 'planning', label: 'Planning' },
  { value: 'underway', label: 'Underway' },
  { value: 'edited', label: 'Edited' },
  { value: 'published', label: 'Published' },
  { value: 'declined', label: 'Declined' },
  { value: 'archived', label: 'Archived' },
];

export function FilterBar({ onFiltersChange, totalResults }: FilterBarProps) {
  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<FlightStatus[]>([]);
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('newest');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange({
      search: value || undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      sortBy,
    });
  };

  const handleStatusToggle = (status: FlightStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    
    setSelectedStatuses(newStatuses);
    onFiltersChange({
      search: search || undefined,
      status: newStatuses.length > 0 ? newStatuses : undefined,
      sortBy,
    });
  };

  const handleSortChange = (value: FilterOptions['sortBy']) => {
    setSortBy(value);
    onFiltersChange({
      search: search || undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      sortBy: value,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedStatuses([]);
    setSortBy('newest');
    onFiltersChange({ sortBy: 'newest' });
  };

  const hasActiveFilters = search || selectedStatuses.length > 0 || sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by airport, city, aircraft, or route..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="eta">ETA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Status Filters</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs h-6 px-2"
            >
              <X className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <Badge
              key={status.value}
              variant={selectedStatuses.includes(status.value) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => handleStatusToggle(status.value)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {totalResults} flight{totalResults !== 1 ? 's' : ''} found
          {hasActiveFilters && ' with current filters'}
        </span>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Search } from 'lucide-react';

export interface FilterOptions {
  search: string;
  priority: string[];
  completed: 'all' | 'completed' | 'pending';
  labels: string[];
  members: string[];
  hasAttachments: boolean;
  hasDueDate: boolean;
  overdue: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterOptions) => void;
  availableLabels: Array<{ id: string; name: string; color: string; }>;
  availableMembers: Array<{ id: string; name: string; }>;
  currentFilters: FilterOptions;
}

export function FilterModal({ 
  isOpen, 
  onClose, 
  onApplyFilter, 
  availableLabels,
  availableMembers,
  currentFilters 
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      search: '',
      priority: [],
      completed: 'all',
      labels: [],
      members: [],
      hasAttachments: false,
      hasDueDate: false,
      overdue: false,
    };
    setFilters(clearedFilters);
    onApplyFilter(clearedFilters);
  };

  const togglePriority = (priority: string) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority]
    }));
  };

  const toggleLabel = (labelId: string) => {
    setFilters(prev => ({
      ...prev,
      labels: prev.labels.includes(labelId)
        ? prev.labels.filter(l => l !== labelId)
        : [...prev.labels, labelId]
    }));
  };

  const toggleMember = (memberId: string) => {
    setFilters(prev => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter(m => m !== memberId)
        : [...prev.members, memberId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtrar Cards
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label>Buscar</Label>
            <Input
              placeholder="Buscar por título ou descrição..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <div className="flex gap-2 flex-wrap">
              {['low', 'medium', 'high'].map((priority) => (
                <Button
                  key={priority}
                  variant={filters.priority.includes(priority) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => togglePriority(priority)}
                >
                  {priority === 'low' ? 'Baixa' : priority === 'medium' ? 'Média' : 'Alta'}
                </Button>
              ))}
            </div>
          </div>

          {/* Completion Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.completed} onValueChange={(value: any) => setFilters(prev => ({ ...prev, completed: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Labels */}
          {availableLabels.length > 0 && (
            <div className="space-y-2">
              <Label>Etiquetas</Label>
              <div className="flex gap-2 flex-wrap">
                {availableLabels.map((label) => (
                  <Badge
                    key={label.id}
                    variant={filters.labels.includes(label.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    style={filters.labels.includes(label.id) ? { backgroundColor: label.color, color: 'white' } : {}}
                    onClick={() => toggleLabel(label.id)}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          {availableMembers.length > 0 && (
            <div className="space-y-2">
              <Label>Membros</Label>
              <div className="flex gap-2 flex-wrap">
                {availableMembers.map((member) => (
                  <Button
                    key={member.id}
                    variant={filters.members.includes(member.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleMember(member.id)}
                  >
                    {member.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Additional Filters */}
          <div className="space-y-3">
            <Label>Filtros adicionais</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAttachments"
                  checked={filters.hasAttachments}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasAttachments: !!checked }))}
                />
                <Label htmlFor="hasAttachments">Com anexos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDueDate"
                  checked={filters.hasDueDate}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasDueDate: !!checked }))}
                />
                <Label htmlFor="hasDueDate">Com data de vencimento</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overdue"
                  checked={filters.overdue}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, overdue: !!checked }))}
                />
                <Label htmlFor="overdue">Em atraso</Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleClear}>
              Limpar filtros
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleApply}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

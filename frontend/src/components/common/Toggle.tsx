import * as React from 'react';
import * as Switch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled = false, className }) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn(
          'w-14 h-8 rounded-full relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50',
          checked ? 'bg-primary-500' : 'bg-gray-300'
        )}
        aria-label={label || 'Toggle'}
      >
        <Switch.Thumb
          className={cn(
            'block w-6 h-6 bg-white rounded-full shadow-lg transition-transform',
            checked ? 'translate-x-7' : 'translate-x-1'
          )}
        />
      </Switch.Root>
      {label && <label className="text-child-sm font-medium text-gray-700">{label}</label>}
    </div>
  );
};

Toggle.displayName = 'Toggle';

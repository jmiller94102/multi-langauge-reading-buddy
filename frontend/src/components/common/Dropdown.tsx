import * as React from 'react';
import * as Select from '@radix-ui/react-select';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
}) => {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger
        className={cn(
          'inline-flex items-center justify-between gap-2 w-full min-h-touch px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-child-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50',
          className
        )}
        aria-label="Select option"
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-xl shadow-xl border border-gray-200">
          <Select.Viewport className="p-2">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="relative flex items-center min-h-touch px-4 py-3 text-child-sm text-gray-700 rounded-lg cursor-pointer hover:bg-primary-50 focus:bg-primary-50 focus:outline-none data-[state=checked]:bg-primary-100 data-[state=checked]:font-semibold"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-4">
                  <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

Dropdown.displayName = 'Dropdown';

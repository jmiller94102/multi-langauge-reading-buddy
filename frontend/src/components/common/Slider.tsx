import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  marks?: Array<{ value: number; label: string }>;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  showValue = false,
  marks,
  disabled = false,
  className,
}) => {
  const handleChange = (values: number[]) => {
    onChange(values[0] ?? min);
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-child-sm font-semibold text-gray-700 mb-2">
          {label}
          {showValue && <span className="ml-2 text-primary-500">({value})</span>}
        </label>
      )}
      <SliderPrimitive.Root
        value={[value]}
        onValueChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="relative flex items-center w-full h-10 select-none touch-none"
        aria-label={label || 'Slider'}
      >
        <SliderPrimitive.Track className="relative h-3 w-full grow rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-6 h-6 rounded-full border-4 border-primary-500 bg-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 hover:scale-110 transition-transform disabled:opacity-50" />
      </SliderPrimitive.Root>
      {marks && (
        <div className="flex justify-between mt-2">
          {marks.map((mark) => (
            <span key={mark.value} className="text-child-xs text-gray-600">
              {mark.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

Slider.displayName = 'Slider';

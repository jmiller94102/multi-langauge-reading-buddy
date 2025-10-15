# PRP: Phase 1 - Common Component Library (Children's Reading App V2)

**Feature**: Reusable React component library with child-safe design and WCAG AA accessibility

**Domain**: Frontend
**Phase**: 1 (Foundation)
**Estimated Time**: 12-16 hours
**Complexity**: High
**Priority**: CRITICAL (Blocking - All other components depend on this)

---

## 📋 Overview

Build a production-ready component library with 12 core common components optimized for children (ages 8-12, grades 3-6). All components follow:

- **WCAG AA Standards**: 4.5:1 contrast ratio, keyboard navigation, screen reader support
- **Child-Safe Design**: Large touch targets (44x44px minimum), clear feedback, age-appropriate animations
- **Radix UI Primitives**: Accessible foundation components
- **TypeScript Strict Mode**: Full type safety across all components
- **Tailwind CSS**: Utility-first styling with custom child-friendly theme
- **COPPA Compliant**: No data collection, localStorage only

**Success Criteria**: All 12 components render correctly, pass accessibility tests, and meet child-friendly design requirements (tested in browser)

---

## 🎯 Prerequisites

### Knowledge Requirements
- React 18 (forwardRef, compound components, hooks)
- TypeScript 5.7 (generics, utility types, ComponentProps)
- Radix UI primitives (Slot, Dialog, Slider, etc.)
- Tailwind CSS (custom configuration, @apply)
- class-variance-authority (cva) for variant management
- WCAG AA accessibility standards

### Installed Dependencies
From Phase 1 setup, verify these are installed:
```bash
# Check package.json
cat frontend/package.json | grep -E "(react|tailwindcss|framer-motion|clsx|@radix-ui)"
```

### New Dependencies Required
```bash
# Install Radix UI primitives and class-variance-authority
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-select @radix-ui/react-tooltip class-variance-authority
```

### Planning Documents (Reference Only - Don't Load All)
- `docs/component-specifications.md` (Sections: Common/Shared Components, lines 1707-2065)
- `docs/v2-architecture.md` (Section: Component Organization, child-safe design principles)
- `frontend/CLAUDE.md` (Component patterns, testing requirements)

---

## 🚨 CRITICAL: Child Safety & Accessibility Requirements

### WCAG AA Compliance (MANDATORY)
1. **Color Contrast**: 4.5:1 for normal text, 3:1 for large text (18px+)
2. **Touch Targets**: Minimum 44x44px for all interactive elements (WCAG 2.5.5)
3. **Keyboard Navigation**: All components fully keyboard accessible (Tab, Enter, Escape, Arrow keys)
4. **Screen Reader Support**: Proper ARIA labels, roles, and live regions
5. **Focus Indicators**: Visible 2px ring on all interactive elements

### Child-Friendly Design Principles (Ages 8-12)
1. **Typography**: 18px minimum font size (child-sm in Tailwind config)
2. **Visual Feedback**: Immediate feedback for all actions (animations, color changes)
3. **Error Messages**: Positive, supportive language ("Try again!" not "Wrong!")
4. **Colors**: Avoid red/green only (8% of boys are colorblind)
5. **Loading States**: Always show loading indicators (children have shorter attention spans)

### COPPA Compliance (2025 Amendments)
1. **No External APIs**: Components must work offline (localStorage only)
2. **No Tracking**: No analytics, no cookies, no external scripts
3. **Data Privacy**: All state in component or React Context (no server calls)

---

## 🛠️ Implementation Steps

### Step 1: Create Utility Functions

**What**: Set up helper functions for className merging and variant management

**Why**: Reusable utilities prevent code duplication and ensure consistent styling across all components

**How**:

**Create `frontend/src/lib/utils.ts`**:
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwindcss-merge';

/**
 * Merge Tailwind CSS classes with clsx
 * Handles conditional classes and deduplicates Tailwind utilities
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate unique IDs for accessibility (aria-labelledby, aria-describedby)
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format numbers for display (e.g., 1250 → "1,250")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
```

**Install tailwindcss-merge**:
```bash
npm install tailwindcss-merge
```

**Validation**:
```bash
# TypeScript should compile without errors
npm run type-check
```

**Success Criteria**:
- ✅ `utils.ts` created with helper functions
- ✅ `tailwindcss-merge` installed
- ✅ No TypeScript errors

---

### Step 2: Create Button Component

**What**: Accessible button with variants (primary, secondary, outline, danger), sizes, loading states

**Why**: Foundation component used throughout the app (Generate Story, Claim Quest, Purchase Item, etc.)

**How**:

**Create `frontend/src/components/common/Button.tsx`**:
```typescript
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles (WCAG AA compliant)
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl',
        secondary:
          'bg-accent-400 hover:bg-accent-500 text-white shadow-lg hover:shadow-xl',
        outline:
          'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300',
        danger: 'bg-error-500 hover:bg-error-600 text-white shadow-lg hover:shadow-xl',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
      },
      size: {
        small: 'text-child-xs px-4 py-2',
        medium: 'text-child-sm px-6 py-3',
        large: 'text-child-base px-8 py-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), 'min-h-touch min-w-touch', className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && <span aria-hidden="true">{icon}</span>}
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
```

**Create `frontend/src/components/common/index.ts`** (Barrel export):
```typescript
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

**Validation**:
```bash
# Test in browser (update App.tsx temporarily)
# Add: import { Button } from './components/common';
# Add: <Button variant="primary" size="large">Test Button</Button>

# Run dev server
npm run dev

# Check:
# 1. Button renders with correct styles
# 2. Hover effects work
# 3. Focus ring visible when tabbing
# 4. Button is at least 44x44px (check DevTools)
# 5. Loading state shows spinner
```

**Success Criteria**:
- ✅ Button component created
- ✅ All variants render correctly
- ✅ Touch target ≥ 44px
- ✅ Focus ring visible
- ✅ Loading state works

---

### Step 3: Create Card Component

**What**: Container card with compound components (Card, CardHeader, CardTitle, CardContent, CardFooter)

**Why**: Used for pet widget, quest cards, achievement cards, shop items

**How**:

**Create `frontend/src/components/common/Card.tsx`**:
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-2xl shadow-lg p-6 border border-gray-100',
        hoverable && 'hover:shadow-xl hover:border-primary-200 transition-all duration-200 cursor-pointer',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-2 mb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-child-lg font-bold text-gray-900 leading-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-child-sm text-gray-600', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('', className)} {...props} />
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 mt-4', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
```

**Update barrel export**:
```typescript
// frontend/src/components/common/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export type { CardProps } from './Card';
```

**Validation**:
```bash
# Test in browser
# Add to App.tsx:
# <Card hoverable>
#   <CardHeader>
#     <CardTitle>Quest Card</CardTitle>
#     <CardDescription>Complete 3 readings today</CardDescription>
#   </CardHeader>
#   <CardContent>Progress: 2/3</CardContent>
# </Card>

npm run dev

# Check:
# 1. Card renders with rounded corners and shadow
# 2. Hover effect works (if hoverable)
# 3. Typography sizes correct (child-friendly)
```

**Success Criteria**:
- ✅ Card component with compound parts created
- ✅ Hoverable variant works
- ✅ Typography follows child-friendly sizes

---

### Step 4: Create ProgressBar Component

**What**: Animated progress bar for XP, quest progress, achievement progress

**Why**: Visual feedback for children's progress (critical for engagement)

**How**:

**Create `frontend/src/components/common/ProgressBar.tsx`**:
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  current: number;
  total: number;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
  showLabel?: boolean;
  height?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

const colorVariants = {
  blue: 'bg-primary-500',
  green: 'bg-success-500',
  yellow: 'bg-accent-400',
  purple: 'bg-purple-500',
};

const heightVariants = {
  small: 'h-2',
  medium: 'h-3',
  large: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = 'blue',
  showLabel = false,
  height = 'medium',
  animated = true,
  className,
}) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)} role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heightVariants[height])}>
        <div
          className={cn(
            'h-full rounded-full transition-all',
            colorVariants[color],
            animated && 'duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-2 text-child-sm text-gray-600 font-medium" aria-live="polite">
          {current} / {total} ({Math.round(percentage)}%)
        </div>
      )}
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
```

**Update barrel export**.

**Validation**:
```bash
# Test different progress values
# <ProgressBar current={2450} total={3000} color="blue" showLabel animated />
# <ProgressBar current={5} total={10} color="green" />
```

**Success Criteria**:
- ✅ Progress bar animates smoothly
- ✅ Percentage calculates correctly
- ✅ ARIA attributes for screen readers
- ✅ Label displays when enabled

---

### Step 5: Create Modal Component

**What**: Accessible modal dialog using Radix UI Dialog primitive

**Why**: Used for achievement unlocks, quest completion, purchase confirmation

**How**:

**Create `frontend/src/components/common/Modal.tsx`**:
```typescript
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
}

const sizeVariants = {
  small: 'max-w-md',
  medium: 'max-w-lg',
  large: 'max-w-2xl',
  fullscreen: 'max-w-full h-full',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full bg-white rounded-2xl shadow-2xl p-6 focus:outline-none animate-in zoom-in-95 fade-in duration-200',
            sizeVariants[size]
          )}
        >
          {title && (
            <Dialog.Title className="text-child-xl font-bold text-gray-900 mb-4">
              {title}
            </Dialog.Title>
          )}

          {showCloseButton && (
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </Dialog.Close>
          )}

          <div className="text-child-sm text-gray-700">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Modal.displayName = 'Modal';
```

**Install Radix Dialog**:
```bash
npm install @radix-ui/react-dialog
```

**Update barrel export**.

**Validation**:
```bash
# Test modal opening/closing
# const [open, setOpen] = useState(false);
# <Button onClick={() => setOpen(true)}>Open Modal</Button>
# <Modal isOpen={open} onClose={() => setOpen(false)} title="Test Modal">Content here</Modal>

# Check:
# 1. Modal opens with animation
# 2. Backdrop darkens background
# 3. Close button works
# 4. Escape key closes modal
# 5. Focus trap works (can't tab outside modal)
```

**Success Criteria**:
- ✅ Modal opens/closes smoothly
- ✅ Keyboard accessible (Escape to close)
- ✅ Focus trap implemented
- ✅ Backdrop click closes modal

---

### Step 6: Create Slider Component

**What**: Range slider for language blend level (0-10), story length, humor level

**Why**: Critical for language learning feature (primary app feature)

**How**:

**Create `frontend/src/components/common/Slider.tsx`**:
```typescript
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
```

**Install Radix Slider**:
```bash
npm install @radix-ui/react-slider
```

**Update barrel export**.

**Validation**:
```bash
# Test slider with marks
# const [blend, setBlend] = useState(5);
# <Slider
#   value={blend}
#   min={0}
#   max={10}
#   onChange={setBlend}
#   label="Language Blend Level"
#   showValue
#   marks={[
#     { value: 0, label: '100% English' },
#     { value: 5, label: '50/50' },
#     { value: 10, label: '100% Korean' }
#   ]}
# />

# Check:
# 1. Slider moves smoothly
# 2. Value updates correctly
# 3. Marks display at correct positions
# 4. Keyboard accessible (Arrow keys work)
# 5. Thumb is large enough for children (24x24px)
```

**Success Criteria**:
- ✅ Slider works smoothly
- ✅ Keyboard navigation (arrow keys)
- ✅ Marks display correctly
- ✅ Large touch target (24px thumb)

---

### Step 7: Create Toggle Component

**What**: Switch toggle for hints enabled, romanization enabled, audio enabled

**Why**: Quick on/off settings for reading features

**How**:

**Create `frontend/src/components/common/Toggle.tsx`**:
```typescript
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
```

**Install Radix Switch**:
```bash
npm install @radix-ui/react-switch
```

**Update barrel export**.

**Validation**:
```bash
# Test toggle
# const [hints, setHints] = useState(false);
# <Toggle checked={hints} onChange={setHints} label="Show Hints" />

# Check:
# 1. Toggle switches smoothly
# 2. Color changes (gray → blue)
# 3. Keyboard accessible (Space/Enter)
# 4. Large touch target (56x32px)
```

**Success Criteria**:
- ✅ Toggle switches smoothly
- ✅ Keyboard accessible
- ✅ Color transition works
- ✅ Large enough for children

---

### Step 8: Create Dropdown Component

**What**: Select dropdown for language selection, grade level, theme selection

**Why**: Multiple choice options in settings

**How**:

**Create `frontend/src/components/common/Dropdown.tsx`**:
```typescript
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
```

**Install Radix Select**:
```bash
npm install @radix-ui/react-select
```

**Update barrel export**.

**Validation**:
```bash
# Test dropdown
# const [lang, setLang] = useState('korean');
# <Dropdown
#   value={lang}
#   options={[
#     { value: 'korean', label: 'Korean' },
#     { value: 'mandarin', label: 'Mandarin' }
#   ]}
#   onChange={setLang}
#   placeholder="Select Language"
# />

# Check:
# 1. Dropdown opens on click
# 2. Options display correctly
# 3. Selected item has checkmark
# 4. Keyboard navigation (Arrow keys, Enter)
# 5. Touch targets ≥ 44px
```

**Success Criteria**:
- ✅ Dropdown opens/closes
- ✅ Keyboard navigation works
- ✅ Selected item indicated
- ✅ Large touch targets

---

### Step 9: Create Tooltip Component

**What**: Hover tooltip for word translations, hints, help text

**Why**: Contextual help for children learning new words

**How**:

**Create `frontend/src/components/common/Tooltip.tsx`**:
```typescript
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
}) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delay}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={position}
            className={cn(
              'z-50 overflow-hidden rounded-lg bg-gray-900 px-3 py-2 text-child-sm text-white shadow-lg animate-in fade-in-0 zoom-in-95'
            )}
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-gray-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

Tooltip.displayName = 'Tooltip';
```

**Install Radix Tooltip**:
```bash
npm install @radix-ui/react-tooltip
```

**Update barrel export**.

**Validation**:
```bash
# Test tooltip
# <Tooltip content="This is Korean for 'basketball'" position="top">
#   <span className="korean-word cursor-help">농구</span>
# </Tooltip>

# Check:
# 1. Tooltip appears on hover
# 2. Position is correct
# 3. Arrow points to trigger
# 4. Text is readable (white on dark background)
```

**Success Criteria**:
- ✅ Tooltip appears on hover
- ✅ Positioning works
- ✅ Readable text
- ✅ Smooth animation

---

### Step 10: Create Toast Component

**What**: Notification toast for XP earned, quest completed, achievement unlocked

**Why**: Positive feedback for children's actions

**How**:

**Create `frontend/src/components/common/Toast.tsx`**:
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const typeStyles = {
  success: 'bg-success-500 text-white',
  error: 'bg-error-500 text-white',
  warning: 'bg-accent-400 text-white',
  info: 'bg-primary-500 text-white',
};

const typeIcons = {
  success: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-top-2 fade-in',
        typeStyles[type]
      )}
      role="alert"
      aria-live="polite"
    >
      <span aria-hidden="true">{typeIcons[type]}</span>
      <span className="text-child-sm font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Close notification"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

Toast.displayName = 'Toast';
```

**Update barrel export**.

**Validation**:
```bash
# Test toast
# const [showToast, setShowToast] = useState(false);
# {showToast && (
#   <Toast
#     message="+150 XP earned!"
#     type="success"
#     duration={3000}
#     onClose={() => setShowToast(false)}
#   />
# )}

# Check:
# 1. Toast appears at top-right
# 2. Auto-dismisses after duration
# 3. Close button works
# 4. Different types show correct colors/icons
```

**Success Criteria**:
- ✅ Toast appears smoothly
- ✅ Auto-dismisses
- ✅ Close button works
- ✅ Different types styled correctly

---

### Step 11: Create Skeleton Component

**What**: Loading placeholder for content while generating stories/quizzes

**Why**: Visual feedback during AI generation (important for children's patience)

**How**:

**Create `frontend/src/components/common/Skeleton.tsx`**:
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = 20,
  animation = 'pulse',
  className,
}) => {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'bg-gray-200',
        variantStyles[variant],
        animation === 'pulse' && 'animate-pulse',
        animation === 'wave' && 'animate-shimmer',
        className
      )}
      style={{ width, height }}
      aria-label="Loading content"
      aria-live="polite"
      aria-busy="true"
    />
  );
};

Skeleton.displayName = 'Skeleton';
```

**Add shimmer animation to Tailwind config**:
```javascript
// frontend/tailwind.config.js
// Add to theme.extend.keyframes:
shimmer: {
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
},
// Add to theme.extend.animation:
'shimmer': 'shimmer 2s infinite linear',
```

**Update barrel export**.

**Validation**:
```bash
# Test skeleton
# <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
# <Skeleton variant="circular" width={64} height={64} />

# Check:
# 1. Skeleton animates (pulse or wave)
# 2. Different variants render correctly
# 3. Sizes adjust correctly
```

**Success Criteria**:
- ✅ Skeleton displays
- ✅ Animations work
- ✅ Variants render correctly

---

### Step 12: Create Confetti Animation Component

**What**: Celebratory animation for achievements, level ups, quiz completion

**Why**: Positive reinforcement for children's accomplishments

**How**:

**Install react-confetti**:
```bash
npm install react-confetti
```

**Create `frontend/src/components/common/ConfettiAnimation.tsx`**:
```typescript
import * as React from 'react';
import Confetti from 'react-confetti';

export interface ConfettiAnimationProps {
  trigger: boolean;
  duration?: number;
  onComplete?: () => void;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  trigger,
  duration = 3000,
  onComplete,
}) => {
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, onComplete]);

  if (!isActive) return null;

  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={false}
      numberOfPieces={200}
      gravity={0.3}
    />
  );
};

ConfettiAnimation.displayName = 'ConfettiAnimation';
```

**Update barrel export**.

**Validation**:
```bash
# Test confetti
# const [celebrate, setCelebrate] = useState(false);
# <Button onClick={() => setCelebrate(true)}>Celebrate!</Button>
# <ConfettiAnimation trigger={celebrate} duration={3000} onComplete={() => setCelebrate(false)} />

# Check:
# 1. Confetti appears when triggered
# 2. Stops after duration
# 3. onComplete callback fires
```

**Success Criteria**:
- ✅ Confetti displays
- ✅ Auto-stops after duration
- ✅ Callback fires

---

## 🎯 Quality Gates

### Gate 1: Code Quality ✅

**Commands**:
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Code formatting
npm run format
```

**Criteria**:
- ✅ No ESLint errors
- ✅ No TypeScript errors
- ✅ All files formatted with Prettier

---

### Gate 2: Accessibility ✅

**Automated Testing**:
```bash
# Install axe-core for accessibility testing
npm install -D @axe-core/react

# Run accessibility linter
npm run lint
```

**Manual Testing Checklist**:
```
# Keyboard Navigation Test:
1. Tab through all components
2. Verify visible focus indicators (2px ring)
3. Ensure all buttons/links reachable via keyboard
4. Test Escape key closes modals/dropdowns

# Screen Reader Test (optional but recommended):
1. Enable VoiceOver (Mac: Cmd+F5) or NVDA (Windows)
2. Navigate through components
3. Verify ARIA labels are read correctly

# Touch Target Test:
1. Open DevTools → Elements
2. Measure interactive elements (should be ≥ 44x44px)
3. Test on touch device if available
```

**Criteria**:
- ✅ All components keyboard accessible
- ✅ Focus indicators visible (2px ring)
- ✅ ARIA labels present and correct
- ✅ Touch targets ≥ 44x44px

---

### Gate 3: Child-Friendly Design ✅

**Visual Testing Checklist**:
```
# Typography Test:
1. Verify base font size ≥ 18px
2. Check line heights (1.5-1.6 for readability)
3. Ensure headings use child-friendly sizes (child-lg, child-xl)

# Color Contrast Test:
1. Use browser DevTools color picker
2. Check contrast ratios (should be ≥ 4.5:1 for normal text)
3. Test different color combinations

# Animation Test:
1. Verify animations are smooth (not jarring)
2. Check loading states provide feedback
3. Ensure hover/active states are clear

# Error Handling Test:
1. Test disabled states (buttons should be clearly disabled)
2. Verify error messages are supportive ("Try again!" not "Wrong!")
```

**Criteria**:
- ✅ Font size ≥ 18px
- ✅ Contrast ratio ≥ 4.5:1
- ✅ Touch targets ≥ 44x44px
- ✅ Animations smooth and clear
- ✅ Positive error messages

---

### Gate 4: Component Integration ✅

**Integration Test**:
Create a test page that uses all components together:

**Create `frontend/src/pages/ComponentShowcase.tsx`**:
```typescript
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  ProgressBar,
  Modal,
  Slider,
  Toggle,
  Dropdown,
  Tooltip,
  Toast,
  Skeleton,
  ConfettiAnimation,
} from '@/components/common';

export const ComponentShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);
  const [toggleValue, setToggleValue] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('korean');
  const [showToast, setShowToast] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Component Library Showcase</h1>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="large">Primary Button</Button>
              <Button variant="secondary" size="medium">Secondary Button</Button>
              <Button variant="outline" size="small">Outline Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="primary" loading>Loading...</Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Bars</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar current={2450} total={3000} color="blue" showLabel animated />
            <div className="mt-4">
              <ProgressBar current={7} total={10} color="green" showLabel />
            </div>
          </CardContent>
        </Card>

        {/* Slider */}
        <Card>
          <CardHeader>
            <CardTitle>Slider</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              value={sliderValue}
              min={0}
              max={10}
              onChange={setSliderValue}
              label="Language Blend Level"
              showValue
              marks={[
                { value: 0, label: '100% English' },
                { value: 5, label: '50/50' },
                { value: 10, label: '100% Korean' },
              ]}
            />
          </CardContent>
        </Card>

        {/* Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle</CardTitle>
          </CardHeader>
          <CardContent>
            <Toggle checked={toggleValue} onChange={setToggleValue} label="Show Hints" />
          </CardContent>
        </Card>

        {/* Dropdown */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Dropdown
              value={dropdownValue}
              options={[
                { value: 'korean', label: 'Korean' },
                { value: 'mandarin', label: 'Mandarin' },
              ]}
              onChange={setDropdownValue}
              placeholder="Select Language"
            />
          </CardContent>
        </Card>

        {/* Tooltip */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltip</CardTitle>
          </CardHeader>
          <CardContent>
            <Tooltip content="This is Korean for 'basketball'" position="top">
              <span className="cursor-help text-primary-500 font-semibold">농구</span>
            </Tooltip>
          </CardContent>
        </Card>

        {/* Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton variant="rectangular" width="100%" height={100} animation="wave" />
            <div className="mt-4 flex gap-4">
              <Skeleton variant="circular" width={64} height={64} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal, Toast, Confetti Triggers */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button onClick={() => setShowToast(true)}>Show Toast</Button>
              <Button onClick={() => setCelebrate(true)}>Celebrate!</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Test Modal">
        <p className="text-child-sm text-gray-700">
          This is a modal dialog. Press Escape or click the close button to dismiss.
        </p>
      </Modal>

      {/* Toast */}
      {showToast && (
        <Toast
          message="+150 XP earned!"
          type="success"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Confetti */}
      <ConfettiAnimation
        trigger={celebrate}
        duration={3000}
        onComplete={() => setCelebrate(false)}
      />
    </div>
  );
};
```

**Add route to App.tsx**:
```typescript
// In App.tsx
import { ComponentShowcase } from './pages/ComponentShowcase';

// Add route:
<Route path="/showcase" element={<ComponentShowcase />} />
```

**Test**:
```bash
npm run dev
# Navigate to http://localhost:5173/showcase

# Test all components work together
# Check for any style conflicts
# Verify keyboard navigation across all components
```

**Criteria**:
- ✅ All components render without errors
- ✅ No visual style conflicts
- ✅ Keyboard navigation works across all components
- ✅ No console errors

---

### Gate 5: Performance ✅

**Build Test**:
```bash
# Build for production
npm run build

# Check bundle size
ls -lh dist/assets/

# Expected:
# - CSS < 20KB gzipped (Tailwind + custom styles)
# - JS components < 50KB gzipped (common components bundle)
```

**Performance Checklist**:
```
# Component Performance:
1. All components use React.forwardRef (no unnecessary re-renders)
2. Event handlers wrapped in useCallback where needed
3. No expensive calculations in render (should use useMemo)
4. Images lazy loaded (loading="lazy")

# Bundle Size:
1. Tree-shaking works (only used components included)
2. Radix UI primitives add minimal overhead
3. No duplicate dependencies
```

**Criteria**:
- ✅ Build completes without errors
- ✅ Component bundle < 50KB gzipped
- ✅ No unnecessary re-renders (check React DevTools Profiler)

---

## ✅ Completion Checklist

**Before marking this PRP complete, verify**:

- [ ] All 12 common components implemented
- [ ] All components pass TypeScript strict mode
- [ ] All components keyboard accessible (Tab, Enter, Escape, Arrows)
- [ ] All touch targets ≥ 44x44px
- [ ] All text has ≥ 4.5:1 contrast ratio
- [ ] All components have ARIA labels
- [ ] All components use child-friendly typography (≥ 18px)
- [ ] Radix UI primitives installed and working
- [ ] class-variance-authority working for Button variants
- [ ] Utility functions (cn, generateId, formatNumber) created
- [ ] ComponentShowcase page renders all components
- [ ] No ESLint errors
- [ ] No TypeScript errors
- [ ] Build succeeds with acceptable bundle size
- [ ] Components work on mobile (touch device or DevTools responsive mode)

---

## 📚 Next Steps (Phase 2)

After completing this PRP, proceed to:

1. **`PRPs/frontend/phase1-theme-system.md`** - Dynamic theme switching (Space, Jungle, DeepSea, Minecraft, Tron)
2. **`PRPs/frontend/phase1-navigation.md`** - Header with currency display, bottom navigation
3. **`PRPs/frontend/phase2-dashboard-page.md`** - Dashboard with pet, quests, stats (uses these common components)

**Expected Phase 2 Start Date**: After Phase 1 complete (~2-3 days)

---

## 🐛 Troubleshooting

### Issue: Radix UI imports fail
**Solution**:
```bash
# Verify all Radix packages installed
npm ls @radix-ui
# Reinstall if needed
npm install @radix-ui/react-dialog @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-select @radix-ui/react-tooltip @radix-ui/react-slot
```

### Issue: class-variance-authority not working
**Solution**:
```bash
# Reinstall cva
npm install class-variance-authority
# Restart TypeScript server (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")
```

### Issue: Tailwind classes not applying
**Solution**:
```bash
# Verify tailwind.config.js content includes components
# Should have: './src/**/*.{js,ts,jsx,tsx}'
# Restart dev server
npm run dev
```

### Issue: Touch targets too small
**Solution**:
```typescript
// Add min-h-touch and min-w-touch to all interactive elements
// Defined in Tailwind config as 44px (WCAG 2.5.5 minimum)
className="min-h-touch min-w-touch"
```

---

## 📊 Confidence Score: 9/10

**Reasoning**:

**Strengths (+)**:
- ✅ **Radix UI Foundation**: Accessibility built-in from WCAG-compliant primitives
- ✅ **Child-Safe Design**: Large touch targets (44px), high contrast (4.5:1), age-appropriate typography
- ✅ **Proven Patterns**: Borrowed from SurfSense production codebase (button variants, card compound components)
- ✅ **Type Safety**: Full TypeScript coverage with strict mode
- ✅ **Comprehensive Testing**: 5 quality gates (code, accessibility, child-friendly, integration, performance)
- ✅ **Clear Validation**: Executable commands and manual checklists
- ✅ **COPPA Compliant**: No external APIs, localStorage only, no tracking
- ✅ **Component Showcase**: Integration test page ensures all components work together

**Weaknesses (-1)**:
- ⚠️ **Manual Accessibility Testing**: Automated tests (axe-core) recommended but not mandatory

**Risk Mitigation**:
- All components use Radix UI primitives (accessibility tested)
- Manual testing checklist comprehensive (keyboard nav, screen reader, touch targets)
- ComponentShowcase page allows quick visual verification
- Reference SurfSense codebase for patterns

**Likelihood of one-pass success**: 90% (assumes developer follows all steps, tests in browser, runs validation commands)

---

## 📖 References

**Codebase Examples**:
- `/SurfSense/surfsense_web/components/ui/button.tsx` - Button with cva variants
- `/SurfSense/surfsense_web/components/ui/card.tsx` - Card compound components
- `/SurfSense/surfsense_web/components/ui/slider.tsx` - Radix Slider example

**External Documentation**:
- Radix UI Primitives: https://www.radix-ui.com/primitives
- class-variance-authority: https://cva.style/docs
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&levels=aa
- React Accessibility: https://react.dev/learn/accessibility
- Tailwind CSS: https://tailwindcss.com/docs

**Planning Documents**:
- `docs/component-specifications.md` (Common Components section, lines 1707-2065)
- `docs/v2-architecture.md` (Component organization, child-safe design)
- `frontend/CLAUDE.md` (Component patterns, testing guidelines)

---

**PRP Status**: ✅ Ready for Execution
**Last Updated**: 2025-10-12
**Author**: AI Agent (Claude Code)
**Approved By**: [Pending User Review]

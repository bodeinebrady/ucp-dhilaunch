import type * as React from 'react';

import { Check } from 'lucide-react';
import {cva, type VariantProps} from 'class-variance-authority';
import {Checkbox as CheckboxPrimitive} from 'radix-ui';

import {cn} from '../../lib/utils';

const checkboxVariants = cva(
  'peer ease-ease-default relative flex shrink-0 items-center justify-center rounded-lg border border-input shadow-xs transition-shadow outline-none group-has-disabled/field:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary',
  {
    variants: {
      size: {
        sm: 'size-3.5 after:absolute after:-inset-x-3.5 after:-inset-y-2.5',
        default: 'size-4 after:absolute after:-inset-x-3 after:-inset-y-2',
        lg: 'size-5 after:absolute after:-inset-x-2.5 after:-inset-y-1.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const indicatorSizeClasses: Record<string, string> = {
  sm: '[&>svg]:size-3',
  default: '[&>svg]:size-3.5',
  lg: '[&>svg]:size-4',
};

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  /**
   * The size of the checkbox.
   *
   * @default "default"
   */
  size?: VariantProps<typeof checkboxVariants>['size'];
};

/**
 * A control that allows the user to toggle between checked and not checked.
 *
 * ### Component Props
 *
 * See [Checkbox props](https://www.radix-ui.com/primitives/docs/components/checkbox) documentation for full details.
 *
 * | Prop               | Type                                          | Default |
 * | :----------------- | :-------------------------------------------- | :------ |
 * | _asChild_          | `boolean`                                     | `false` |
 * | _defaultChecked_   | `boolean \| "indeterminate"`                  | -       |
 * | _checked_          | `boolean \| "indeterminate"`                  | -       |
 * | _onCheckedChange_  | `(checked: boolean \| "indeterminate") => void` | -       |
 * | _disabled_         | `boolean`                                     | -       |
 * | _required_         | `boolean`                                     | -       |
 * | _name_             | `string`                                      | -       |
 * | _value_            | `string`                                      | `"on"`  |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Checkbox id="terms" />
 * <Label htmlFor="terms">Accept terms and conditions</Label>
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 1.3.1 Info and Relationships — Radix UI Checkbox renders with role="checkbox".
 * @wcag 1.4.11 Non-text Contrast — checkbox border achieves 3:1 against background in unchecked state.
 * @wcag 2.1.1 Keyboard — Space toggles the checkbox.
 * @wcag 4.1.2 Name, Role, Value — role="checkbox" and aria-checked managed by Radix UI; pair with a visible label.
 */
function Checkbox({className, size = 'default', ...props}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({size}), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          'grid place-content-center text-current transition-none',
          indicatorSizeClasses[size ?? 'default']
        )}
      >
        <Check />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export {Checkbox, checkboxVariants};
export type {CheckboxProps};

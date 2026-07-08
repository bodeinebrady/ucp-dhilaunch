import type * as React from 'react';

import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '../../lib/utils';

const inputVariants = cva(
  'ease-ease-default w-full min-w-0 rounded-md border border-input bg-transparent text-base text-foreground shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      size: {
        sm: 'h-8 px-2 py-0.5 text-sm file:h-6',
        default: 'h-9 px-2.5 py-1 file:h-7',
        lg: 'h-10 px-3 py-1.5 file:h-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

type InputProps = React.ComponentProps<'input'> & {
  /**
   * The size of the input.
   *
   * @default "default"
   */
  size?: VariantProps<typeof inputVariants>['size'];
};

/**
 * A styled text input element for forms.
 *
 * ### Example Usage
 *
 * ```tsx
 * <Input type="email" placeholder="you@example.com" />
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 1.4.3 Contrast (Minimum) — input text and placeholder meet contrast requirements via DDS tokens.
 * @wcag 2.1.1 Keyboard — natively focusable; value editable via keyboard.
 * @wcag 2.4.7 Focus Visible — focus ring applied via `focus-visible:ring-[3px]`.
 * @wcag 4.1.2 Name, Role, Value — use with `FieldLabel` (htmlFor) or `aria-label` for accessible name.
 */
function Input({className, type, size, ref, ...props}: InputProps) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(inputVariants({size}), className)}
      {...props}
    />
  );
}

export {Input, inputVariants};
export type {InputProps};

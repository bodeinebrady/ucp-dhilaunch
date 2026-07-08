import type * as React from 'react';

import {cn} from '../../lib/utils';

/**
 * A multi-line text input field with auto-sizing and consistent form styling.
 *
 * ### Component Props
 *
 * Accepts all standard `<textarea>` element props (`React.ComponentProps<'textarea'>`).
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Textarea placeholder="Type your message here..." />
 * <Textarea rows={5} disabled />
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 1.4.3 Contrast (Minimum) — text and border colors use DDS semantic tokens meeting contrast ratios.
 * @wcag 2.1.1 Keyboard — natively focusable `<textarea>` element.
 * @wcag 2.4.7 Focus Visible — focus ring applied via `focus-visible:ring-[3px]`.
 * @wcag 4.1.2 Name, Role, Value — native `<textarea>` element; accessible name via associated `<label>` or `aria-label`.
 */
function Textarea({
  className,
  ref,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        'ease-ease-default flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  );
}

export {Textarea};

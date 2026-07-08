import type * as React from 'react';

import { X } from 'lucide-react';

import {cn} from '../../lib/utils';
import {Button} from './button';

/**
 * A compact label element with an optional remove button.
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 4.1.2 Name, Role, Value — remove button includes a computed `aria-label` (e.g. "Remove {value}").
 * @wcag 2.1.1 Keyboard — remove button is a focusable `<button>` element, activated via Enter/Space.
 */
type TagProps = React.ComponentProps<'span'> & {
  /** Called when the user clicks the remove button. Omit to hide remove button. */
  onRemove?: () => void;
  disabled?: boolean;
};

function Tag({className, children, onRemove, disabled, ...props}: TagProps) {
  return (
    <span
      data-slot="tag"
      className={cn(
        'inline-flex h-6 items-center gap-1 rounded-md border border-border bg-muted px-2 text-xs font-medium text-foreground select-none',
        disabled && 'pointer-events-none opacity-60',
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          disabled={disabled}
          className="-mr-1 size-4 rounded-sm opacity-60 hover:opacity-100"
          aria-label={`Remove ${typeof children === 'string' ? children : 'tag'}`}
        >
          <X className="size-2.5" aria-hidden="true" />
        </Button>
      )}
    </span>
  );
}

export {Tag};
export type {TagProps};

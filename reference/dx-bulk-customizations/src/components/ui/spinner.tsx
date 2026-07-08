import {cva, type VariantProps} from 'class-variance-authority';
import {Loader2Icon} from 'lucide-react';

import {cn} from '../../lib/utils';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'size-4',
      default: 'size-6',
      lg: 'size-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * An animated loading spinner icon for indicating pending or in-progress states.
 *
 * ### Component Props
 *
 * Accepts all standard SVG element props (`React.ComponentProps<'svg'>`).
 *
 * | Prop   | Type                          | Default     |
 * | :----- | :---------------------------- | :---------- |
 * | _size_ | `"sm" \| "default" \| "lg"`   | `"default"` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Spinner />
 * <Spinner size="sm" />
 * <Spinner size="lg" className="text-muted-foreground" />
 * ```
 */
function Spinner({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'svg'> & VariantProps<typeof spinnerVariants>) {
  // TODO - there is no exact match for Lucide's Loader2Icon in untitledui
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({size}), className)}
      {...props}
    />
  );
}

export {Spinner, spinnerVariants};

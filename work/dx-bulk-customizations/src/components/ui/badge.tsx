import type {AsChild} from '../../lib/types';
import type * as React from 'react';

import {cva, type VariantProps} from 'class-variance-authority';
import {Slot} from 'radix-ui';

import {cn} from '../../lib/utils';

const badgeVariants = cva(
  'group/badge ease-ease-default inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent py-0.5 font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        premium:
          'bg-premium text-premium-foreground focus-visible:border-premium/80 focus-visible:ring-premium/50 [a]:hover:bg-premium/80',
        destructive:
          'bg-destructive text-destructive-foreground focus-visible:border-destructive/80 focus-visible:ring-destructive/50 [a]:hover:bg-destructive/80',
        success:
          'bg-success text-success-foreground focus-visible:border-success/80 focus-visible:ring-success/50 [a]:hover:bg-success/80',
        warning:
          'bg-warning text-warning-foreground focus-visible:border-warning/80 focus-visible:ring-warning/50 [a]:hover:bg-warning/80',
        outline:
          'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost:
          'text-foreground hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-5 px-2 text-xs',
        sm: 'h-4 px-1.5 text-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type BadgeProps = React.ComponentProps<'span'> &
  AsChild & {
    /**
     * The visual style of the badge.
     * @default "default"
     * @example
     * <Badge variant="secondary">Beta</Badge>
     */
    variant?: VariantProps<typeof badgeVariants>['variant'];
    /**
     * The size of the badge.
     * @default "default"
     * @example
     * <Badge size="sm">New</Badge>
     */
    size?: VariantProps<typeof badgeVariants>['size'];
  };

/**
 * Displays a badge or a component that looks like a badge.
 *
 * ### Component Props
 *
 * See [Badge props](https://ui.shadcn.com/docs/components/radix/badge) documentation for full details.
 *
 * | Prop      | Type                                                                                               | Default     |
 * | :-------- | :------------------------------------------------------------------------------------------------- | :---------- |
 * | _variant_ | `"default" \| "secondary" \| "premium" \| "destructive" \| "success" \| "warning" \| "outline" \| "ghost" \| "link"` | `"default"` |
 * | _size_    | `"default" \| "sm"`                                                          | `"default"` |
 * | _asChild_ | `boolean`                                                                    | `false`     |
 *
 *
 * ### Example Usage
 *
 * **Default**
 * ```tsx
 * <Badge>Default</Badge>
 * ```
 *
 * **Secondary**
 * ```tsx
 * <Badge variant="secondary">Beta</Badge>
 * ```
 *
 * **Destructive**
 * ```tsx
 * <Badge variant="destructive">Error</Badge>
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 1.4.1 Use of Color — badge variants use both color and text/icon to convey meaning.
 * @wcag 1.4.3 Contrast (Minimum) — badge text meets 4.5:1 contrast via DDS semantic tokens.
 * @wcag 4.1.2 Name, Role, Value — badges are presentational; wrap in a `<span aria-label>` if the badge is the only indicator.
 */
function Badge({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({variant, size}), className)}
      {...props}
    />
  );
}

export {Badge, badgeVariants};

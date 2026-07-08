import type * as React from 'react';

import {Separator as SeparatorPrimitive} from 'radix-ui';

import {cn} from '../../lib/utils';

/**
 * Visually or semantically separates content.
 *
 * ### Component Props
 *
 * See [Separator props](https://www.radix-ui.com/primitives/docs/components/separator) documentation for full details.
 *
 * | Prop           | Type                           | Default        |
 * | :------------- | :----------------------------- | :------------- |
 * | _asChild_      | `boolean`                      | `false`        |
 * | _orientation_  | `"horizontal" \| "vertical"`   | `"horizontal"` |
 * | _decorative_   | `boolean`                      | -              |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <div>
 *   <p>Above</p>
 *   <Separator />
 *   <p>Below</p>
 * </div>
 * ```
 */
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
        className
      )}
      {...props}
    />
  );
}

export {Separator};

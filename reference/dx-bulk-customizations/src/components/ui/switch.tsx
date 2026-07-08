'use client';

import type * as React from 'react';

import {Switch as SwitchPrimitive} from 'radix-ui';

import {cn} from '../../lib/utils';

/**
 * A control that allows the user to toggle between checked and not checked.
 *
 * ### Component Props
 *
 * See [Switch props](https://www.radix-ui.com/primitives/docs/components/switch) documentation for full details.
 *
 * | Prop               | Type                           | Default     |
 * | :----------------- | :----------------------------- | :---------- |
 * | _asChild_          | `boolean`                      | `false`     |
 * | _defaultChecked_   | `boolean`                      | -           |
 * | _checked_          | `boolean`                      | -           |
 * | _onCheckedChange_  | `(checked: boolean) => void`   | -           |
 * | _disabled_         | `boolean`                      | -           |
 * | _required_         | `boolean`                      | -           |
 * | _name_             | `string`                       | -           |
 * | _value_            | `string`                       | `"on"`      |
 * | _size_             | `"sm" \| "default" \| "lg"`    | `"default"` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Switch />
 * <Switch size="sm" checked={enabled} onCheckedChange={setEnabled} />
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 4.1.2 Name, Role, Value — semantic `switch` role via Radix Switch primitive.
 * @wcag 2.1.1 Keyboard — toggled via Space key; focusable by default.
 * @wcag 2.4.7 Focus Visible — focus ring applied via `focus-visible:ring-[3px]`.
 */
function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default' | 'lg';
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch ease-ease-default relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=lg]:h-6 data-[size=lg]:w-10 data-[size=sm]:h-3.5 data-[size=sm]:w-6 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="ease-ease-default pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=lg]/switch:size-5 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-[state=checked]:translate-x-[calc(100%-2px)] group-data-[size=lg]/switch:data-[state=checked]:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-[state=checked]:translate-x-[calc(100%-2px)] dark:data-[state=checked]:bg-primary-foreground group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0 group-data-[size=lg]/switch:data-[state=unchecked]:translate-x-0 group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0 dark:data-[state=unchecked]:bg-foreground"
      />
    </SwitchPrimitive.Root>
  );
}

export {Switch};

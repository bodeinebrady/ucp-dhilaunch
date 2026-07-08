'use client';

import type * as React from 'react';

import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import {Select as SelectPrimitive} from 'radix-ui';

import {cn} from '../../lib/utils';

/**
 * Displays a list of options for the user to pick from--triggered by a button.
 *
 * ### Component Props
 *
 * See [Select props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop             | Type                         | Default |
 * | :--------------- | :--------------------------- | :------ |
 * | _defaultValue_   | `string`                     | -       |
 * | _value_          | `string`                     | -       |
 * | _onValueChange_  | `(value: string) => void`    | -       |
 * | _defaultOpen_    | `boolean`                    | -       |
 * | _open_           | `boolean`                    | -       |
 * | _onOpenChange_   | `(open: boolean) => void`    | -       |
 * | _dir_            | `"ltr" \| "rtl"`             | -       |
 * | _name_           | `string`                     | -       |
 * | _disabled_       | `boolean`                    | -       |
 * | _required_       | `boolean`                    | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option-1">Option 1</SelectItem>
 *     <SelectItem value="option-2">Option 2</SelectItem>
 *     <SelectItem value="option-3">Option 3</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 1.3.1 Info and Relationships — Radix UI Select renders with role="combobox" and aria-expanded.
 * @wcag 2.1.1 Keyboard — Arrow keys navigate options; Enter/Space selects; Escape closes.
 * @wcag 2.4.7 Focus Visible — trigger focus ring visible via focus-visible styles.
 * @wcag 4.1.2 Name, Role, Value — pair with FieldLabel (htmlFor) for accessible name on the trigger.
 */
function Select({...props}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

/**
 * A grouping container for related select items, optionally labeled with SelectLabel.
 *
 * ### Component Props
 *
 * See [Select Group props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop      | Type      | Default |
 * | :-------- | :-------- | :------ |
 * | _asChild_ | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <SelectGroup>
 *   <SelectLabel>Fruits</SelectLabel>
 *   <SelectItem value="apple">Apple</SelectItem>
 *   <SelectItem value="banana">Banana</SelectItem>
 * </SelectGroup>
 * ```
 */
function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  );
}

/**
 * Displays the selected value within the SelectTrigger. Accepts a placeholder prop for when no value is selected.
 *
 * ### Component Props
 *
 * See [Select Value props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop          | Type        | Default |
 * | :------------ | :---------- | :------ |
 * | _asChild_     | `boolean`   | `false` |
 * | _placeholder_ | `ReactNode` | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <SelectValue placeholder="Pick an option" />
 * ```
 */
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

/**
 * The button that toggles the select dropdown. Renders SelectValue as a child.
 *
 * ### Component Props
 *
 * See [Select Trigger props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop      | Type                    | Default     |
 * | :-------- | :---------------------- | :---------- |
 * | _asChild_ | `boolean`               | `false`     |
 * | _size_    | `"sm" \| "default" \| "lg"` | `"default"` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <SelectTrigger size="sm">
 *   <SelectValue placeholder="Select..." />
 * </SelectTrigger>
 * ```
 */
function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default' | 'lg';
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "ease-ease-default flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=lg]:h-10 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="pointer-events-none size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/**
 * The dropdown content panel that appears when the select trigger is activated.
 *
 * ### Component Props
 *
 * See [Select Content props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop                  | Type                                | Default          |
 * | :-------------------- | :---------------------------------- | :--------------- |
 * | _asChild_             | `boolean`                           | `false`          |
 * | _position_            | `"item-aligned" \| "popper"`        | `"item-aligned"` |
 * | _side_                | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"`  |
 * | _sideOffset_          | `number`                            | `0`              |
 * | _align_               | `"start" \| "center" \| "end"`      | `"start"`        |
 * | _alignOffset_         | `number`                            | `0`              |
 * | _avoidCollisions_     | `boolean`                           | `true`           |
 * | _collisionPadding_    | `number \| Padding`                 | `10`             |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <SelectContent position="popper" sideOffset={4}>
 *   <SelectItem value="option-1">Option 1</SelectItem>
 * </SelectContent>
 * ```
 */
function SelectContent({
  className,
  children,
  position = 'item-aligned',
  align = 'center',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === 'item-aligned'}
        className={cn(
          'ease-ease-out relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-fast data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            'data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)',
            position === 'popper' && ''
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

/**
 * A label for a group of select items, rendered inside a SelectGroup.
 *
 * ### Component Props
 *
 * See [Select Label props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop      | Type      | Default |
 * | :-------- | :-------- | :------ |
 * | _asChild_ | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <SelectGroup>
 *   <SelectLabel>Category</SelectLabel>
 *   <SelectItem value="a">Item A</SelectItem>
 * </SelectGroup>
 * ```
 */
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('px-2 py-1.5 text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}

/**
 * An individual selectable option within the select dropdown.
 *
 * ### Component Props
 *
 * See [Select Item props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop               | Type      | Default |
 * | :----------------- | :-------- | :------ |
 * | _asChild_          | `boolean` | `false` |
 * | _value_ *(required)* | `string`  | -       |
 * | _disabled_         | `boolean` | -       |
 * | _textValue_        | `string`  | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <SelectItem value="apple">Apple</SelectItem>
 * ```
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

/**
 * A visual separator between groups or items within the select dropdown.
 *
 * ### Component Props
 *
 * See [Select Separator props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop      | Type      | Default |
 * | :-------- | :-------- | :------ |
 * | _asChild_ | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <SelectSeparator />
 * ```
 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

/**
 * A button shown at the top of the select content to allow scrolling upward when content overflows.
 *
 * ### Component Props
 *
 * See [Select ScrollUpButton props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop      | Type      | Default |
 * | :-------- | :-------- | :------ |
 * | _asChild_ | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <SelectScrollUpButton />
 * ```
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUp />
    </SelectPrimitive.ScrollUpButton>
  );
}

/**
 * A button shown at the bottom of the select content to allow scrolling downward when content overflows.
 *
 * ### Component Props
 *
 * See [Select ScrollDownButton props](https://www.radix-ui.com/primitives/docs/components/select) documentation for full details.
 *
 * | Prop      | Type      | Default |
 * | :-------- | :-------- | :------ |
 * | _asChild_ | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <SelectScrollDownButton />
 * ```
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDown />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};

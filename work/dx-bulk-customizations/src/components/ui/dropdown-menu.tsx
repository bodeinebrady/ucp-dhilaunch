'use client';

import type * as React from 'react';

import { Check, ChevronRight } from 'lucide-react';
import {DropdownMenu as DropdownMenuPrimitive} from 'radix-ui';

import {cn} from '../../lib/utils';

/**
 * Displays a menu to the user -- such as a set of actions or functions -- triggered by a button.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop            | Type                        | Default |
 * | :-------------- | :-------------------------- | :------ |
 * | _defaultOpen_   | `boolean`                   | -       |
 * | _open_          | `boolean`                   | -       |
 * | _onOpenChange_  | `(open: boolean) => void`   | -       |
 * | _modal_         | `boolean`                   | `true`  |
 * | _dir_           | `"ltr" \| "rtl"`            | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Open</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuLabel>My Account</DropdownMenuLabel>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem>Profile</DropdownMenuItem>
 *     <DropdownMenuItem>Settings</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem>Logout</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 2.1.1 Keyboard — trigger opens via Enter/Space; arrow keys navigate items; Escape closes.
 * @wcag 4.1.2 Name, Role, Value — `menu` and `menuitem` roles via Radix DropdownMenu primitives.
 * @wcag 2.4.7 Focus Visible — items receive visible focus highlight via `focus:bg-accent`.
 */
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/**
 * Renders the dropdown menu content into a portal appended to `document.body`.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop          | Type          | Default         |
 * | :------------ | :------------ | :-------------- |
 * | _forceMount_  | `boolean`     | -               |
 * | _container_   | `HTMLElement`  | `document.body` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuPortal>
 *   <DropdownMenuContent>...</DropdownMenuContent>
 * </DropdownMenuPortal>
 * ```
 */
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

/**
 * The button that toggles the dropdown menu.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop       | Type      | Default |
 * | :--------- | :-------- | :------ |
 * | _asChild_  | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
 * ```
 */
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

/**
 * The component that pops out when the dropdown menu is open. Wraps itself in a `DropdownMenuPortal`.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop                   | Type                                   | Default     |
 * | :--------------------- | :------------------------------------- | :---------- |
 * | _asChild_              | `boolean`                              | `false`     |
 * | _loop_                 | `boolean`                              | `false`     |
 * | _onCloseAutoFocus_     | `(event: Event) => void`               | -           |
 * | _onEscapeKeyDown_      | `(event: KeyboardEvent) => void`       | -           |
 * | _onPointerDownOutside_ | `(event: PointerDownOutsideEvent) => void` | -       |
 * | _onFocusOutside_       | `(event: FocusOutsideEvent) => void`   | -           |
 * | _onInteractOutside_    | `(event: Event) => void`               | -           |
 * | _forceMount_           | `boolean`                              | -           |
 * | _side_                 | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` |
 * | _sideOffset_           | `number`                               | `4`         |
 * | _align_                | `"start" \| "center" \| "end"`         | `"start"`   |
 * | _alignOffset_          | `number`                               | `0`         |
 * | _avoidCollisions_      | `boolean`                              | `true`      |
 * | _collisionPadding_     | `number \| Padding`                    | `0`         |
 * | _sticky_               | `"partial" \| "always"`                | `"partial"` |
 * | _hideWhenDetached_     | `boolean`                              | `false`     |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuContent align="start" sideOffset={4}>
 *   <DropdownMenuItem>Item 1</DropdownMenuItem>
 *   <DropdownMenuItem>Item 2</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
function DropdownMenuContent({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'ease-ease-out z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-fast data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * Groups multiple `DropdownMenuItem` components together.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop       | Type      | Default |
 * | :--------- | :-------- | :------ |
 * | _asChild_  | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuGroup>
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 * </DropdownMenuGroup>
 * ```
 */
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

/**
 * An interactive item within the dropdown menu.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop         | Type                           | Default     |
 * | :----------- | :----------------------------- | :---------- |
 * | _asChild_    | `boolean`                      | `false`     |
 * | _disabled_   | `boolean`                      | -           |
 * | _onSelect_   | `(event: Event) => void`       | -           |
 * | _textValue_  | `string`                       | -           |
 * | _inset_      | `boolean`                      | -           |
 * | _variant_    | `"default" \| "destructive"`   | `"default"` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuItem onSelect={() => handleSelect()}>
 *   Profile
 * </DropdownMenuItem>
 * <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
 * ```
 */
function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )}
      {...props}
    />
  );
}

/**
 * A menu item that can be toggled between checked and unchecked states.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop               | Type                                   | Default |
 * | :----------------- | :------------------------------------- | :------ |
 * | _asChild_          | `boolean`                              | `false` |
 * | _checked_          | `boolean \| "indeterminate"`           | -       |
 * | _onCheckedChange_  | `(checked: boolean) => void`           | -       |
 * | _disabled_         | `boolean`                              | -       |
 * | _onSelect_         | `(event: Event) => void`               | -       |
 * | _textValue_        | `string`                               | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
 *   Show Panel
 * </DropdownMenuCheckboxItem>
 * ```
 */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <Check />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/**
 * Groups multiple `DropdownMenuRadioItem` components together, managing a single selected value.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop              | Type                         | Default |
 * | :---------------- | :--------------------------- | :------ |
 * | _asChild_         | `boolean`                    | `false` |
 * | _value_           | `string`                     | -       |
 * | _onValueChange_   | `(value: string) => void`    | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuRadioGroup value={color} onValueChange={setColor}>
 *   <DropdownMenuRadioItem value="red">Red</DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="blue">Blue</DropdownMenuRadioItem>
 * </DropdownMenuRadioGroup>
 * ```
 */
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

/**
 * A radio-style menu item used within a `DropdownMenuRadioGroup`.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop                  | Type                       | Default |
 * | :-------------------- | :------------------------- | :------ |
 * | _asChild_             | `boolean`                  | `false` |
 * | _value_ *(required)*  | `string`                   | -       |
 * | _disabled_            | `boolean`                  | -       |
 * | _onSelect_            | `(event: Event) => void`   | -       |
 * | _textValue_           | `string`                   | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
 * ```
 */
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <Check />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/**
 * A non-interactive label used to describe a section of items within the dropdown menu.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop       | Type      | Default |
 * | :--------- | :-------- | :------ |
 * | _asChild_  | `boolean` | `false` |
 * | _inset_    | `boolean` | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuLabel>My Account</DropdownMenuLabel>
 * ```
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8',
        className
      )}
      {...props}
    />
  );
}

/**
 * A visual separator between groups of items in the dropdown menu.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop       | Type      | Default |
 * | :--------- | :-------- | :------ |
 * | _asChild_  | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuSeparator />
 * ```
 */
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

/**
 * Displays a keyboard shortcut hint alongside a dropdown menu item.
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuItem>
 *   Save
 *   <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * ```
 */
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground',
        className
      )}
      {...props}
    />
  );
}

/**
 * Contains all the parts of a submenu within the dropdown menu.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop            | Type                        | Default |
 * | :-------------- | :-------------------------- | :------ |
 * | _defaultOpen_   | `boolean`                   | -       |
 * | _open_          | `boolean`                   | -       |
 * | _onOpenChange_  | `(open: boolean) => void`   | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>Option A</DropdownMenuItem>
 *     <DropdownMenuItem>Option B</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 * ```
 */
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/**
 * An item that opens a submenu when hovered or activated. Must be rendered inside `DropdownMenuSub`.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop         | Type      | Default |
 * | :----------- | :-------- | :------ |
 * | _asChild_    | `boolean` | `false` |
 * | _disabled_   | `boolean` | -       |
 * | _textValue_  | `string`  | -       |
 * | _inset_      | `boolean` | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
 * ```
 */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

/**
 * The component that pops out when a submenu is open. Must be rendered inside `DropdownMenuSub`.
 *
 * ### Component Props
 *
 * See [Dropdown Menu props](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) documentation for full details.
 *
 * | Prop                   | Type                                           | Default     |
 * | :--------------------- | :--------------------------------------------- | :---------- |
 * | _asChild_              | `boolean`                                      | `false`     |
 * | _loop_                 | `boolean`                                      | `false`     |
 * | _onEscapeKeyDown_      | `(event: KeyboardEvent) => void`               | -           |
 * | _onPointerDownOutside_ | `(event: PointerDownOutsideEvent) => void`     | -           |
 * | _onFocusOutside_       | `(event: FocusOutsideEvent) => void`           | -           |
 * | _onInteractOutside_    | `(event: Event) => void`                       | -           |
 * | _forceMount_           | `boolean`                                      | -           |
 * | _sideOffset_           | `number`                                       | `0`         |
 * | _alignOffset_          | `number`                                       | `0`         |
 * | _avoidCollisions_      | `boolean`                                      | `true`      |
 * | _collisionPadding_     | `number \| Padding`                            | `0`         |
 * | _sticky_               | `"partial" \| "always"`                        | `"partial"` |
 * | _hideWhenDetached_     | `boolean`                                      | `false`     |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <DropdownMenuSubContent>
 *   <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
 *   <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
 * </DropdownMenuSubContent>
 * ```
 */
function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        'ease-ease-out z-50 min-w-24 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-fast data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};

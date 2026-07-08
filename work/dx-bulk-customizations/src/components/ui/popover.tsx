import type * as React from 'react';

import {Popover as PopoverPrimitive} from 'radix-ui';

import {cn} from '../../lib/utils';

/**
 * Displays rich content in a portal, triggered by a button.
 *
 * ### Component Props
 *
 * See [Popover props](https://www.radix-ui.com/primitives/docs/components/popover) documentation for full details.
 *
 * | Prop            | Type                          | Default |
 * | :-------------- | :---------------------------- | :------ |
 * | _defaultOpen_   | `boolean`                     | -       |
 * | _open_          | `boolean`                     | -       |
 * | _onOpenChange_  | `(open: boolean) => void`     | -       |
 * | _modal_         | `boolean`                     | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Popover>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverHeader>
 *       <PopoverTitle>Settings</PopoverTitle>
 *       <PopoverDescription>Adjust your preferences.</PopoverDescription>
 *     </PopoverHeader>
 *   </PopoverContent>
 * </Popover>
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 2.1.1 Keyboard — trigger opens via Enter/Space; content is focusable.
 * @wcag 2.1.2 No Keyboard Trap — Escape key closes the popover; focus returns to trigger.
 * @wcag 4.1.2 Name, Role, Value — focus management and dismiss behavior via Radix Popover primitive.
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/**
 * The button that toggles the popover open or closed.
 *
 * ### Component Props
 *
 * See [Popover props](https://www.radix-ui.com/primitives/docs/components/popover) documentation for full details.
 *
 * | Prop      | Type      | Default |
 * | :-------- | :-------- | :------ |
 * | _asChild_ | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <PopoverTrigger asChild>
 *   <Button>Open popover</Button>
 * </PopoverTrigger>
 * ```
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/**
 * The content displayed inside the popover portal with positioning and animation.
 *
 * ### Component Props
 *
 * See [Popover props](https://www.radix-ui.com/primitives/docs/components/popover) documentation for full details.
 *
 * | Prop                     | Type                                    | Default      |
 * | :----------------------- | :-------------------------------------- | :----------- |
 * | _asChild_                | `boolean`                               | `false`      |
 * | _side_                   | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"`   |
 * | _sideOffset_             | `number`                                | `0`          |
 * | _align_                  | `"start" \| "center" \| "end"`          | `"center"`   |
 * | _alignOffset_            | `number`                                | `0`          |
 * | _avoidCollisions_        | `boolean`                               | `true`       |
 * | _collisionPadding_       | `number \| Padding`                     | `0`          |
 * | _sticky_                 | `"partial" \| "always"`                 | `"partial"`  |
 * | _hideWhenDetached_       | `boolean`                               | `false`      |
 * | _onOpenAutoFocus_        | `(event: Event) => void`                | -            |
 * | _onCloseAutoFocus_       | `(event: Event) => void`                | -            |
 * | _onEscapeKeyDown_        | `(event: KeyboardEvent) => void`        | -            |
 * | _onPointerDownOutside_   | `(event: PointerDownOutsideEvent) => void` | -         |
 * | _onInteractOutside_      | `(event: Event) => void`                | -            |
 * | _forceMount_             | `boolean`                               | -            |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <PopoverContent align="start" sideOffset={8}>
 *   <p>Popover body content</p>
 * </PopoverContent>
 * ```
 */
function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'ease-ease-out z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-4 rounded-md bg-popover p-4 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-fast data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/**
 * An optional anchor element to position the popover against instead of the trigger.
 *
 * ### Component Props
 *
 * See [Popover props](https://www.radix-ui.com/primitives/docs/components/popover) documentation for full details.
 *
 * | Prop      | Type      | Default |
 * | :-------- | :-------- | :------ |
 * | _asChild_ | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <PopoverAnchor asChild>
 *   <div>Anchor element</div>
 * </PopoverAnchor>
 * ```
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

/**
 * A header container within the popover content for title and description.
 *
 * ### Component Props
 *
 * Accepts all standard `<div>` HTML element props.
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <PopoverHeader>
 *   <PopoverTitle>Title</PopoverTitle>
 *   <PopoverDescription>Description</PopoverDescription>
 * </PopoverHeader>
 * ```
 */
function PopoverHeader({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn('flex flex-col gap-1 text-sm', className)}
      {...props}
    />
  );
}

/**
 * Renders a title within the popover header.
 *
 * ### Component Props
 *
 * Accepts all standard `<h2>` HTML element props.
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <PopoverTitle>Settings</PopoverTitle>
 * ```
 */
function PopoverTitle({className, ...props}: React.ComponentProps<'h2'>) {
  return (
    <div
      data-slot="popover-title"
      className={cn('font-medium', className)}
      {...props}
    />
  );
}

/**
 * Renders a description within the popover header.
 *
 * ### Component Props
 *
 * Accepts all standard `<p>` HTML element props.
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <PopoverDescription>Adjust your preferences below.</PopoverDescription>
 * ```
 */
function PopoverDescription({className, ...props}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="popover-description"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};

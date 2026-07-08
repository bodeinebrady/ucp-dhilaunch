'use client';

import type * as React from 'react';

import {Tooltip as TooltipPrimitive} from 'radix-ui';

import {cn} from '../../lib/utils';

/**
 * Wraps your app to provide global tooltip configuration and delay behavior.
 *
 * ### Component Props
 *
 * See [Tooltip.Provider props](https://www.radix-ui.com/primitives/docs/components/tooltip) documentation for full details.
 *
 * | Prop                        | Type      | Default |
 * | :-------------------------- | :-------- | :------ |
 * | _delayDuration_             | `number`  | `0`     |
 * | _skipDelayDuration_         | `number`  | `300`   |
 * | _disableHoverableContent_   | `boolean` | -       |
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

/**
 * A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
 *
 * ### Component Props
 *
 * See [Tooltip props](https://www.radix-ui.com/primitives/docs/components/tooltip) documentation for full details.
 *
 * | Prop                       | Type                          | Default |
 * | :------------------------- | :---------------------------- | :------ |
 * | _defaultOpen_              | `boolean`                     | -       |
 * | _open_                     | `boolean`                     | -       |
 * | _onOpenChange_             | `(open: boolean) => void`     | -       |
 * | _delayDuration_            | `number`                      | `700`   |
 * | _disableHoverableContent_  | `boolean`                     | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger>Hover me</TooltipTrigger>
 *   <TooltipContent>Tooltip text</TooltipContent>
 * </Tooltip>
 * ```
 *
 * ### Accessibility (WCAG 2.2 AA)
 *
 * @wcag 1.4.13 Content on Hover or Focus — tooltip appears on hover and focus; dismissible via Escape; persists while hovered.
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

/**
 * The element that triggers the tooltip when hovered or focused.
 *
 * ### Component Props
 *
 * See [Tooltip.Trigger props](https://www.radix-ui.com/primitives/docs/components/tooltip) documentation for full details.
 *
 * | Prop       | Type       | Default |
 * | :--------- | :--------- | :------ |
 * | _asChild_  | `boolean`  | `false` |
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * The styled content displayed inside the tooltip popup, with an arrow indicator.
 *
 * ### Component Props
 *
 * See [Tooltip.Content props](https://www.radix-ui.com/primitives/docs/components/tooltip) documentation for full details.
 *
 * | Prop                    | Type                                | Default     |
 * | :---------------------- | :---------------------------------- | :---------- |
 * | _asChild_               | `boolean`                           | `false`     |
 * | _aria-label_            | `string`                            | -           |
 * | _onEscapeKeyDown_       | `(event: KeyboardEvent) => void`    | -           |
 * | _onPointerDownOutside_  | `(event: PointerDownOutsideEvent) => void` | -    |
 * | _forceMount_            | `boolean`                           | -           |
 * | _side_                  | `"top" \| "right" \| "bottom" \| "left"` | `"top"` |
 * | _sideOffset_            | `number`                            | `0`         |
 * | _align_                 | `"start" \| "center" \| "end"`      | `"center"`  |
 * | _alignOffset_           | `number`                            | `0`         |
 * | _avoidCollisions_       | `boolean`                           | `true`      |
 * | _collisionPadding_      | `number \| Padding`                 | `0`         |
 * | _arrowPadding_          | `number`                            | `0`         |
 * | _sticky_                | `"partial" \| "always"`             | `"partial"` |
 * | _hideWhenDetached_      | `boolean`                           | `false`     |
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) rounded-md bg-foreground px-3 py-1.5 text-xs text-background data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger};

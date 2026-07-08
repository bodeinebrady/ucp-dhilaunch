'use client';

import {Collapsible as CollapsiblePrimitive} from 'radix-ui';

/**
 * An interactive component which expands/collapses a panel.
 *
 * ### Component Props
 *
 * See [Collapsible props](https://www.radix-ui.com/primitives/docs/components/collapsible) documentation for full details.
 *
 * | Prop              | Type                           | Default |
 * | :---------------- | :----------------------------- | :------ |
 * | _asChild_         | `boolean`                      | `false` |
 * | _defaultOpen_     | `boolean`                      | -       |
 * | _open_            | `boolean`                      | -       |
 * | _onOpenChange_    | `(open: boolean) => void`      | -       |
 * | _disabled_        | `boolean`                      | -       |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>
 *     Content that can be expanded or collapsed.
 *   </CollapsibleContent>
 * </Collapsible>
 * ```
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/**
 * The button that toggles the Collapsible content open or closed.
 *
 * ### Component Props
 *
 * See [Collapsible props](https://www.radix-ui.com/primitives/docs/components/collapsible) documentation for full details.
 *
 * | Prop        | Type      | Default |
 * | :---------- | :-------- | :------ |
 * | _asChild_   | `boolean` | `false` |
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

/**
 * The content area that is revealed when the Collapsible is open.
 *
 * ### Component Props
 *
 * See [Collapsible props](https://www.radix-ui.com/primitives/docs/components/collapsible) documentation for full details.
 *
 * | Prop           | Type      | Default |
 * | :------------- | :-------- | :------ |
 * | _asChild_      | `boolean` | `false` |
 * | _forceMount_   | `boolean` | -       |
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export {Collapsible, CollapsibleTrigger, CollapsibleContent};

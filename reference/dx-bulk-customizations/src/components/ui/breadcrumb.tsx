import type {AsChild} from '../../lib/types';
import type * as React from 'react';

import { ChevronRight, MoreHorizontal } from 'lucide-react';
import {Slot} from 'radix-ui';

import {cn} from '../../lib/utils';

/**
 * A navigation component that displays the current page's location within a hierarchical structure.
 *
 * ### Component Props
 *
 * This component extends the HTML `nav` element.
 * It does not have any component-specific props.
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current Page</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
function Breadcrumb({className, ...props}: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn('@container/breadcrumb', className)}
      {...props}
    />
  );
}

/**
 * An ordered list container for breadcrumb items. Renders as an `ol` element.
 *
 * ### Component Props
 *
 * This component extends the HTML `ol` element.
 * It does not have any component-specific props.
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <BreadcrumbList>
 *   <BreadcrumbItem>...</BreadcrumbItem>
 * </BreadcrumbList>
 * ```
 */
function BreadcrumbList({className, ...props}: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5',
        '@[0px]/breadcrumb:gap-1 @[0px]/breadcrumb:text-xs @[320px]/breadcrumb:gap-1.5 @[320px]/breadcrumb:text-sm',
        className
      )}
      {...props}
    />
  );
}

/**
 * A list item wrapper for a single breadcrumb entry. Renders as an `li` element.
 *
 * ### Component Props
 *
 * This component extends the HTML `li` element.
 * It does not have any component-specific props.
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <BreadcrumbItem>
 *   <BreadcrumbLink href="/">Home</BreadcrumbLink>
 * </BreadcrumbItem>
 * ```
 */
function BreadcrumbItem({className, ...props}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

/**
 * A navigational link within a breadcrumb item. Can render a custom element using `asChild`.
 *
 * ### Component Props
 *
 * | Prop       | Type      | Default |
 * | :--------- | :-------- | :------ |
 * | _asChild_  | `boolean` | `false` |
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
 * ```
 */
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<'a'> & AsChild) {
  const Comp = asChild ? Slot.Root : 'a';

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        'ease-ease-default transition-colors hover:text-foreground',
        className
      )}
      {...props}
    />
  );
}

/**
 * Represents the current page in the breadcrumb trail. Rendered as a non-interactive `span`.
 *
 * ### Component Props
 *
 * This component extends the HTML `span` element.
 * It does not have any component-specific props.
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <BreadcrumbPage>Current Page</BreadcrumbPage>
 * ```
 */
function BreadcrumbPage({className, ...props}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn('font-normal text-foreground', className)}
      {...props}
    />
  );
}

/**
 * A visual separator between breadcrumb items. Defaults to a chevron icon.
 *
 * ### Component Props
 *
 * This component extends the HTML `li` element.
 * It does not have any component-specific props beyond `children` to customize the separator icon.
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <BreadcrumbSeparator />
 * ```
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

/**
 * An ellipsis indicator used to represent collapsed breadcrumb items.
 *
 * ### Component Props
 *
 * This component extends the HTML `span` element.
 * It does not have any component-specific props.
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <BreadcrumbItem>
 *   <BreadcrumbEllipsis />
 * </BreadcrumbItem>
 * ```
 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        'flex size-5 items-center justify-center [&>svg]:size-4',
        className
      )}
      {...props}
    >
      <MoreHorizontal />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

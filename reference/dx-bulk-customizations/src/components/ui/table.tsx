import type * as React from 'react';

import {cn} from '../../lib/utils';

/**
 * A responsive data table container with horizontal scroll support.
 *
 * ### Component Props
 *
 * Accepts all standard `<table>` element props (`React.ComponentProps<'table'>`).
 *
 *
 * ### Example Usage
 *
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Item 1</TableCell>
 *       <TableCell>Active</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
function Table({className, ...props}: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

/**
 * The header section of a Table, wrapping header rows.
 *
 * ### Component Props
 *
 * Accepts all standard `<thead>` element props (`React.ComponentProps<'thead'>`).
 */
function TableHeader({className, ...props}: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  );
}

/**
 * The body section of a Table, wrapping data rows.
 *
 * ### Component Props
 *
 * Accepts all standard `<tbody>` element props (`React.ComponentProps<'tbody'>`).
 */
function TableBody({className, ...props}: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

/**
 * The footer section of a Table, typically used for summary rows.
 *
 * ### Component Props
 *
 * Accepts all standard `<tfoot>` element props (`React.ComponentProps<'tfoot'>`).
 */
function TableFooter({className, ...props}: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  );
}

/**
 * A single row within a Table, with hover and selected state styling.
 *
 * ### Component Props
 *
 * Accepts all standard `<tr>` element props (`React.ComponentProps<'tr'>`).
 */
function TableRow({className, ...props}: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'ease-ease-default border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  );
}

/**
 * A header cell within a TableRow, used inside TableHeader.
 *
 * ### Component Props
 *
 * Accepts all standard `<th>` element props (`React.ComponentProps<'th'>`).
 */
function TableHead({className, ...props}: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
}

/**
 * A data cell within a TableRow, used inside TableBody.
 *
 * ### Component Props
 *
 * Accepts all standard `<td>` element props (`React.ComponentProps<'td'>`).
 */
function TableCell({className, ...props}: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
}

/**
 * A caption element for a Table, displayed below the table content.
 *
 * ### Component Props
 *
 * Accepts all standard `<caption>` element props (`React.ComponentProps<'caption'>`).
 */
function TableCaption({className, ...props}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

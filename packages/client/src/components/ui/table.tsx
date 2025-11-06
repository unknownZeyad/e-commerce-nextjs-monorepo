import { ClassValue } from 'clsx';
import { cn } from '../../lib/utils';
import { ComponentProps, createContext, memo, ReactElement, ReactNode, useContext } from 'react';

type HorizontalAlignment = 'left' | 'center' | 'right';

type TTableProviderValue = {
  columns: string,
  horizontalAlignment?: HorizontalAlignment
}

export const TableContext = createContext<TTableProviderValue>({
  columns: "",
  horizontalAlignment: 'left'
});

function Table({ columns, children, className, horizontalAlignment }: {
  columns: string, 
  children: ReactNode, 
  className?: ClassValue,
  horizontalAlignment?: HorizontalAlignment
}) {

  return (
    <TableContext.Provider value={{ columns, horizontalAlignment }}>
      <div
        role="table"
        className={cn('table', className)}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
}

function Header({ children, className }: ComponentProps<"div">) {
  const { columns } = useContext(TableContext);

  return (
    <div
      role="row"
      className={cn(
        `table_header`,
        columns,
        className
      )}
    >
      {children}
    </div>
  );
}
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualBody<TDataItem>({
  data,
  render,
  className,
  estimatedRowHeight = 64, 
  overscan = 5
}: {
  data: TDataItem[];
  render: (item: TDataItem, index: number) => ReactElement;
  className?: string;
  estimatedRowHeight?: number;
  overscan?: number;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan,
  });

  if (!data?.length) {
    return <div className={cn('table_body empty')}>No Data to show at the Moment</div>;
  }

  return (
    <div ref={parentRef} className={cn('table_body overflow-auto', className)} style={{ maxHeight: '600px' }}>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = data[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {render(item, virtualRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Body<TDataItem>({ data, render, className }: {
  data: TDataItem[],
  render: (item: TDataItem, index: number) => ReactElement
} & ComponentProps<"div">) {
  if (!data?.length)
    return (
      <div className={cn('table_body empty')}>
        No Data to show at the Moment
      </div>
    );

  return (
    <div className='table_body'>
      {data.map(render)}
    </div>
  );
}

function Row({ children, className, ...props }: ComponentProps<"div"> ) {
  const { columns } = useContext(TableContext);

  return (
    <div
      role="row"
      className={cn(
        'table_row',
        className,
        columns
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function Cell({ children, ...props }: ComponentProps<"div">) {
  const { horizontalAlignment } = useContext(TableContext);

  return (
    <div
      {...props}
      className={cn(
        'table_cell', 
        props.className, 
        horizontalAlignment === 'center' ? '!justify-center text-center' : horizontalAlignment === 'right' ? '!justify-end' : '!justify-start'
      )}
    >
      {children}
    </div>
  );
}

function Footer({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div 
      className={cn(`table_footer`, className)}
      {...props}
    >
      {children}
    </div>
  );
}

Table.Header = (Header);
Table.Body = (Body);
Table.Row = (Row);
Table.Cell = (Cell);
Table.Footer = (Footer);
Table.VirtualizedBody = (VirtualBody);

export default (Table);

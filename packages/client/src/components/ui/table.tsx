import { ClassValue } from 'clsx';
import { cn } from '../../lib/utils';
import { ComponentProps, createContext, memo, ReactElement, ReactNode, useContext } from 'react';

type TTableProviderValue = {
  columns: string
}

export const TableContext = createContext<TTableProviderValue>({
  columns: ""
});

function Table({ columns, children, className }: {
  columns: string, 
  children: ReactNode, 
  className?: ClassValue
}) {

  return (
    <TableContext.Provider value={{ columns }}>
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

  return (
    <div
      {...props}
      className={cn('table_cell', props.className)}
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

export default (Table);

//
// Copyright 2022 Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

/* eslint-disable react/jsx-props-no-spreading */

import React, { ReactElement, useMemo, Children, ReactNode } from "react";
import { SolidDataset, Thing, Url, UrlString } from "@inrupt/solid-client";
import {
  useTable,
  Column,
  Row,
  useSortBy,
  useGlobalFilter,
  Renderer,
  CellProps,
  HeaderProps,
} from "react-table";
import { DataType, getValueByType, getValueByTypeAll } from "../../helpers";
import CombinedDataProvider from "../../context/combinedDataContext";

export type TableColumnProps = {
  body?: Renderer<CellProps<object>>;
  header?: Renderer<HeaderProps<object>> | string;
  property: Url | UrlString;
  dataType?: DataType;
  locale?: string;
  multiple?: boolean;
  sortable?: boolean;
  sortFn?: (a: unknown, b: unknown) => number;
  filterable?: boolean;
  children?: undefined | null | [];
};

/**
 * To be used as the only children of a Table component. Each column represents one property of the Things passed to the Table.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TableColumn(props: TableColumnProps): ReactElement {
  throw new Error("Can't use TableColumn outside a Table.");
}

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  children?:
    | ReactElement<TableColumnProps>
    | Array<ReactElement<TableColumnProps>>;
  emptyStateComponent?: React.ComponentType | null;
  things: Array<{ dataset: SolidDataset; thing: Thing }>;
  filter?: string;
  ascIndicator?: ReactNode;
  descIndicator?: ReactNode;
  getRowProps: (
    row: Row,
    rowThing: Thing,
    rowDataset: SolidDataset
  ) => React.HTMLAttributes<HTMLTableRowElement>;
}

/**
 * Displays values from an array of [Things](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) as table rows, with each column showing a given property of those [Things](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing).
 */
export function Table({
  children,
  emptyStateComponent: EmptyStateComponent,
  things,
  filter,
  ascIndicator,
  descIndicator,
  getRowProps,
  ...tableProps
}: TableProps): ReactElement | null {
  const { columns, data } = useMemo(() => {
    const columnsArray: Array<Column<Record<string, unknown>>> = [];
    const dataArray: Array<Record<string, unknown>> = things.map(() => ({}));

    // loop through each column
    Children.forEach(children, (column, colIndex) => {
      if (column) {
        const {
          property,
          header,
          body,
          dataType = "string",
          locale,
          multiple = false,
          sortable,
          sortFn,
          filterable,
        } = column.props;
        // add heading

        columnsArray.push({
          Header: header ?? `${property}`,
          accessor: `col${colIndex}`,
          disableGlobalFilter: !filterable,
          disableSortBy: !sortable,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Cell: body ?? (({ value }: any) => (value != null ? `${value}` : "")),
        });

        if (sortFn) {
          const sortFunction = (a: Row, b: Row, columnId: string) => {
            const valueA = a.values[columnId];
            const valueB = b.values[columnId];
            return sortFn(valueA, valueB);
          };
          columnsArray[colIndex].sortType = sortFunction;
        } else {
          if (dataType === "string") {
            columnsArray[colIndex].sortType = dataType;
          }
          if (dataType === "integer" || dataType === "decimal") {
            columnsArray[colIndex].sortType = "number";
          }
        }

        // add each each value to data
        things.forEach((thing, i) => {
          dataArray[i][`col${colIndex}`] = multiple
            ? getValueByTypeAll(dataType, thing.thing, property, locale)
            : getValueByType(dataType, thing.thing, property, locale);
        });
      }
    });

    return { columns: columnsArray, data: dataArray };
  }, [children, things]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { globalFilter: filter || undefined },
    },
    useGlobalFilter,
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  if (!rows.length) {
    if (EmptyStateComponent) {
      return <EmptyStateComponent />;
    }
    return null;
  }
  return (
    <table {...getTableProps()} {...tableProps}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                {column.isSorted &&
                  (column.isSortedDesc ? descIndicator : ascIndicator)}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const rowDataset = things[row.index].dataset;
          const rowThing = things[row.index].thing;
          return (
            <tr {...row.getRowProps(getRowProps(row, rowThing, rowDataset))}>
              <CombinedDataProvider solidDataset={rowDataset} thing={rowThing}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </CombinedDataProvider>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Table.defaultProps = {
  filter: undefined,
  ascIndicator: (
    <span role="img" aria-label="Sorted in ascending order">
      {" "}
      🔼
    </span>
  ),
  descIndicator: (
    <span role="img" aria-label="Sorted in descending order">
      {" "}
      🔽
    </span>
  ),
  getRowProps: () => ({}),
};

/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* eslint-disable react/jsx-props-no-spreading */

import React, { ReactElement, useMemo, Children } from "react";
import { Thing, Url, UrlString } from "@inrupt/solid-client";
import {
  useTable,
  Column,
  useSortBy,
  useGlobalFilter,
  Renderer,
  CellProps,
  HeaderProps,
} from "react-table";
import { getValueByType } from "../../helpers";

export type DataType =
  | "boolean"
  | "datetime"
  | "decimal"
  | "integer"
  | "string"
  | "url";

export type TableColumnProps = {
  body?: Renderer<CellProps<any>>;
  header?: Renderer<HeaderProps<any>> | string;
  property: Url | UrlString;
  dataType?: DataType;
  locale?: string;
  sortable?: boolean;
  filterable?: boolean;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TableColumn(props: TableColumnProps): ReactElement {
  return <span>Can&apos;t use TableColumn outside a Table.</span>;
}

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  children:
    | ReactElement<TableColumnProps>
    | Array<ReactElement<TableColumnProps>>;
  things: Array<Thing>;
  filter?: string;
}

export function Table({
  children,
  things,
  filter,
  ...tableProps
}: TableProps): ReactElement {
  const { columns, data } = useMemo(() => {
    const columnsArray: Array<Column<Record<string, unknown>>> = [];
    const dataArray: Array<Record<string, unknown>> = things.map(() => ({}));

    // loop through each column
    // TODO check they're TableColumn, or is ReactElement<TableColumnProps> enough
    Children.forEach(children, (column, colIndex) => {
      const {
        property,
        header,
        body,
        dataType = "string",
        locale,
        sortable,
        filterable,
      } = column.props;
      // add heading
      columnsArray.push({
        Header: header ?? `${property}`,
        accessor: `col${colIndex}`,
        disableGlobalFilter: !filterable,
        disableSortBy: !sortable,
        Cell: body ?? (({ value }: any) => `${value}`),
      });

      // add each each value to data
      for (let i = 0; i < things.length; i += 1) {
        const thing = things[i];
        dataArray[i][`col${colIndex}`] = getValueByType(
          dataType,
          thing,
          property,
          locale
        );
      }
    });

    return { columns: columnsArray, data: dataArray };
  }, [children, things]);

  const tableInstance = useTable(
    { columns, data, initialState: { globalFilter: filter || undefined } },
    useGlobalFilter,
    useSortBy
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;
  return (
    <table {...getTableProps()} {...tableProps}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                {column.isSorted && (
                  <span>{column.isSortedDesc ? " 🔽" : " 🔼"}</span>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Table.defaultProps = {
  filter: undefined,
};

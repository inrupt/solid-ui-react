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

import React, { ReactElement, useMemo, Children, ReactNode } from "react";
import {
  Thing,
  getStringUnlocalizedOne,
  Url,
  UrlString,
} from "@inrupt/solid-client";
import { useTable, Column } from "react-table";

type TableColumnHeadingProps = {
  property: Url | UrlString;
  children?: ReactNode;
};
export function TableColumnHeading({
  property,
}: TableColumnHeadingProps): ReactElement {
  return <>{property}</>;
}

type TableColumnProps = {
  children: ReactElement<TableColumnHeadingProps>;
};
export function TableColumn({ children }: TableColumnProps): ReactElement {
  return <>{children}</>;
}

type Props = {
  children:
    | ReactElement<TableColumnProps>
    | Array<ReactElement<TableColumnProps>>;
  things: Array<Thing>;
};

export function Table({ children, things }: Props): ReactElement {
  const { columns, data } = useMemo(() => {
    const columnsArray: Array<Column<Record<string, unknown>>> = [];
    const dataArray: Array<Record<string, unknown>> = [];
    for (let i = 0; i < things.length; i += 1) {
      dataArray.push({});
    }

    // loop through each column
    // TODO check they're TableColumn, or is ReactElement<TableColumnProps> enough
    Children.forEach(children, (column, colIndex) => {
      const columnChildren = column.props.children;
      // TODO check type — TableColumnHeading or TableColumnBody
      // loop through each TableColumnHeading
      Children.forEach(columnChildren, (child) => {
        const { property, children: headingChildren } = child.props;
        // add heading
        columnsArray.push({
          Header: headingChildren ? <>{headingChildren}</> : `${property}`,
          accessor: `col${colIndex}`,
        });

        // add each each value to data
        for (let i = 0; i < things.length; i += 1) {
          const thing = things[i];
          const value = getStringUnlocalizedOne(thing, property);
          dataArray[i][`col${colIndex}`] = value;
        }
      });
    });

    return { columns: columnsArray, data: dataArray };
  }, [children, things]);

  const tableInstance = useTable({ columns, data });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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

//
// Copyright Inrupt Inc.
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

import type { ReactElement } from "react";
import React from "react";
import { Table, TableColumn } from "../../src/components/table";
import type { DataType } from "../../src/helpers";
import { addStringNoLocale, createThing, createSolidDataset, setThing } from "@inrupt/solid-client";

export default {
  title: "Components/TableColumn",
  component: TableColumn,
  parameters: {
    docs: {
      description: {
        component: `
To be used as the only children of a Table component. Each column represents one property of the Things passed to the Table.

For further example usage, please refer to the [Table](/?path=/docs/components-table) documentation.
        `,
      },
    },
  },
  argTypes: {
    property: {
      description: `The property of the Things to retrieve the value from and display in the column.`,
    },
    dataType: {
      description: `The type of value to be retrieved. Uses \`string\` if not set.`,
    },
    header: {
      description: `A string, or function which returns valid JSX, to render as the column header. Equivalent to the [Header](https://react-table.tanstack.com/docs/api/useTable#column-options) option of [React Table](https://www.npmjs.com/package/react-table).`,
    },
    body: {
      description: `Function which is passed the [cell props](https://react-table.tanstack.com/docs/api/useTable#cell-properties) and returns valid JSX. Equivalent to the [Cell](https://react-table.tanstack.com/docs/api/useTable#column-options) option of [React Table](https://www.npmjs.com/package/react-table).`,
      control: { type: null },
    },
    locale: {
      description: `If dataType is string, sets the locale for the string value`,
      control: { type: null },
    },
    multiple: {
      description: `If true, will attempt to fetch multiple values for the given property`,
    },
    sortable: {
      description: `If true, column header can be clicked to sort ascending/descending`,
    },
    sortFn: {
      description: `A sorting function used to sort rows on a column`,
      control: { type: null },
    },
    filterable: {
      description: `If true, column will be included in filtering applied by filter term passed to Table`,
    },
  },
};

/* eslint react/require-default-props: 0, react/no-unused-prop-types: 0 */
interface ITableColumn {
  property: string;
  dataType?: string;
  header?: string;
  multiple?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export function BasicExample({
  property,
  dataType,
  header,
  multiple,
  sortable,
  filterable,
}: ITableColumn): ReactElement {
  const namePredicate = `http://xmlns.com/foaf/0.1/name`;

  const thing1 = addStringNoLocale(
    createThing(),
    namePredicate,
    `example name 1`,
  );

  const thing2 = addStringNoLocale(
    createThing(),
    namePredicate,
    `example name 2`,
  );

  const emptyDataset = createSolidDataset();
  const datasetWithThing1 = setThing(emptyDataset, thing1);
  const dataset = setThing(datasetWithThing1, thing2);

  return (
    <Table
      things={[
        {
          dataset,
          thing: thing1,
        },
        {
          dataset,
          thing: thing2,
        },
      ]}
      style={{ border: "1px solid black" }}
    >
      <TableColumn
        property={property}
        dataType={dataType as DataType}
        header={header}
        multiple={multiple}
        sortable={sortable}
        filterable={filterable}
      />
    </Table>
  );
}

BasicExample.args = {
  property: "http://xmlns.com/foaf/0.1/name",
  dataType: "string",
  header: "Name",
  multiple: false,
  sortable: false,
  filterable: false,
};

BasicExample.parameters = {
  actions: { disable: true },
};

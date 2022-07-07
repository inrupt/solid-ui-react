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

import React, { ReactElement, useContext } from "react";
import * as SolidFns from "@inrupt/solid-client";
import DatasetContext, {
  DatasetProvider,
} from "../../src/context/datasetContext";
import { Table, TableColumn } from "../../src/components/table";
import config from "../config";

const { host } = config();

export default {
  title: "Components/Table",
  component: Table,
  argTypes: {
    things: {
      description: `Array of objects, containing [Things](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) and the [Datasets](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) they are part of.`,
      control: { type: null },
    },
    filter: {
      description: `String term to filter rows by (only applied to columns marked as \`filterable\`)`,
    },
    ascIndicator: {
      description: `Element to render in column header when sorted in ascending order`,
      control: { type: null },
    },
    descIndicator: {
      description: `Element to render in column header when sorted in descending order`,
      control: { type: null },
    },
    getRowProps: {
      description: `Function which is passed the [row](https://react-table.tanstack.com/docs/api/useTable#row-properties) object, as well as the [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) and [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset) for the current row. Returns an object of attributes to be applied to the <tr>`,
      control: { type: null },
    },
    emptyStateComponent: {
      description: `An empty state component to show the table has no rows. If \`null\` the default empty state render is \`null\``,
      control: { type: null },
    },
  },
};

export function BasicExample(): ReactElement {
  const namePredicate = `http://xmlns.com/foaf/0.1/name`;
  const datePredicate = `http://schema.org/datePublished`;

  const thing1A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 1`
  );
  const thing1 = SolidFns.addDatetime(thing1A, datePredicate, new Date());

  const thing2A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 2`
  );
  const thing2 = SolidFns.addDatetime(
    thing2A,
    datePredicate,
    new Date("1999-01-02")
  );

  const emptyDataset = SolidFns.createSolidDataset();
  const datasetWithThing1 = SolidFns.setThing(emptyDataset, thing1);
  const dataset = SolidFns.setThing(datasetWithThing1, thing2);

  return (
    <Table
      things={[
        { dataset, thing: thing1 },
        { dataset, thing: thing2 },
      ]}
      style={{ border: "1px solid black" }}
    >
      <TableColumn property={namePredicate} />
      <TableColumn property={datePredicate} dataType="datetime" />
    </Table>
  );
}

BasicExample.parameters = {
  actions: { disable: true },
};

export function MultipleValues(): ReactElement {
  const namePredicate = `http://xmlns.com/foaf/0.1/name`;
  const nickPredicate = `http://xmlns.com/foaf/0.1/nick`;

  const thing1A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 1`
  );
  const thing1B = SolidFns.addStringNoLocale(
    thing1A,
    nickPredicate,
    `Nickname`
  );
  const thing1C = SolidFns.addStringNoLocale(
    thing1B,
    nickPredicate,
    `Alt Nickname`
  );
  const thing1 = SolidFns.addStringNoLocale(
    thing1C,
    nickPredicate,
    `Final Nickname`
  );

  const thing2A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 2`
  );
  const thing2 = SolidFns.addStringNoLocale(
    thing2A,
    nickPredicate,
    `example nickname 2`
  );

  const emptyDataset = SolidFns.createSolidDataset();
  const datasetWithThing1 = SolidFns.setThing(emptyDataset, thing1);
  const dataset = SolidFns.setThing(datasetWithThing1, thing2);

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
      <TableColumn property={namePredicate} header="Name" />
      <TableColumn property={nickPredicate} header="Nickname" multiple />
    </Table>
  );
}

MultipleValues.parameters = {
  actions: { disable: true },
};

export function CustomBodyComponent(): ReactElement {
  const namePredicate = `http://xmlns.com/foaf/0.1/name`;
  const datePredicate = `http://schema.org/datePublished`;

  const thing1A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 1`
  );
  const thing1 = SolidFns.addDatetime(thing1A, datePredicate, new Date());

  const thing2A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 2`
  );
  const thing2 = SolidFns.addDatetime(
    thing2A,
    datePredicate,
    new Date("1999-01-02")
  );

  const emptyDataset = SolidFns.createSolidDataset();
  const datasetWithThing1 = SolidFns.setThing(emptyDataset, thing1);
  const dataset = SolidFns.setThing(datasetWithThing1, thing2);

  type bodyProps = {
    value?: string;
  };
  const CustomBody = ({ value }: bodyProps) => {
    return <span style={{ color: "#7C4DFF" }}>{`${value}`}</span>;
  };

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
      <TableColumn property={namePredicate} header="Name" />
      <TableColumn
        property={datePredicate}
        dataType="datetime"
        body={CustomBody}
      />
    </Table>
  );
}

CustomBodyComponent.parameters = {
  actions: { disable: true },
};

export function NestedDataExample(): ReactElement {
  const typeProperty = `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`;
  const firstNameProperty = `http://www.w3.org/2006/vcard/ns#fn`;
  const hasTelephoneProperty = `http://www.w3.org/2006/vcard/ns#hasTelephone`;
  const homeProperty = `http://www.w3.org/2006/vcard/ns#Home`;
  const workProperty = `http://www.w3.org/2006/vcard/ns#Work`;
  const valueProperty = `http://www.w3.org/2006/vcard/ns#value`;

  const PhoneNumberDisplay = ({
    numberThingIris,
    numberType,
    dataset,
  }: {
    numberThingIris: [string];
    numberType: string;
    dataset: SolidFns.SolidDataset;
  }) => {
    let phoneNumber = "";
    numberThingIris.some((numberThingIri) => {
      const numberThing = SolidFns.getThing(dataset, numberThingIri);
      if (
        numberThing &&
        SolidFns.getUrl(numberThing, typeProperty) === numberType
      ) {
        phoneNumber = SolidFns.getUrl(numberThing, valueProperty) ?? "";
        return true;
      }
      return false;
    });
    return phoneNumber;
  };

  const NestedDataExampleContent = () => {
    const datasetContext = useContext(DatasetContext);
    const { solidDataset } = datasetContext;
    if (!solidDataset) {
      return null;
    }
    const personThing = SolidFns.getThing(
      solidDataset,
      `${host}/example.ttl#me`
    );
    const alterEgoThing = SolidFns.getThing(
      solidDataset,
      `${host}/example.ttl#alterEgo`
    );
    if (!personThing || !alterEgoThing) {
      return <p>No matching thing</p>;
    }
    return (
      <Table
        things={[
          {
            dataset: solidDataset,
            thing: personThing,
          },
          {
            dataset: solidDataset,
            thing: alterEgoThing,
          },
        ]}
        style={{ border: "1px solid black" }}
      >
        <TableColumn property={firstNameProperty} header="Name" />
        <TableColumn
          property={hasTelephoneProperty}
          header="Home Phone"
          dataType="url"
          multiple
          body={({ value }) => (
            <PhoneNumberDisplay
              numberThingIris={value}
              dataset={solidDataset}
              numberType={homeProperty}
            />
          )}
        />
        <TableColumn
          property={hasTelephoneProperty}
          header="Work Phone"
          dataType="url"
          multiple
          body={({ value }) => (
            <PhoneNumberDisplay
              numberThingIris={value}
              dataset={solidDataset}
              numberType={workProperty}
            />
          )}
        />
      </Table>
    );
  };

  return (
    <DatasetProvider datasetUrl={`${host}/example.ttl`}>
      <NestedDataExampleContent />
    </DatasetProvider>
  );
}

NestedDataExample.parameters = {
  actions: { disable: true },
};

export function SortableColumns(): ReactElement {
  const namePredicate = `http://xmlns.com/foaf/0.1/name`;
  const datePredicate = `http://schema.org/datePublished`;

  const thing1A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 1`
  );
  const thing1 = SolidFns.addDatetime(thing1A, datePredicate, new Date());

  const thing2A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 2`
  );
  const thing2 = SolidFns.addDatetime(
    thing2A,
    datePredicate,
    new Date("1999-01-02")
  );

  const emptyDataset = SolidFns.createSolidDataset();
  const datasetWithThing1 = SolidFns.setThing(emptyDataset, thing1);
  const dataset = SolidFns.setThing(datasetWithThing1, thing2);

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
      <TableColumn property={namePredicate} header="Name" sortable />
      <TableColumn property={datePredicate} dataType="datetime" sortable />
    </Table>
  );
}

SortableColumns.parameters = {
  actions: { disable: true },
};

interface IFilterOnFirstColumn {
  filter: string;
}

export function FilterOnFirstColumn({
  filter,
}: IFilterOnFirstColumn): ReactElement {
  const namePredicate = `http://xmlns.com/foaf/0.1/name`;
  const datePredicate = `http://schema.org/datePublished`;

  const thing1A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 1`
  );
  const thing1 = SolidFns.addDatetime(thing1A, datePredicate, new Date());

  const thing2A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 2`
  );
  const thing2 = SolidFns.addDatetime(
    thing2A,
    datePredicate,
    new Date("1999-01-02")
  );

  const emptyDataset = SolidFns.createSolidDataset();
  const datasetWithThing1 = SolidFns.setThing(emptyDataset, thing1);
  const dataset = SolidFns.setThing(datasetWithThing1, thing2);

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
      filter={filter}
    >
      <TableColumn property={namePredicate} header="Name" filterable />
      <TableColumn property={datePredicate} dataType="datetime" />
    </Table>
  );
}

FilterOnFirstColumn.args = {
  filter: "name 2",
};

FilterOnFirstColumn.parameters = {
  actions: { disable: true },
};

export function SortingFunctionOnFirstColumn(): ReactElement {
  const namePredicate = `http://xmlns.com/foaf/0.1/name`;
  const datePredicate = `http://schema.org/datePublished`;

  const thing1A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    "Another Name"
  );
  const thing1 = SolidFns.addDatetime(thing1A, datePredicate, new Date());

  const thing2A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    "Name A"
  );
  const thing2 = SolidFns.addDatetime(
    thing2A,
    datePredicate,
    new Date("1999-01-02")
  );

  const emptyDataset = SolidFns.createSolidDataset();
  const datasetWithThing1 = SolidFns.setThing(emptyDataset, thing1);
  const dataset = SolidFns.setThing(datasetWithThing1, thing2);

  const sortFunction = (a: string, b: string) => {
    const valueA = a.split(/\s+/)[1];
    const valueB = b.split(/\s+/)[1];
    return valueA.localeCompare(valueB);
  };

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
      <TableColumn property={namePredicate} sortable sortFn={sortFunction} />
      <TableColumn property={datePredicate} dataType="datetime" />
    </Table>
  );
}

SortingFunctionOnFirstColumn.parameters = {
  actions: { disable: true },
};
export function NoDataComponent(): ReactElement {
  const namePredicate = `http://xmlns.com/foaf/0.1/name`;
  const datePredicate = `http://schema.org/datePublished`;

  const thing1A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 1`
  );
  const thing1 = SolidFns.addDatetime(thing1A, datePredicate, new Date());

  const thing2A = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    namePredicate,
    `example name 2`
  );
  const thing2 = SolidFns.addDatetime(
    thing2A,
    datePredicate,
    new Date("1999-01-02")
  );

  const emptyDataset = SolidFns.createSolidDataset();
  const datasetWithThing1 = SolidFns.setThing(emptyDataset, thing1);
  const dataset = SolidFns.setThing(datasetWithThing1, thing2);

  return (
    <Table
      things={[
        { dataset, thing: thing1 },
        { dataset, thing: thing2 },
      ]}
      style={{ border: "1px solid black" }}
      emptyStateComponent={() => <span>There is no Data</span>}
    />
  );
}

NoDataComponent.parameters = {
  actions: { disable: true },
};

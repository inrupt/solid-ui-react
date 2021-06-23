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

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import * as SolidFns from "@inrupt/solid-client";
import { Table, TableColumn } from "./index";

const namePredicate = `http://xmlns.com/foaf/0.1/name`;
const nickPredicate = `http://xmlns.com/foaf/0.1/nick`;
const booleanPredicate = `http://schema.org/isAccessibleForFree`;

const thing1A = SolidFns.addBoolean(
  SolidFns.createThing(),
  booleanPredicate,
  true
);

const thing1B = SolidFns.addStringNoLocale(
  thing1A,
  namePredicate,
  `example name 1`
);

const thing1 = SolidFns.addStringNoLocale(
  thing1B,
  nickPredicate,
  `example nick 1`
);

const thing2A = SolidFns.addBoolean(
  SolidFns.createThing(),
  booleanPredicate,
  false
);

const thing2B = SolidFns.addStringNoLocale(
  thing2A,
  namePredicate,
  `example name 2`
);

const thing2 = SolidFns.addStringNoLocale(
  thing2B,
  nickPredicate,
  `example nick 2`
);

const emptyDataset = SolidFns.createSolidDataset();
const datasetWithThing1 = SolidFns.setThing(emptyDataset, thing1);
const dataset = SolidFns.setThing(datasetWithThing1, thing2);

describe("<Table /> component snapshot tests", () => {
  it("matches snapshot", () => {
    const documentBody = render(
      <Table
        things={[
          { dataset, thing: thing1 },
          { dataset, thing: thing2 },
        ]}
      >
        <TableColumn property={namePredicate} header="Name" />
        <TableColumn property={nickPredicate} />
        <TableColumn property={booleanPredicate} dataType="boolean" />
        <TableColumn property="http://missing.property" />
      </Table>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("<Table /> component functional tests", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("TableColumn used in isolation throws an error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const { getByText } = render(
      <ErrorBoundary
        fallbackRender={({ error }) => <div>{error?.message}</div>}
      >
        <TableColumn property={namePredicate} />
      </ErrorBoundary>
    );

    await waitFor(() =>
      expect(getByText("Can't use TableColumn outside a Table.")).toBeDefined()
    );
  });
  it("uses property as header text unless header prop supplied", () => {
    const { getByText, queryByText } = render(
      <Table
        things={[
          { dataset, thing: thing1 },
          { dataset, thing: thing2 },
        ]}
      >
        <TableColumn property={namePredicate} header="Name" />
        <TableColumn property={nickPredicate} />
      </Table>
    );

    expect(getByText(nickPredicate)).not.toBeNull();
    expect(getByText("Name")).not.toBeNull();
    expect(queryByText(namePredicate)).toBeNull();
  });

  it("does not sort columns without sortable prop", () => {
    const { getByText, queryByText } = render(
      <Table
        things={[
          { dataset, thing: thing1 },
          { dataset, thing: thing2 },
        ]}
      >
        <TableColumn property={namePredicate} />
      </Table>
    );
    fireEvent.click(getByText(namePredicate));
    expect(queryByText("🔽")).toBeNull();
    expect(queryByText("🔼")).toBeNull();
  });

  it("uses sortFn for sorting if passed", () => {
    const thingA = SolidFns.addStringNoLocale(
      SolidFns.createThing(),
      namePredicate,
      "Name A"
    );
    const thingB = SolidFns.addStringNoLocale(
      SolidFns.createThing(),
      namePredicate,
      "Another Name"
    );
    const datasetWithThingA = SolidFns.setThing(
      SolidFns.createSolidDataset(),
      thingA
    );
    const datasetToCustomSort = SolidFns.setThing(datasetWithThingA, thingB);

    const sortBySecondWord = (a: string, b: string) => {
      const valueA = a.split(/\s+/)[1];
      const valueB = b.split(/\s+/)[1];
      return valueA.localeCompare(valueB);
    };

    const { getByText, queryAllByRole } = render(
      <Table
        things={[
          { dataset: datasetToCustomSort, thing: thingB },
          { dataset: datasetToCustomSort, thing: thingA },
        ]}
      >
        <TableColumn
          property={namePredicate}
          sortable
          sortFn={sortBySecondWord}
        />
      </Table>
    );
    expect(queryAllByRole("cell")[0].innerHTML).toBe("Another Name");
    expect(queryAllByRole("cell")[1].innerHTML).toBe("Name A");
    fireEvent.click(getByText(namePredicate));
    expect(queryAllByRole("cell")[0].innerHTML).toBe("Name A");
    expect(queryAllByRole("cell")[1].innerHTML).toBe("Another Name");
  });

  it("updates header when sorting", () => {
    const { getByText, queryByText } = render(
      <Table
        things={[
          { dataset, thing: thing1 },
          { dataset, thing: thing2 },
        ]}
      >
        <TableColumn property={namePredicate} header="Name" sortable />
      </Table>
    );

    expect(queryByText("🔽")).toBeNull();
    expect(queryByText("🔼")).toBeNull();

    fireEvent.click(getByText("Name"));
    expect(queryByText("🔽")).toBeNull();
    expect(getByText("🔼")).not.toBeNull();

    fireEvent.click(getByText("Name"));
    expect(queryByText("🔼")).toBeNull();
    expect(getByText("🔽")).not.toBeNull();
  });

  it("renders cells using the body prop if provided", () => {
    const CustomBodyComponent = ({ value }: any) => {
      return <span>{`${value} custom cell`}</span>;
    };

    const { getAllByText } = render(
      <Table
        things={[
          { dataset, thing: thing1 },
          { dataset, thing: thing2 },
        ]}
      >
        <TableColumn property={namePredicate} body={CustomBodyComponent} />
      </Table>
    );

    expect(getAllByText(/custom cell/)).toHaveLength(2);
  });

  it("does not filter by columns not marked as filterable", () => {
    const filterTerm = "example name 1";
    const { queryByText } = render(
      <Table
        things={[
          { dataset, thing: thing1 },
          { dataset, thing: thing2 },
        ]}
        filter={filterTerm}
      >
        <TableColumn property={namePredicate} />
      </Table>
    );

    expect(queryByText(filterTerm)).toBeNull();
  });

  it("filters by columns marked as filterable", () => {
    const filterTerm = "example name 1";
    const excludedRowText = "example name 2";
    const { getByText, queryByText } = render(
      <Table
        things={[
          { dataset, thing: thing1 },
          { dataset, thing: thing2 },
        ]}
        filter={filterTerm}
      >
        <TableColumn property={namePredicate} filterable />
      </Table>
    );

    expect(getByText(filterTerm)).not.toBeNull();
    expect(queryByText(excludedRowText)).toBeNull();
  });

  it("renders multiple values for given property only when multiple prop is passed", () => {
    const thingMultipleA = SolidFns.addStringNoLocale(
      SolidFns.createThing(),
      namePredicate,
      `multiple name 1`
    );
    const thingMultipleB = SolidFns.addStringNoLocale(
      thingMultipleA,
      nickPredicate,
      `multiple nick 1`
    );
    const thingMultipleC = SolidFns.addStringNoLocale(
      thingMultipleB,
      namePredicate,
      `multiple name 2`
    );
    const thingMultiple = SolidFns.addStringNoLocale(
      thingMultipleC,
      nickPredicate,
      `multiple nick 2`
    );

    const datasetWithMultiple = SolidFns.setThing(dataset, thingMultiple);

    const { getByText, queryByText } = render(
      <Table
        things={[
          { dataset: datasetWithMultiple, thing: thing1 },
          { dataset: datasetWithMultiple, thing: thing2 },
          { dataset: datasetWithMultiple, thing: thingMultiple },
        ]}
      >
        <TableColumn property={namePredicate} filterable multiple />
        <TableColumn property={nickPredicate} filterable />
      </Table>
    );

    expect(getByText(/multiple name 1/)).not.toBeNull();
    expect(getByText(/multiple name 2/)).not.toBeNull();
    expect(getByText(/multiple nick 1/)).not.toBeNull();
    expect(queryByText(/multiple nick 2/)).toBeNull();
  });

  it("renders fallback component when passed and there are no rows", () => {
    const { getByText } = render(
      <Table
        things={[
          { dataset, thing: thing1 },
          { dataset, thing: thing2 },
        ]}
        emptyStateComponent={() => <span>There is no Data</span>}
      />
    );

    expect(getByText(/There is no Data/)).not.toBeNull();
  });
});

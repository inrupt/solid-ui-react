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
import { render } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import { Table, TableColumn } from "./index";

const namePredicate = `http://xmlns.com/foaf/0.1/name`;
const nickPredicate = `http://xmlns.com/foaf/0.1/nick`;

const thing1A = SolidFns.addStringNoLocale(
  SolidFns.createThing(),
  namePredicate,
  `example name 1`
);

const thing1 = SolidFns.addStringNoLocale(
  thing1A,
  nickPredicate,
  `example nick 1`
);

const thing2A = SolidFns.addStringNoLocale(
  SolidFns.createThing(),
  namePredicate,
  `example name 2`
);

const thing2 = SolidFns.addStringNoLocale(
  thing2A,
  nickPredicate,
  `example nick 2`
);

describe("<Table /> component snapshot test", () => {
  it("matches snapshot", () => {
    const documentBody = render(
      <Table things={[thing1, thing2]}>
        <TableColumn property={namePredicate} header="Name" />
        <TableColumn property={nickPredicate} />
      </Table>
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
  it("TableColumn used in isolation matches snpshot", () => {
    const documentBody = render(
      <TableColumn property={namePredicate} header="Name" />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

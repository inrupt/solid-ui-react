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

import React, { ReactElement } from "react";
import * as SolidFns from "@inrupt/solid-client";
import { withKnobs, text, boolean, object } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import { Table, TableColumn } from "../src/components/table";

export default {
  title: "Components/Table",
  component: Table,
  decorators: [withKnobs],
};

const inputOptions = {
  type: "text",
  name: "test-name",
  className: "test-class",
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

  type bodyProps = {
    value?: string;
  };
  const CustomBodyComponent = ({ value }: bodyProps) => {
    return <span style={{ color: "#7C4DFF" }}>{`${value}`}</span>;
  };

  return (
    <Table things={[thing1, thing2]} style={{ border: "1px solid black" }}>
      <TableColumn property={namePredicate} header="Name" />
      <TableColumn
        property={datePredicate}
        dataType="datetime"
        body={CustomBodyComponent}
      />
    </Table>
  );
}

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
import List from "../src/components/list";

export default {
  title: "List component",
  component: List,
};

export function WithChildAndElement(): ReactElement {
  const examplePredicate = "http://xmlns.com/foaf/0.1/nick";
  const thing = SolidFns.createThing();

  const updatedThingValue = SolidFns.addStringWithLocale(
    thing,
    examplePredicate,
    "laura",
    "en_gb"
  );

  const updatedThingValue2 = SolidFns.addStringWithLocale(
    updatedThingValue,
    examplePredicate,
    "john",
    "en_gb"
  );

  const updatedThingValue3 = SolidFns.addStringWithLocale(
    updatedThingValue2,
    examplePredicate,
    "kate",
    "en_gb"
  );

  const finalThing = SolidFns.addStringWithLocale(
    updatedThingValue3,
    examplePredicate,
    "paul",
    "en_gb"
  );

  const exampleDataSet = SolidFns.setThing(
    SolidFns.createLitDataset(),
    finalThing
  );

  return (
    <List
      dataSet={exampleDataSet}
      thing={finalThing}
      property={examplePredicate}
      type="string"
      locale="en_gb"
      element={(
        props: JSX.IntrinsicAttributes &
          React.ClassAttributes<HTMLDListElement> &
          React.HTMLAttributes<HTMLDListElement>
        // eslint-disable-next-line react/jsx-props-no-spreading
      ) => <dl {...props} />}
      child={({ value, index }) => (
        <>
          <dt>name</dt>
          <dd>{value}</dd>
          <dt>index</dt>
          <dd>{index}</dd>
        </>
      )}
    />
  );
}

export function DefaultChildAndElement(): ReactElement {
  const examplePredicate = "http://xmlns.com/foaf/0.1/nick";
  const thing = SolidFns.createThing();

  const updatedThingValue = SolidFns.addStringWithLocale(
    thing,
    examplePredicate,
    "laura",
    "en_gb"
  );

  const updatedThingValue2 = SolidFns.addStringWithLocale(
    updatedThingValue,
    examplePredicate,
    "john",
    "en_gb"
  );

  const updatedThingValue3 = SolidFns.addStringWithLocale(
    updatedThingValue2,
    examplePredicate,
    "kate",
    "en_gb"
  );

  const finalThing = SolidFns.addStringWithLocale(
    updatedThingValue3,
    examplePredicate,
    "paul",
    "en_gb"
  );

  const exampleDataSet = SolidFns.setThing(
    SolidFns.createLitDataset(),
    finalThing
  );

  return (
    <List
      dataSet={exampleDataSet}
      thing={finalThing}
      property={examplePredicate}
      type="string"
      locale="en_gb"
    />
  );
}

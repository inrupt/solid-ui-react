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
import { Link } from "../../src/components/link";

export default {
  title: "Components/Link",
  component: Link,
};

export function WithChildren({ property }: { property: string }): ReactElement {
  const exampleUrl = "http://test.url";
  const exampleThing = SolidFns.addUrl(
    SolidFns.createThing(),
    property,
    exampleUrl
  );
  return (
    <Link thing={exampleThing} property={property}>
      <span>Example child</span>
    </Link>
  );
}

WithChildren.args = {
  property: "http://xmlns.com/foaf/0.1/homepage",
};

WithChildren.parameters = {
  actions: { disable: true },
};

export function WithoutChildren({
  property,
}: {
  property: string;
}): ReactElement {
  const exampleUrl = "http://test.url";
  const exampleThing = SolidFns.addUrl(
    SolidFns.createThing(),
    property,
    exampleUrl
  );
  return <Link thing={exampleThing} property={property} />;
}

WithoutChildren.parameters = {
  actions: { disable: true },
};

WithoutChildren.args = {
  property: "http://xmlns.com/foaf/0.1/homepage",
};

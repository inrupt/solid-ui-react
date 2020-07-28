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

import * as React from "react";
import { render } from "@testing-library/react";
import * as litPodFns from "@solid/lit-pod";
import Text from "./index";

const mockPredicate = `http://xmlns.com/foaf/0.1/nick`;
const mockNick = "test nick value";

const mockThing = litPodFns.addStringNoLocale(
  litPodFns.createThing(),
  mockPredicate,
  mockNick
);

const mockDataSet = litPodFns.setThing(litPodFns.createLitDataset(), mockThing);

describe("<Text /> component snapshot test", () => {
  it("matches snapshot", () => {
    const documentBody = render(
      <Text dataSet={mockDataSet} thing={mockThing} predicate={mockPredicate} />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot with edit true and inputOptions", () => {
    const inputOptions = {
      id: "input-test",
      name: "input-text",
      placeholder: "some name value",
    };

    const documentBody = render(
      <Text
        edit
        inputOptions={inputOptions}
        className="test-class"
        dataSet={mockDataSet}
        thing={mockThing}
        predicate={mockPredicate}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

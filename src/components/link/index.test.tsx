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

import React from "react";
import { render } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import { Link } from "./index";
import * as helpers from "../../helpers";

const mockUrl = "http://test.url";
const mockPredicate = `http://xmlns.com/foaf/0.1/homepage`;
const mockThing = SolidFns.addUrl(
  SolidFns.createThing(),
  mockPredicate,
  mockUrl
);

describe("Link component", () => {
  it("Link snapshot", () => {
    const { asFragment } = render(
      <Link thing={mockThing} property={mockPredicate} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders default error message if there is an error", () => {
    const documentBody = render(
      <Link thing={mockThing} property="https://example.com/bad-url" />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders custom error component if passed and there is an error", () => {
    const documentBody = render(
      <Link
        thing={mockThing}
        property="https://example.com/bad-url"
        errorComponent={({ error }) => (
          <span id="custom-error-component">{error.toString()}</span>
        )}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
  it("matches snapshot while fetching data", () => {
    jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
      thing: undefined,
      error: undefined,
      value: null,
      setDataset: jest.fn(),
      setThing: jest.fn(),
      property: mockPredicate,
    });
    const documentBody = render(<Link property={mockPredicate} />);
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("renders loading component if passed while fetching data", () => {
    jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
      thing: undefined,
      error: undefined,
      value: null,
      setDataset: jest.fn(),
      setThing: jest.fn(),
      property: mockPredicate,
    });
    const documentBody = render(
      <Link
        property={mockPredicate}
        loadingComponent={() => (
          <span id="custom-loading-component">loading...</span>
        )}
      />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
  it("Should call getUrl and use result as href value", () => {
    jest.spyOn(SolidFns, "getUrl").mockImplementationOnce(() => mockUrl);
    const { getByText } = render(
      <Link thing={mockThing} property={mockPredicate} />
    );
    expect(SolidFns.getUrl).toHaveBeenCalled();
    expect(getByText(mockUrl).getAttribute("href")).toBe(mockUrl);
  });
  it("When passed no children, should render href as link text", () => {
    const { getByText } = render(
      <Link thing={mockThing} property={mockPredicate} />
    );
    expect(getByText(mockUrl)).toBeTruthy();
  });
  it("When passed children, should render as link text", () => {
    const { getByText } = render(
      <Link thing={mockThing} property={mockPredicate}>
        <span>Test child</span>
      </Link>
    );
    expect(getByText("Test child")).toBeTruthy();
  });
  it("Passes down additional props to <a>", () => {
    const { getByText } = render(
      <Link
        thing={mockThing}
        property={mockPredicate}
        className="test-class"
        target="_self"
        rel="abcd"
      />
    );
    expect(getByText(mockUrl).getAttribute("target")).toBe("_self");
    expect(getByText(mockUrl).getAttribute("class")).toBe("test-class");
    expect(getByText(mockUrl).getAttribute("rel")).toBe("abcd");
  });

  it("Defaults rel to 'noopener noreferrer' if target=_blank", () => {
    const { getByText } = render(
      <Link
        thing={mockThing}
        property={mockPredicate}
        className="test-class"
        target="_blank"
      />
    );
    expect(getByText(mockUrl).getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("Overrides rel if passed in", () => {
    const { getByText } = render(
      <Link
        thing={mockThing}
        property={mockPredicate}
        className="test-class"
        target="_blank"
        rel="test"
      />
    );
    expect(getByText(mockUrl).getAttribute("rel")).toBe("test");
  });

  it("renders in edit mode", () => {
    const mockDataset = SolidFns.setThing(
      SolidFns.createSolidDataset(),
      mockThing
    );

    const { asFragment } = render(
      <Link
        thing={mockThing}
        property={mockPredicate}
        solidDataset={mockDataset}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

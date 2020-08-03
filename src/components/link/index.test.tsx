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
import Link from ".";

const mockUrl = "http://test.url";
const mockPredicate = `http://xmlns.com/foaf/0.1/homepage`;
const mockThing = SolidFns.addUrl(
  SolidFns.createThing(),
  mockPredicate,
  mockUrl
);

jest.spyOn(SolidFns, "getUrlOne").mockImplementation(() => mockUrl);

describe("Link component", () => {
  it("Link snapshot", () => {
    const { asFragment } = render(
      <Link thing={mockThing} property={mockPredicate} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it("Should call getUrlOne and use result as href value", () => {
    const { getByText } = render(
      <Link thing={mockThing} property={mockPredicate} />
    );
    expect(SolidFns.getUrlOne).toHaveBeenCalled();
    expect(getByText(mockUrl).getAttribute("href")).toBe(mockUrl);
  });
  it("When getUrlOne returns null, should throw an error", () => {
    (SolidFns.getUrlOne as jest.Mock).mockReturnValueOnce(null);
    expect(() =>
      render(<Link thing={mockThing} property={mockPredicate} />)
    ).toThrowErrorMatchingSnapshot();
    expect(SolidFns.getUrlOne).toHaveBeenCalled();
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
});

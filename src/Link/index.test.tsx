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
import * as LitPodFns from "@solid/lit-pod";
import Link from ".";

const mockUrl = "test.url";
const mockPredicate = `http://xmlns.com/foaf/0.1/nick`;
const mockThing = LitPodFns.addStringUnlocalized(
  LitPodFns.createThing(),
  mockPredicate,
  "timbl"
);

jest.spyOn(LitPodFns, "getUrlOne").mockImplementation(() => mockUrl);

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
    expect(LitPodFns.getUrlOne).toHaveBeenCalled();
    expect(getByText(mockPredicate).getAttribute("href")).toBe(mockUrl);
  });
  it("When getUrlOne returns null, should set href to empty string", () => {
    (LitPodFns.getUrlOne as jest.Mock).mockReturnValue(null);
    const { getByText } = render(
      <Link thing={mockThing} property={mockPredicate} />
    );
    expect(LitPodFns.getUrlOne).toHaveBeenCalled();
    expect(getByText(mockPredicate).getAttribute("href")).toBe("");
  });
  it("When passed no children, should render given property as link text", () => {
    const { getByText } = render(
      <Link thing={mockThing} property={mockPredicate} />
    );
    expect(getByText(mockPredicate)).toBeTruthy();
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
        linkOptions={{ target: "_blank" }}
      />
    );
    expect(getByText(mockPredicate).getAttribute("target")).toBe("_blank");
    expect(getByText(mockPredicate).getAttribute("class")).toBe("test-class");
  });
});

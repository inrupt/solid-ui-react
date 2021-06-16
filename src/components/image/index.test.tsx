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
import { render, waitFor, fireEvent } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import { Image } from ".";
import * as helpers from "../../helpers";

const mockAlt = "test img";
const mockUrl = "http://test.url/image.png";
const mockProperty = `http://www.w3.org/2006/vcard/ns#hasPhoto`;
const mockThing = SolidFns.addUrl(
  SolidFns.createThing(),
  mockProperty,
  mockUrl
);

const mockObjectUrl = "mock object url";
const mockFile = SolidFns.mockFileFrom(mockUrl);
window.URL.createObjectURL = jest.fn(() => mockObjectUrl);

describe("Image component", () => {
  describe("Image snapshots", () => {
    it("matches snapshot with standard props", async () => {
      jest.spyOn(SolidFns, "getUrl").mockImplementationOnce(() => mockUrl);
      jest.spyOn(SolidFns, "getFile").mockResolvedValueOnce(mockFile);
      jest.spyOn(SolidFns, "overwriteFile").mockResolvedValueOnce(mockFile);
      const { asFragment, getByAltText } = render(
        <Image thing={mockThing} property={mockProperty} />
      );
      await waitFor(() =>
        expect(getByAltText("").getAttribute("src")).toBe(mockObjectUrl)
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot with additional props for img and input", async () => {
      jest.spyOn(SolidFns, "getUrl").mockImplementationOnce(() => mockUrl);
      jest.spyOn(SolidFns, "getFile").mockResolvedValueOnce(mockFile);
      jest.spyOn(SolidFns, "overwriteFile").mockResolvedValueOnce(mockFile);
      const { asFragment, getByAltText } = render(
        <Image
          thing={mockThing}
          property={mockProperty}
          alt={mockAlt}
          edit
          className="img-class"
          inputProps={{ className: "input-class" }}
        />
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(mockObjectUrl)
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("renders an error message if an errorComponent is provided", () => {
      const emptyThing = SolidFns.createThing();
      const { asFragment } = render(
        <Image
          thing={emptyThing}
          property="https://example.com/bad-url"
          errorComponent={({ error }) => (
            <span id="custom-error-component">{error.toString()}</span>
          )}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("renders default error message if there is an error and no errorComponent is passed", () => {
      const emptyThing = SolidFns.createThing();

      const { asFragment } = render(
        <Image thing={emptyThing} property="https://example.com/bad-url" />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it("renders default loading message if thing is undefined and there is no error", () => {
      jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
        thing: undefined,
        error: undefined,
        value: null,
        setDataset: jest.fn(),
        setThing: jest.fn(),
        property: mockProperty,
      });
      const { asFragment } = render(
        <Image thing={undefined} property="https://example.com/bad-url" />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it("renders loading component if passed and thing is undefined and there is no error", () => {
      jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
        thing: undefined,
        error: undefined,
        value: null,
        setDataset: jest.fn(),
        setThing: jest.fn(),
        property: mockProperty,
      });
      const { asFragment } = render(
        <Image
          thing={undefined}
          loadingComponent={() => (
            <span id="custom-loading-component">loading...</span>
          )}
          property="https://example.com/bad-url"
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
    it("does not render default loading message if loadingComponent is null", () => {
      jest.spyOn(helpers, "useProperty").mockReturnValueOnce({
        thing: undefined,
        error: undefined,
        value: null,
        setDataset: jest.fn(),
        setThing: jest.fn(),
        property: mockProperty,
      });
      const { asFragment } = render(
        <Image
          thing={undefined}
          property="https://example.com/bad-url"
          loadingComponent={null}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("Image functional tests", () => {
    beforeEach(() => {
      jest.spyOn(SolidFns, "getUrl").mockImplementation(() => mockUrl);
      jest.spyOn(SolidFns, "getFile").mockResolvedValue(mockFile);
      jest.spyOn(SolidFns, "overwriteFile").mockResolvedValue(mockFile);
    });

    it("Should call getUrl using given thing and property", async () => {
      const { getByAltText } = render(
        <Image thing={mockThing} property={mockProperty} alt={mockAlt} />
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(mockObjectUrl)
      );
      expect(SolidFns.getUrl).toHaveBeenCalledWith(mockThing, mockProperty);
    });

    it("When getUrl returns null, with an errorComponent, should render the error", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});

      (SolidFns.getUrl as jest.Mock).mockReturnValueOnce(null);
      const { asFragment } = render(
        <Image
          thing={mockThing}
          property={mockProperty}
          alt={mockAlt}
          errorComponent={({ error }) => <span>{error.toString()}</span>}
        />
      );

      expect(SolidFns.getUrl).toHaveBeenCalled();
      expect(asFragment()).toMatchSnapshot();
    });

    it("Should call onError if initial fetch fails, if it is passed", async () => {
      const mockOnError = jest.fn();
      (SolidFns.getFile as jest.Mock).mockRejectedValueOnce(null);
      render(
        <Image
          thing={mockThing}
          property={mockProperty}
          alt={mockAlt}
          edit
          autosave
          onError={mockOnError}
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() => expect(mockOnError).toHaveBeenCalled());
    });

    it("Should not call overwriteFile on change if autosave is false", async () => {
      const { getByAltText } = render(
        <Image
          thing={mockThing}
          property={mockProperty}
          alt={mockAlt}
          edit
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(mockObjectUrl)
      );
      fireEvent.change(getByAltText("test-input"), {
        target: {
          files: [mockFile],
        },
      });
      expect(SolidFns.overwriteFile).not.toHaveBeenCalled();
    });

    it("Should call overwriteFile on change if autosave is true", async () => {
      const mockUpdatedObjectUrl = "updated mock object url";
      const { getByAltText } = render(
        <Image
          thing={mockThing}
          property={mockProperty}
          alt={mockAlt}
          edit
          autosave
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(mockObjectUrl)
      );
      fireEvent.change(getByAltText("test-input"), {
        target: {
          files: [mockFile],
        },
      });
      (window.URL.createObjectURL as jest.Mock).mockReturnValueOnce(
        mockUpdatedObjectUrl
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(
          mockUpdatedObjectUrl
        )
      );
      expect(SolidFns.overwriteFile).toHaveBeenCalled();
    });

    test.skip("Should not call overwriteFile on change if file size > maxSize", async () => {
      const { getByAltText } = render(
        <Image
          thing={mockThing}
          property={mockProperty}
          alt={mockAlt}
          edit
          autosave
          maxSize={0}
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(mockObjectUrl)
      );
      fireEvent.change(getByAltText("test-input"), {
        target: {
          files: [mockFile],
        },
      });
      expect(SolidFns.overwriteFile).not.toHaveBeenCalled();
    });

    it("Should call onSave after successful overwrite, if it is passed", async () => {
      const mockUpdatedObjectUrl = "updated mock object url";
      const mockOnSave = jest.fn();
      const { getByAltText } = render(
        <Image
          thing={mockThing}
          property={mockProperty}
          alt={mockAlt}
          edit
          autosave
          onSave={mockOnSave}
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(mockObjectUrl)
      );
      fireEvent.change(getByAltText("test-input"), {
        target: {
          files: [mockFile],
        },
      });
      (window.URL.createObjectURL as jest.Mock).mockReturnValueOnce(
        mockUpdatedObjectUrl
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(
          mockUpdatedObjectUrl
        )
      );
      expect(mockOnSave).toHaveBeenCalled();
    });

    it("Should not fetch updated image if overwriteFile fails", async () => {
      (SolidFns.overwriteFile as jest.Mock).mockRejectedValueOnce(null);
      const { getByAltText } = render(
        <Image
          thing={mockThing}
          property={mockProperty}
          alt={mockAlt}
          edit
          autosave
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(mockObjectUrl)
      );
      fireEvent.change(getByAltText("test-input"), {
        target: {
          files: [mockFile],
        },
      });
      await waitFor(() =>
        expect(SolidFns.overwriteFile).toHaveBeenCalledTimes(1)
      );
      await waitFor(() => expect(SolidFns.getFile).toHaveBeenCalledTimes(1));
    });

    it("Should call onError if overwriteFile fails, if it is passed", async () => {
      const mockOnError = jest.fn();
      (SolidFns.overwriteFile as jest.Mock).mockRejectedValueOnce(null);
      const { getByAltText } = render(
        <Image
          thing={mockThing}
          property={mockProperty}
          alt={mockAlt}
          edit
          autosave
          onError={mockOnError}
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByAltText(mockAlt).getAttribute("src")).toBe(mockObjectUrl)
      );
      fireEvent.change(getByAltText("test-input"), {
        target: {
          files: [mockFile],
        },
      });
      await waitFor(() => expect(mockOnError).toHaveBeenCalled());
    });
  });
});

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
import { ErrorBoundary } from "react-error-boundary";
import * as SolidFns from "@inrupt/solid-client";
import Video from ".";

const mockTitle = "test video";
const mockUrl = "http://test.url/video.mp4";
const mockProperty = `http://www.w3.org/2006/vcard/ns#hasPhoto`;
const mockThing = SolidFns.addUrl(
  SolidFns.createThing(),
  mockProperty,
  mockUrl
);
const mockFileBlob = new Blob([""], { type: "video/mp4" }) as Blob &
  SolidFns.WithResourceInfo;
const mockObjectUrl = "mock object url";
const mockFile = new File(["test file"], "test.mp4", { type: "video/mp4" });
window.URL.createObjectURL = jest.fn(() => mockObjectUrl);

jest.spyOn(SolidFns, "getUrl").mockImplementation(() => mockUrl);
jest.spyOn(SolidFns, "unstable_fetchFile").mockResolvedValue(mockFileBlob);
jest.spyOn(SolidFns, "unstable_overwriteFile").mockResolvedValue(mockFileBlob);

describe("Video component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Video snapshots", () => {
    it("matches snapshot with standard props", async () => {
      const { asFragment, getByTitle } = render(
        <Video thing={mockThing} property={mockProperty} title={mockTitle} />
      );
      await waitFor(() =>
        expect(getByTitle("").getAttribute("src")).toBe(mockObjectUrl)
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot with additional props for video and input", async () => {
      const { asFragment, getByTitle } = render(
        <Video
          thing={mockThing}
          property={mockProperty}
          title={mockTitle}
          edit
          className="video-class"
          inputProps={{ className: "input-class" }}
        />
      );
      await waitFor(() =>
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(mockObjectUrl)
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("Video functional tests", () => {
    it("Should call getUrl using given thing and property", async () => {
      const { getByTitle } = render(
        <Video thing={mockThing} property={mockProperty} title={mockTitle} />
      );
      await waitFor(() =>
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(mockObjectUrl)
      );
      expect(SolidFns.getUrl).toHaveBeenCalledWith(mockThing, mockProperty);
    });

    it("When getUrl returns null, should throw an error", () => {
      jest.spyOn(console, "error").mockImplementationOnce(() => {});

      (SolidFns.getUrl as jest.Mock).mockReturnValueOnce(null);
      expect(() =>
        render(
          <Video thing={mockThing} property={mockProperty} title={mockTitle} />
        )
      ).toThrowErrorMatchingSnapshot();
      expect(SolidFns.getUrl).toHaveBeenCalled();

      // eslint-disable-next-line no-console
      (console.error as jest.Mock).mockRestore();
    });

    it("Should throw error if initial fetch fails, if onError is not passed", async () => {
      jest.spyOn(console, "error").mockImplementationOnce(() => {});
      (SolidFns.unstable_fetchFile as jest.Mock).mockRejectedValueOnce(
        "Error in fetch"
      );

      const { getByText } = render(
        <ErrorBoundary fallbackRender={({ error }) => <div>{error}</div>}>
          <Video thing={mockThing} property={mockProperty} />
        </ErrorBoundary>
      );

      await waitFor(() => expect(getByText("Error in fetch")).toBeDefined());

      // eslint-disable-next-line no-console
      (console.error as jest.Mock).mockRestore();
    });

    it("Should call onError if initial fetch fails, if it is passed", async () => {
      const mockOnError = jest.fn();
      (SolidFns.unstable_fetchFile as jest.Mock).mockRejectedValueOnce(null);
      render(
        <Video
          thing={mockThing}
          property={mockProperty}
          title={mockTitle}
          edit
          autosave
          onError={mockOnError}
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() => expect(mockOnError).toHaveBeenCalled());
    });

    it("Should not call overwriteFile on change if autosave is false", async () => {
      const { getByAltText, getByTitle } = render(
        <Video
          thing={mockThing}
          property={mockProperty}
          title={mockTitle}
          edit
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(mockObjectUrl)
      );
      fireEvent.change(getByAltText("test-input"), {
        target: {
          files: [mockFile],
        },
      });
      expect(SolidFns.unstable_overwriteFile).not.toHaveBeenCalled();
    });

    it("Should call overwriteFile on change if autosave is true", async () => {
      const mockUpdatedObjectUrl = "updated mock object url";
      const { getByAltText, getByTitle } = render(
        <Video
          thing={mockThing}
          property={mockProperty}
          title={mockTitle}
          edit
          autosave
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(mockObjectUrl)
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
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(
          mockUpdatedObjectUrl
        )
      );
      expect(SolidFns.unstable_overwriteFile).toHaveBeenCalled();
    });

    it("Should not call overwriteFile on change if file size > maxSize", async () => {
      const { getByAltText, getByTitle } = render(
        <Video
          thing={mockThing}
          property={mockProperty}
          title={mockTitle}
          edit
          autosave
          maxSize={0}
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(mockObjectUrl)
      );
      fireEvent.change(getByAltText("test-input"), {
        target: {
          files: [mockFile],
        },
      });
      expect(SolidFns.unstable_overwriteFile).not.toHaveBeenCalled();
    });

    it("Should call onSave after successful overwrite, if it is passed", async () => {
      const mockUpdatedObjectUrl = "updated mock object url";
      const mockOnSave = jest.fn();
      const { getByAltText, getByTitle } = render(
        <Video
          thing={mockThing}
          property={mockProperty}
          title={mockTitle}
          edit
          autosave
          onSave={mockOnSave}
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(mockObjectUrl)
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
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(
          mockUpdatedObjectUrl
        )
      );
      expect(mockOnSave).toHaveBeenCalled();
    });

    it("Should not fetch updated video if overwriteFile fails", async () => {
      (SolidFns.unstable_overwriteFile as jest.Mock).mockRejectedValueOnce(
        null
      );
      const { getByAltText, getByTitle } = render(
        <Video
          thing={mockThing}
          property={mockProperty}
          title={mockTitle}
          edit
          autosave
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(mockObjectUrl)
      );
      fireEvent.change(getByAltText("test-input"), {
        target: {
          files: [mockFile],
        },
      });
      await waitFor(() =>
        expect(SolidFns.unstable_overwriteFile).toHaveBeenCalledTimes(1)
      );
      await waitFor(() =>
        expect(SolidFns.unstable_fetchFile).toHaveBeenCalledTimes(1)
      );
    });

    it("Should call onError if overwriteFile fails, if it is passed", async () => {
      const mockOnError = jest.fn();
      (SolidFns.unstable_overwriteFile as jest.Mock).mockRejectedValueOnce(
        null
      );
      const { getByAltText, getByTitle } = render(
        <Video
          thing={mockThing}
          property={mockProperty}
          title={mockTitle}
          edit
          autosave
          onError={mockOnError}
          inputProps={{ alt: "test-input" }}
        />
      );
      await waitFor(() =>
        expect(getByTitle(mockTitle).getAttribute("src")).toBe(mockObjectUrl)
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

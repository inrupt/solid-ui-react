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

import * as SolidFns from "@inrupt/solid-client";
import { getValueByTypeAll, DataType } from ".";

describe("getValueByTypeAll", () => {
  it.each([
    ["string", "getStringNoLocaleAll", ["mockString1"], undefined],
    ["string", "getStringWithLocaleAll", ["mockString1"], "en"],
    ["boolean", "getBooleanAll", [true], undefined],
    ["datetime", "getDatetimeAll", [new Date()], undefined],
    ["decimal", "getDecimalAll", [1.23], undefined],
    ["integer", "getIntegerAll", [100], undefined],
    ["url", "getUrlAll", ["http://mock.url"], undefined],
  ])(
    "when dataType is %s, calls %s and returns array of values",
    (dataType, getter, mockValue, locale) => {
      const mockThing = SolidFns.mockThingFrom("http://mock.thing");
      const mockProperty = "mockProperty";
      const mockGetter = jest
        .spyOn(SolidFns, getter as any)
        .mockImplementationOnce(() => mockValue);

      const value = getValueByTypeAll(
        dataType as DataType,
        mockThing,
        mockProperty,
        locale
      );
      expect(value).toBe(mockValue);

      const args = [mockThing, mockProperty];
      if (locale) {
        args.push(locale);
      }
      expect(mockGetter).toHaveBeenCalledWith(...args);
      expect(mockGetter).toHaveBeenCalledTimes(1);
    }
  );
});

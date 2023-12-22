//
// Copyright Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import SolidFns from "@inrupt/solid-client";
import type { DataType } from ".";
import { getValueByTypeAll, getPropertyForThing, getValueByType } from ".";

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
        // getter doesn't get the narrow type from the values passed to the test.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .spyOn(SolidFns, getter as any)
        .mockImplementationOnce(() => mockValue);

      const value = getValueByTypeAll(
        dataType as DataType,
        mockThing,
        mockProperty,
        locale,
      );
      expect(value).toBe(mockValue);

      const args = [mockThing, mockProperty];
      if (locale) {
        args.push(locale);
      }
      expect(mockGetter).toHaveBeenCalledWith(...args);
      expect(mockGetter).toHaveBeenCalledTimes(1);
    },
  );
});

describe("getPropertyForThing", () => {
  it("selects the first property with a value", () => {
    const propertySelector = getValueByType;
    const type = "string";
    const mockThing = SolidFns.mockThingFrom("http://mock.thing");
    const properties = [
      "https://example.com/mock-prop-1",
      "https://example.com/mock-prop-2",
      "https://example.com/mock-prop-3",
    ];

    const thingWithString = SolidFns.setStringNoLocale(
      mockThing,
      properties[1],
      "test",
    );

    expect(
      getPropertyForThing(propertySelector, type, thingWithString, properties),
    ).toEqual(properties[1]);
  });

  it("selects the first property if there are no matches", () => {
    const propertySelector = getValueByType;
    const type = "string";
    const mockThing = SolidFns.mockThingFrom("http://mock.thing");
    const properties = [
      "https://example.com/mock-prop-1",
      "https://example.com/mock-prop-2",
      "https://example.com/mock-prop-3",
    ];

    expect(
      getPropertyForThing(propertySelector, type, mockThing, properties),
    ).toEqual(properties[0]);
  });

  it("selects with locale if passed", () => {
    const propertySelector = getValueByType;
    const type = "string";
    const locale = "en";
    const mockThing = SolidFns.mockThingFrom("http://mock.thing");
    const properties = [
      "https://example.com/mock-prop-1",
      "https://example.com/mock-prop-2",
      "https://example.com/mock-prop-3",
    ];

    const thingWithString = SolidFns.setStringWithLocale(
      mockThing,
      properties[1],
      "test",
      locale,
    );

    expect(
      getPropertyForThing(
        propertySelector,
        type,
        thingWithString,
        properties,
        locale,
      ),
    ).toEqual(properties[1]);
  });
});

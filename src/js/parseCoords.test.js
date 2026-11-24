import parseCoords from "./parseCoords";

describe("parseCoords", () => {
  test.each([
    ["51.50851, -0.12572"],
    ["51.50851,-0.12572"],
    ["[51.50851, -0.12572]"],
    ["51.50851, −0.12572"],
    ["51.50851,−0.12572"],
    ["[51.50851, −0.12572]"],
    ["  [51.50851,   -0.12572]  "],
  ])("parses %s", (input) => {
    expect(parseCoords(input)).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test.each([
    [""],
    ["51.50851"],
    ["51.50851 -0.12572"],
    ["abc, def"],
    ["[51.50851, -0.12572"],
    ["51.50851, -0.12572, 1"],
    ["91, 0"],
    ["0, 181"],
  ])("throws on %p", (input) => {
    expect(() => parseCoords(input)).toThrow();
  });
});

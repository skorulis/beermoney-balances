describe("Int parsing", function() {
  it("Parses 100", function() {
  	expect(parseIntText("100")).toBe(100);
  });
  it("Parses 100,000", function() {
  	expect(parseIntText("100,000")).toBe(100000);
  });
  it("Parses 58K", function() {
  	expect(parseIntText("58K")).toBe(58000);
  });

  it("Doesn't parse garbage", function() {
  	expect(parseIntText("garbage")).toBeNaN();
  });
});
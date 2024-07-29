import "@testing-library/jest-dom";

afterEach(() => {
  const cleanup = require("@testing-library/react").cleanup;
  cleanup();
});

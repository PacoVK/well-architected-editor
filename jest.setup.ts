import "@testing-library/jest-dom";

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0,
} as unknown as Storage;

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

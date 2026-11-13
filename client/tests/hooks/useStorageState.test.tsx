import { renderHook, act } from "@testing-library/react";
import { useLocalStorageState } from "../../src/hooks/useLocalStorageState";
import { useSessionStorageState } from "../../src/hooks/useSessionStorageState";

describe.each([
  ["useLocalStorageState", useLocalStorageState, localStorage],
  ["useSessionStorageState", useSessionStorageState, sessionStorage],
])("%s", (_name, useHook, storage) => {
  beforeEach(() => {
    storage.clear();
  });

  it("returns the initial state and persists it", () => {
    const { result } = renderHook(() => useHook({ a: 1 }, "key"));
    expect(result.current[0]).toEqual({ a: 1 });
    expect(JSON.parse(storage.getItem("key") as string)).toEqual({ a: 1 });
  });

  it("reads an existing stored value instead of the initial state", () => {
    storage.setItem("key", JSON.stringify("stored"));
    const { result } = renderHook(() => useHook("initial", "key"));
    expect(result.current[0]).toBe("stored");
  });

  it("writes updates back to storage", () => {
    const { result } = renderHook(() => useHook(0, "key"));
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
    expect(storage.getItem("key")).toBe("5");
  });
});

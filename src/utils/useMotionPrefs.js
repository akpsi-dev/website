import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "akpsi-reduced-motion";

function safeMatchMedia(query) {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  return window.matchMedia(query);
}

function osPrefersReduced() {
  return safeMatchMedia("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function lowEndDevice() {
  if (typeof navigator === "undefined") return false;
  const lowMemory =
    typeof navigator.deviceMemory === "number" && navigator.deviceMemory < 4;
  const saveData = navigator.connection?.saveData === true;
  return lowMemory || saveData;
}

function storedToggle() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

const MotionPrefsContext = createContext({
  reducedMotion: false,
  userToggled: false,
  setUserToggle: () => {},
  finePointer: true,
});

export function MotionPrefsProvider({ children }) {
  const [osReduced, setOsReduced] = useState(osPrefersReduced);
  const [userToggled, setUserToggled] = useState(storedToggle);
  const [finePointer, setFinePointer] = useState(
    () => safeMatchMedia("(pointer: fine)")?.matches ?? true,
  );

  useEffect(() => {
    const motionQuery = safeMatchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = safeMatchMedia("(pointer: fine)");
    if (!motionQuery || !pointerQuery) return undefined;
    const onMotion = (e) => setOsReduced(e.matches);
    const onPointer = (e) => setFinePointer(e.matches);
    motionQuery.addEventListener("change", onMotion);
    pointerQuery.addEventListener("change", onPointer);
    return () => {
      motionQuery.removeEventListener("change", onMotion);
      pointerQuery.removeEventListener("change", onPointer);
    };
  }, []);

  const reducedMotion = osReduced || userToggled || lowEndDevice();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-reduced-motion",
      reducedMotion ? "true" : "false",
    );
  }, [reducedMotion]);

  const setUserToggle = useCallback((value) => {
    setUserToggled(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    } catch {
      // localStorage unavailable (private browsing) — state still applies
    }
  }, []);

  const value = useMemo(
    () => ({ reducedMotion, userToggled, setUserToggle, finePointer }),
    [reducedMotion, userToggled, setUserToggle, finePointer],
  );

  return (
    <MotionPrefsContext.Provider value={value}>
      {children}
    </MotionPrefsContext.Provider>
  );
}

export function useMotionPrefs() {
  return useContext(MotionPrefsContext);
}

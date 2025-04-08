import { createContext, useState } from "react";

interface ContextType {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalErrorContext = createContext<ContextType>({
  error: "",
  setError: () => {},
});

function GlobalErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState("");

  return (
    <GlobalErrorContext.Provider value={{ error, setError }}>
      {children}
    </GlobalErrorContext.Provider>
  );
}

export default GlobalErrorProvider;

export { GlobalErrorContext };

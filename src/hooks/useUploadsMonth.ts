import { createContext, useContext } from "react";

type UploadsMonth = { month: number; setMonth: (month: number) => void };

/** Which monthly run the Uploads charts and readout show. Provided by the Uploads section. */
export const UploadsMonthContext = createContext<UploadsMonth>({ month: 0, setMonth: () => {} });

export const useUploadsMonth = () => useContext(UploadsMonthContext);

import { featureFlags } from "@src/config/featureFlags";
import { useReduxAuth } from "../redux/useAuth";
import { useZustandAuth } from "../zustand/useAuth";

export const useAuth = () => {
  const redux = useReduxAuth();
  const zustand = useZustandAuth();

  return featureFlags.useRedux ? redux : zustand;
};

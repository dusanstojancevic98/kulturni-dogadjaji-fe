import { featureFlags } from "@src/config/featureFlags";
import { store } from "@src/store/redux/store";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  if (featureFlags.useRedux) {
    return <ReduxProvider store={store}>{children}</ReduxProvider>;
  }

  return <>{children}</>;
};

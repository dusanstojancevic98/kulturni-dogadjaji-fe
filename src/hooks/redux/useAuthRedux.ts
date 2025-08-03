import { useAppDispatch } from "@src/hooks/redux/useAppDispatch";
import { useAppSelector } from "@src/hooks/redux/useAppSelector";
import { logout } from "@src/store/redux/slices/authSlice";

export const useAuthRedux = () => {
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();

  return {
    user,
    accessToken,
    logout: () => dispatch(logout()),
  };
};

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/redux/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

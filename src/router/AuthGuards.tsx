import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useGetProfileQuery } from "../api/baseApi";
import type { RootState } from "../store/store";

export function RequireAuth() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isAuthenticated,
  });

  return isAuthenticated ? <Outlet /> : <Navigate replace to="/auth" />;
}

export function RequireGuest() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return isAuthenticated ? <Navigate replace to="/home" /> : <Outlet />;
}

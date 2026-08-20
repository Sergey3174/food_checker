import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { readStoredAuthorization } from "../store/authSlice";

const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "/api";
const apiClient = axios.create({ baseURL: baseUrl });

type AxiosBaseQueryArgs = {
  data?: unknown;
  headers?: AxiosRequestConfig["headers"];
  method: AxiosRequestConfig["method"];
  params?: unknown;
  url: string;
};

type AxiosBaseQueryError = {
  data: unknown;
  status: number | string;
};

type AxiosBaseQueryMeta = {
  response?: AxiosResponse;
};

const axiosBaseQuery =
  (): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    AxiosBaseQueryError,
    AxiosBaseQueryMeta
  > =>
  async ({ url, method, data, headers, params }) => {
    try {
      const authorization = readStoredAuthorization();
      const result = await apiClient({
        data,
        headers: {
          ...(authorization ? { Authorization: authorization } : {}),
          ...headers,
        },
        method,
        params,
        url,
      });
      return { data: result.data, meta: { response: result } };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: {
            data: error.response?.data ?? error.message,
            status: error.response?.status ?? "FETCH_ERROR",
          },
        };
      }

      return { error: { data: "Неизвестная ошибка", status: "FETCH_ERROR" } };
    }
  };

export type AuthRequest = {
  login: string;
  password: string;
};

type AuthorizationResponse = {
  authorization: string | null;
};

const getResponseHeader = (meta: unknown, headerName: string) => {
  const headers = (meta as AxiosBaseQueryMeta | undefined)?.response
    ?.headers as
    | {
        [key: string]: unknown;
        get?: (headerName: string) => unknown;
      }
    | undefined;
  const headerValue =
    typeof headers?.get === "function"
      ? headers.get(headerName)
      : headers?.[headerName];
  return typeof headerValue === "string" ? headerValue : null;
};

const getAuthorizationHeader = (meta: unknown) =>
  getResponseHeader(meta, "authorization");

export const getApiErrorMessage = (error: unknown) => {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return null;
  }

  const { data } = error as { data: unknown };
  if (typeof data === "string") return data;

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return null;
};

export type ConfirmLoginRequest = {
  code?: string;
  login: string;
  recovery: boolean;
};

type ConfirmLoginResponse = {
  data: {
    hash: string;
  };
  message: string;
};

type GptSessionResponse = {
  sessionId: string | null;
};

export type CheckFoodRequest = {
  image: Blob;
  sessionId: string;
};

export type CreateUserRequest = {
  hash: string;
  login: string;
  password: string;
};

export type ProfileResponse = {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  weight: string | null;
  growth: string | null;
  diabetic_type: string | null;
  isf: string | null;
  cir: string | null;
  glucose_unit: string;
  date_of_diagnostic: string | null;
  email: string;
  phone: string | null;
  tg_username: string | null;
  identity: string;
  sub_data: {
    tg_notif: { status: boolean; can_change: boolean };
    ws_notif: { status: boolean; can_change: boolean };
    push_notif: { status: boolean; can_change: boolean };
    lang: string;
  };
};

export type FoodHistoryIngredient = {
  name: string;
  calories: string;
  proteins: string;
  proteins_percent: string;
  fats: string;
  fats_percent: string;
  carbohydrates: string;
  carbohydrates_percent: string;
  sugars: string;
  bread_units: string;
  total_weight: string;
  glycemic_index: string;
  protein_bje: string;
  fats_bje: string;
  calories_bje: string;
  bje_units: string;
};

export type FoodHistoryItem = FoodHistoryIngredient & {
  history_id: string;
  dish_name: string;
  path_to_photo: string | null;
  ingredients: FoodHistoryIngredient[] | null;
  recorded: boolean;
  datetime: string;
};

export type GetHistoryResponse = {
  data: FoodHistoryItem[];
};

export const baseApi = createApi({
  baseQuery: axiosBaseQuery(),
  tagTypes: ["History", "Profile"],
  endpoints: (builder) => ({
    getHistory: builder.query<GetHistoryResponse, void>({
      query: () => ({ method: "GET", url: "api/v3/get_history" }),
      providesTags: ["History"],
    }),
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({ method: "GET", url: "api/v3/profile" }),
      providesTags: ["Profile"],
    }),
    createGptSession: builder.mutation<GptSessionResponse, void>({
      query: () => ({ method: "GET", url: "api/v3/gpt/session" }),
      transformResponse: (_response, meta) => ({
        sessionId: getResponseHeader(meta, "session-id"),
      }),
    }),
    checkFood: builder.mutation<unknown, CheckFoodRequest>({
      query: ({ image, sessionId }) => {
        const data = new FormData();
        data.append("image", image, "food.jpg");

        return {
          data,
          method: "POST",
          params: { session_id: sessionId },
          url: "api/v3/gpt/check_food",
        };
      },
    }),
    authenticate: builder.mutation<AuthorizationResponse, AuthRequest>({
      query: (body) => ({
        data: body,
        method: "POST",
        url: "api/v3/auth",
      }),
      transformResponse: (_response, meta) => ({
        authorization: getAuthorizationHeader(meta),
      }),
    }),
    confirmLogin: builder.mutation<ConfirmLoginResponse, ConfirmLoginRequest>({
      query: ({ code, recovery, ...body }) => ({
        data: body,
        params: {
          ...(code ? { code } : {}),
          recovery: String(recovery),
        },
        method: "POST",
        url: "api/v3/confirm_login",
      }),
    }),
    createUser: builder.mutation<AuthorizationResponse, CreateUserRequest>({
      query: ({ hash, ...body }) => ({
        data: body,
        method: "POST",
        params: { hash },
        url: "api/v3/create_user",
      }),
      transformResponse: (_response, meta) => ({
        authorization: getAuthorizationHeader(meta),
      }),
    }),
    recoverPassword: builder.mutation<void, CreateUserRequest>({
      query: ({ hash, ...body }) => ({
        data: body,
        method: "POST",
        params: { hash },
        url: "api/v3/password_recovery",
      }),
    }),
  }),
  reducerPath: "api",
});

export const {
  useAuthenticateMutation,
  useConfirmLoginMutation,
  useCreateUserMutation,
  useCreateGptSessionMutation,
  useCheckFoodMutation,
  useGetHistoryQuery,
  useGetProfileQuery,
  useRecoverPasswordMutation,
} = baseApi;

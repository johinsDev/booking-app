import { AxiosRequestConfig } from 'axios'
import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query'
import { api } from './api'

export default function useApi<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>({
  key,

  url,

  config,

  options,
}: {
  key?: TQueryKey

  url?: string

  config?: AxiosRequestConfig

  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
}): UseQueryResult<TData, TError> {
  return useQuery<TQueryFnData, TError, TData, TQueryKey>(
    key || (url as TQueryKey),

    async () => api.get(url || '', config).then((r) => r.data),

    {
      staleTime: 60 * 1000 * 5,

      retry: false,

      enabled: !!url,

      ...(options ?? {}),
    }
  )
}

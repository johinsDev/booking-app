import '@assets/styles/main.css'
import { api } from '@lib/api'
import type { AppProps } from 'next/app'
import {
  QueryClient,
  QueryClientProvider,
  QueryFunctionContext,
  QueryKey,
} from 'react-query'

const defaultQueryFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const { data } = await api.get(`${queryKey[0]}`)

  return data
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="h-full">
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  )
}
export default MyApp

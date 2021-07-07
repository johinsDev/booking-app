import useApi from '@lib/useApi'

interface Service {
  createdAt: Date
  duration: number
  id: number
  name: string
  updatedAt: Date
}

const SERVICES_KEYS = {
  all: ['services'],
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useService() {
  return useApi<Service[]>({
    url: 'service',
    key: SERVICES_KEYS.all,
  })
}

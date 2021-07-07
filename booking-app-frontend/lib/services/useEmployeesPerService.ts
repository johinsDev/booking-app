import useApi from '@lib/useApi'

interface Employee {
  createdAt: Date
  id: number
  name: string
  updatedAt?: Date
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useEmployeesPerService(serviceId: string) {
  return useApi<Employee[]>({
    url: `service/${serviceId}/employees`,
    key: ['services', serviceId, 'employees'],
    options: {
      enabled: !!serviceId,
    },
  })
}

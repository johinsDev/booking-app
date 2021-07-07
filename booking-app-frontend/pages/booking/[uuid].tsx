import { api } from '@lib/api'
import useApi from '@lib/useApi'
import cn from 'classnames'
import { DateTime } from 'luxon'
import { useRouter } from 'next/dist/client/router'
import { FC } from 'react'
import { useMutation } from 'react-query'

export interface Service {
  id: number
  name: string
  duration: number
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: number
  uuid: string
  token: string
  date: string
  startTime: string
  endTime: string
  employeeId: number
  serviceId: number
  clientEmail: string
  clientName: string
  createdAt: Date
  updatedAt: Date
  cancelledAt?: Date
  service: Service
  employee: Employee
}

const ShowBooking: FC = () => {
  const router = useRouter()

  const { mutate, isLoading } = useMutation(
    async () =>
      api.patch(`booking/${router.query.uuid}?token=${router.query.token}`),
    {
      onSuccess: () => router.replace('/booking/create'),
    }
  )

  const { data } = useApi<Appointment>({
    url: `booking/${router.query.uuid}?token=${router.query.token}`,
    options: {
      enabled: !!router.query.uuid,
      onError: () => router.replace('/booking/create'),
    },
  })

  return (
    <section className="bg-gray-100 max-w-sm mx-auto m-6 p-5 rounded-lg">
      <div className="mb-6">
        <div className="text-gray-700 font-bold mb-2">
          {data?.clientName}, thanks for your booking.
        </div>

        <div className="border-t border-b border-gray-200 py-2">
          <div className="font-semibold">
            {data?.service.name} ({data?.service.duration} minutes) with{' '}
            {data?.employee.name}
          </div>

          <div className="text-gray-700">
            on {data?.date && DateTime.fromISO(data?.date).toFormat('EEE')} at{' '}
            {data?.startTime &&
              DateTime.fromISO(data?.startTime).toFormat('h:mm a')}
          </div>
        </div>
      </div>

      {!data?.cancelledAt && (
        <button
          className={cn(
            'bg-pink-500 text-white h-11 px-4 text-center font-bold rounded-lg w-full',
            {
              'opacity-75': isLoading,
            }
          )}
          type="button"
          disabled={isLoading}
          onClick={() => {
            if (window.confirm('Are you sure?')) {
              mutate()
            }
          }}
        >
          Cancel booking
        </button>
      )}

      {!!data?.cancelledAt && <p>Your booking has been cancelled</p>}
    </section>
  )
}

export default ShowBooking

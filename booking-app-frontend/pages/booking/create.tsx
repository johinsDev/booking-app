import { api } from '@lib/api'
import useEmployeesPerService from '@lib/services/useEmployeesPerService'
import useService from '@lib/services/useServices'
import useApi from '@lib/useApi'
import cn from 'classnames'
import { DateTime } from 'luxon'
import { useRouter } from 'next/dist/client/router'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'

interface Values {
  schedule: Date
  serviceId: string
  employeeId: string
  date: string
  name: string
  email: string
}

function getCalendarWeekInterval(initDate?: DateTime) {
  let now = initDate || DateTime.now()

  const later = now.plus({
    week: 1,
  })

  const interval = [now]

  while (now < later) {
    now = now.plus({
      day: 1,
    })

    interval.push(now)
  }

  return interval
}

const CreateBooking: FC = () => {
  const [calendarSelected, setCalendarSelected] = useState(DateTime.now())

  const { push } = useRouter()

  const { data: services } = useService()

  const mutation = useMutation(async (values: Values) => {
    const { data } = await api.post<{
      token: string
      uuid: string
    }>('booking', values)

    push({
      pathname: '/booking/' + data.uuid,
      search: `token=${data.token}`,
    })
  })

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      schedule: DateTime.now().toISODate(),
      serviceId: '',
      employeeId: '',
      date: '',
      name: '',
      email: '',
    },
  })

  const serviceId = watch('serviceId')

  const service = services?.find((s) => s.id.toString() === serviceId)

  const employeeId = watch('employeeId')

  const date = watch('schedule')

  const time = watch('date')

  const dateSelected = !!serviceId && !!employeeId && !!date

  const hasDetailToBooking = dateSelected && !!time

  const serviceAndEmployeeSelected = !serviceId || !employeeId

  const { data: slots } = useApi<string[]>({
    url: `employee/${employeeId}/available-slots?serviceId=${serviceId}&date=${date}`,
    options: {
      enabled: dateSelected,
      staleTime: 1000,
    },
  })

  const { data: employees } = useEmployeesPerService(serviceId)

  const employee = employees?.find((e) => e.id.toString() === employeeId)

  const onSubmit = (data: Values) => mutation.mutate(data)

  function incrementCalendarWeek() {
    setCalendarSelected(
      calendarSelected.plus({
        week: 1,
        day: 1,
      })
    )
  }

  function decrementCalendarWeek() {
    setCalendarSelected(
      calendarSelected.minus({
        week: 1,
        day: 1,
      })
    )
  }

  return (
    <section className="bg-gray-100 max-w-sm mx-auto m-6 p-5 rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label
            htmlFor="service"
            className="inline-block text-gray-700 font-bold mb-2"
          >
            Select service
          </label>
          <select
            id="service"
            className="bg-white h-10 w-full border-none rounded-lg"
            {...register('serviceId', { required: true })}
          >
            <option value="">Select a service</option>
            {services?.map((service) => {
              return (
                <option value={service.id} key={service.id}>
                  {service.name} ({service.duration} minutes)
                </option>
              )
            })}
          </select>
        </div>

        <div
          className={cn('mb-6', {
            'opacity-25': !employees?.length,
          })}
        >
          <label
            htmlFor="employee"
            className="inline-block text-gray-700 font-bold mb-2"
          >
            Select employee
          </label>
          <select
            id="employee"
            className="bg-white h-10 w-full border-none rounded-lg"
            {...register('employeeId', { required: true })}
            disabled={!employees?.length}
          >
            <option value="">Select a employee</option>
            {employees?.map((employee) => {
              return (
                <option value={employee.id} key={employee.id}>
                  {employee.name}
                </option>
              )
            })}
          </select>
        </div>

        <div
          className={cn('mb-6', {
            'opacity-25': serviceAndEmployeeSelected,
          })}
        >
          <label
            htmlFor=""
            className="inline-block text-gray-700 font-bold mb-2"
          >
            Select appointment time
          </label>

          <div className="bg-white rounded-lg">
            <div className="flex items-center justify-center relative">
              {calendarSelected > DateTime.now() && (
                <button
                  type="button"
                  className="p-4 absolute left-0 top-0"
                  onClick={decrementCalendarWeek}
                  disabled={serviceAndEmployeeSelected}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-300 hover:text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              <div className="text-lg font-semibold p-4">
                {calendarSelected.toFormat('LLL yyyy')}
              </div>

              <button
                type="button"
                className="p-4 absolute right-0 top-0"
                onClick={incrementCalendarWeek}
                disabled={serviceAndEmployeeSelected}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-300 hover:text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-between items-center px-3 border-b border-gray-200 pb-2">
              {getCalendarWeekInterval(calendarSelected).map((day, index) => {
                return (
                  <div key={index}>
                    <input
                      type="radio"
                      id={`date-${day.toISODate()}}`}
                      value={day.toISODate()}
                      className="sr-only"
                      {...register('schedule', { required: true })}
                    />
                    <label
                      htmlFor={`date-${day.toISODate()}}`}
                      className="text-center cursor-pointer focus:outline-none group"
                    >
                      <div className="text-xs leading-none mb-2 text-gray-700">
                        {day.toFormat('EEE')}
                      </div>
                      <div
                        className={cn(
                          'text-lg leading-none p-1 rounded-full w-9 h-9 group-hover:bg-gray-200 flex items-center justify-center',
                          {
                            'bg-gray-200': day.toISODate() === date,
                          }
                        )}
                      >
                        {day.toFormat('d')}
                      </div>
                    </label>
                  </div>
                )
              })}
            </div>

            <div className="h-52 overflow-y-scroll">
              {slots?.map((slot) => (
                <div key={slot}>
                  <input
                    type="radio"
                    id={`time_${slot}`}
                    className="sr-only"
                    value={slot}
                    {...register('date', { required: true })}
                  />

                  <label
                    htmlFor={`time_${slot}`}
                    className="w-full text-left focus:outline-none px-4 py-2 flex items-center cursor-pointer border-b border-gray-100 "
                  >
                    {time === slot && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {DateTime.fromISO(slot).toFormat('h:mm a')}
                  </label>
                </div>
              ))}

              {!slots?.length && (
                <div className="text-center text-gray-700 px-4 py-2">
                  No available slots
                </div>
              )}
            </div>
          </div>
        </div>

        {hasDetailToBooking && (
          <div>
            <div className="mb-6">
              <div className="text-gray-700 font-bold mb-2">
                You are ready to book
              </div>

              <div className="border-t border-b border-gray-300 py-2">
                {service?.name} ({service?.duration} minutes) with{' '}
                {employee?.name} on {DateTime.fromISO(date).toFormat('EEE')} at{' '}
                {DateTime.fromISO(time).toFormat('h:mm a')}
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="inline-block text-gray-700 font-bold mb-2"
                >
                  Your name
                </label>

                <input
                  type="text"
                  className="bg-white h-10 w-full border-none rounded-lg px-4"
                  id="name"
                  {...register('name', { required: true })}
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="inline-block text-gray-700 font-bold mb-2"
                >
                  Your email
                </label>

                <input
                  type="text"
                  className="bg-white h-10 w-full border-none rounded-lg px-4"
                  id="email"
                  {...register('email', { required: true })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isLoading}
              className={cn(
                'bg-indigo-500 text-white h-11 px-4 text-center font-bold rounded-lg w-full',
                {
                  'opacity-50': mutation.isLoading,
                }
              )}
            >
              Book now
            </button>
          </div>
        )}
      </form>
    </section>
  )
}

export default CreateBooking

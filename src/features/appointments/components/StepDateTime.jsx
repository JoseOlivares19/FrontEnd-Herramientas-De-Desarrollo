import { useState, useMemo } from 'react'
import { veterinarians, getAppointmentsByVetAndDate } from '../data'

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function computeAvailableSlots(vetId, date) {
  const vet = veterinarians.find((v) => v.id === vetId)
  if (!vet) return []
  const dateObj = new Date(date + 'T00:00:00')
  const dayOfWeek = DAY_NAMES[dateObj.getDay()]
  const allSlots = vet.schedule[dayOfWeek] || []
  const booked = getAppointmentsByVetAndDate(vetId, date)
  const bookedTimes = booked.map((a) => a.time)
  return allSlots.filter((slot) => !bookedTimes.includes(slot))
}

export default function StepDateTime({ selectedVetId, selectedDate, selectedTime, onSelectDate, onSelectTime }) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()

  const availableSlots = useMemo(() => {
    if (selectedDate && selectedVetId) {
      return computeAvailableSlots(selectedVetId, selectedDate)
    }
    return []
  }, [selectedDate, selectedVetId])

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  const isPast = (day) => {
    const d = new Date(currentYear, currentMonth, day)
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return d < t
  }

  const isWeekend = (day) => {
    const d = new Date(currentYear, currentMonth, day)
    return d.getDay() === 0 || d.getDay() === 6
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleDayClick = (day) => {
    if (isPast(day) || isWeekend(day)) return
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onSelectDate(dateStr)
    onSelectTime(null)
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ]

  return (
    <div className="step-content">
      <h3 className="step-title">Seleccione fecha y hora</h3>
      <p className="step-description">Elija un dia y horario disponible</p>

      <div className="datetime-container">
        <div className="calendar">
          <div className="calendar-header">
            <button className="cal-nav" onClick={handlePrevMonth}>&#8249;</button>
            <span className="cal-month">{monthNames[currentMonth]} {currentYear}</span>
            <button className="cal-nav" onClick={handleNextMonth}>&#8250;</button>
          </div>
          <div className="calendar-days-header">
            {DAY_LABELS.map((d) => (
              <span key={d} className="cal-day-label">{d}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`empty-${i}`} className="cal-day empty" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isSelected = selectedDate === dateStr
              const disabled = isPast(day) || isWeekend(day)
              return (
                <button
                  key={day}
                  className={`cal-day ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${isToday(day) ? 'today' : ''}`}
                  onClick={() => handleDayClick(day)}
                  disabled={disabled}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="time-slots">
            <h4 className="time-slots-title">Horarios disponibles</h4>
            {availableSlots.length === 0 ? (
              <p className="empty-state">No hay horarios disponibles para esta fecha</p>
            ) : (
              <div className="slots-grid">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`slot-btn ${selectedTime === slot ? 'selected' : ''}`}
                    onClick={() => onSelectTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

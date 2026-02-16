export function addInterval(date: Date, frequency: string): Date {
  const d = new Date(date)
  if (frequency === "weekly") d.setDate(d.getDate() + 7)
  else if (frequency === "biweekly") d.setDate(d.getDate() + 14)
  else if (frequency === "monthly") d.setMonth(d.getMonth() + 1)
  return d
}

/**
 * For a recurring event, returns the next future occurrence date.
 * For non-recurring or fully-past events, returns the original date.
 */
export function getNextOccurrence(event: {
  event_date: string
  recurrence_frequency?: string | null
  recurrence_end?: string | null
}): Date {
  const original = new Date(event.event_date)
  if (!event.recurrence_frequency) return original

  const now = new Date()
  const recEnd = event.recurrence_end
    ? new Date(event.recurrence_end + (event.recurrence_end.includes("T") ? "" : "T23:59:59"))
    : null

  let current = new Date(original)

  // Fast-forward to the next future occurrence
  let safety = 0
  while (current < now && safety < 500) {
    const next = addInterval(current, event.recurrence_frequency)
    if (recEnd && next > recEnd) break
    current = next
    safety++
  }

  return current
}

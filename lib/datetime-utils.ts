/**
 * Datetime utilities for consistent timezone handling
 *
 * Principles:
 * - All dates are stored in UTC in the database
 * - Users input dates in their local timezone (datetime-local)
 * - Dates are displayed in the user's local timezone
 * - UTC is shown alongside for reference
 */

/**
 * Converts a datetime-local input value to ISO 8601 UTC string for database storage
 * @param localDatetimeString - Value from datetime-local input (YYYY-MM-DDTHH:mm)
 * @returns ISO 8601 UTC string
 */
export function localDatetimeToUTC(localDatetimeString: string): string {
  if (!localDatetimeString) return ''

  // datetime-local gives us a string like "2024-03-15T20:00"
  // This represents local time, so we create a Date object which will be in local timezone
  const localDate = new Date(localDatetimeString)

  // toISOString() converts to UTC
  return localDate.toISOString()
}

/**
 * Converts an ISO 8601 UTC string to a datetime-local input value (user's local timezone)
 * @param isoString - ISO 8601 UTC string from database
 * @returns datetime-local format string (YYYY-MM-DDTHH:mm)
 */
export function utcToLocalDatetime(isoString: string): string {
  if (!isoString) return ''

  const date = new Date(isoString)

  // Get local time components
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Formats a date/time for display in the user's local timezone
 * @param isoString - ISO 8601 UTC string from database
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted string in user's local timezone
 */
export function formatLocalDateTime(
  isoString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!isoString) return ''

  const date = new Date(isoString)

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }

  return date.toLocaleString(undefined, defaultOptions)
}

/**
 * Formats a date for display in the user's local timezone (no time)
 * @param isoString - ISO 8601 UTC string from database
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatLocalDate(
  isoString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!isoString) return ''

  const date = new Date(isoString)

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }

  return date.toLocaleDateString(undefined, defaultOptions)
}

/**
 * Formats a time for display in the user's local timezone
 * @param isoString - ISO 8601 UTC string from database
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted time string
 */
export function formatLocalTime(
  isoString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!isoString) return ''

  const date = new Date(isoString)

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }

  return date.toLocaleTimeString(undefined, defaultOptions)
}

/**
 * Formats a time in UTC for reference
 * @param isoString - ISO 8601 UTC string from database
 * @returns Formatted UTC time string
 */
export function formatUTCTime(isoString: string): string {
  if (!isoString) return ''

  const date = new Date(isoString)

  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  })
}

/**
 * Gets the user's timezone (IANA timezone identifier)
 * @returns Timezone string (e.g., "America/New_York")
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Component helper: Display date and time with UTC reference
 */
export function formatDateTimeWithUTC(isoString: string): {
  local: string
  localTime: string
  utc: string
  userTimezone: string
} {
  const date = new Date(isoString)

  return {
    local: formatLocalDate(isoString),
    localTime: formatLocalTime(isoString),
    utc: formatUTCTime(isoString),
    userTimezone: getUserTimezone()
  }
}

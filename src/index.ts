import cronstrue from 'cronstrue'
import type { Options } from 'cronstrue/dist/options'
import { StringUtilities } from './stringUtilities'
import { zh_CN } from './locales/zh_CN'

// todo: 先这样兼容一下
// @ts-expect-error Jinrong
const Cronstrue = cronstrue.default ? cronstrue.default : cronstrue
class NewCronstrue extends Cronstrue {
  constructor(expression: string, options: Options) {
    super(expression, options)
  }

  static toString(
    expression: string,
    {
      throwExceptionOnParseError = true,
      verbose = false,
      dayOfWeekStartIndexZero = false,
      monthStartIndexZero = false,
      use24HourTimeFormat,
      locale = null,
    }: Options = {},
  ): string {
    const options = <Options>{
      throwExceptionOnParseError,
      verbose,
      dayOfWeekStartIndexZero,
      monthStartIndexZero,
      use24HourTimeFormat,
      locale,
    }

    const descripter = new NewCronstrue(expression, options)
    descripter.getFullDescription()
    return descripter.getNewFullDescription()
  }

  protected getNewFullDescription(): string {
    let description = ''
    const timeSegment = this.getTimeOfDayDescription()
    const dayOfMonthDesc = this.getDayOfMonthDescription()
    const monthDesc = this.getMonthDescription()
    const dayOfWeekDesc = this.getDayOfWeekDescription()
    const yearDesc = this.getYearDescription()
    // description +=
    //   yearDesc + monthDesc + dayOfWeekDesc + dayOfMonthDesc + timeSegment;
    description = [
      yearDesc,
      monthDesc,
      dayOfWeekDesc,
      dayOfMonthDesc,
      timeSegment,
    ]
      .filter(v => v)
      .join('的')
    description = this.transformVerbosity(description, !!this.options.verbose)

    if (description.startsWith('的'))
      description = description.slice(1)

    if (description.endsWith('的'))
      description = description.slice(-1)

    return description
  }

  protected getTimeOfDayDescription() {
    const secondsExpression: string = this.expressionParts[0]
    const minuteExpression: string = this.expressionParts[1]
    const hourExpression: string = this.expressionParts[2]

    let description = ''

    // handle special cases first
    if (
      !StringUtilities.containsAny(
        minuteExpression,
        NewCronstrue.specialCharacters,
      )
      && !StringUtilities.containsAny(
        hourExpression,
        NewCronstrue.specialCharacters,
      )
      && !StringUtilities.containsAny(
        secondsExpression,
        NewCronstrue.specialCharacters,
      )
    ) {
      // specific time of day (i.e. 10 14)
      description
        += this.i18n.atSpace()
        + this.formatTime(hourExpression, minuteExpression, secondsExpression)
    }
    else if (
      !secondsExpression
      && minuteExpression.includes('-')
      && !minuteExpression.includes(',')
      && !minuteExpression.includes('/')
      && !StringUtilities.containsAny(
        hourExpression,
        NewCronstrue.specialCharacters,
      )
    ) {
      // minute range in single hour (i.e. 0-10 11)
      const minuteParts: string[] = minuteExpression.split('-')
      description += StringUtilities.format(
        this.i18n.everyMinuteBetweenX0AndX1(),
        this.formatTime(hourExpression, minuteParts[0], ''),
        this.formatTime(hourExpression, minuteParts[1], ''),
      )
    }
    else if (
      !secondsExpression
      && hourExpression.includes(',')
      && !hourExpression.includes('-')
      && !hourExpression.includes('/')
      && !StringUtilities.containsAny(
        minuteExpression,
        NewCronstrue.specialCharacters,
      )
    ) {
      // hours list with single minute (i.e. 30 6,14,16)
      const hourParts: string[] = hourExpression.split(',')
      description += this.i18n.at()

      for (let i = 0; i < hourParts.length; i++) {
        description += ' '
        description += this.formatTime(hourParts[i], minuteExpression, '')

        if (i < hourParts.length - 2)
          description += ','

        if (i == hourParts.length - 2)
          description += this.i18n.spaceAnd()
      }
    }
    else if (
      (secondsExpression.includes(',')
        || minuteExpression.includes(',')
        || hourExpression.includes(','))
      && !StringUtilities.containsAny(secondsExpression, ['/', '-', '*'])
      && !StringUtilities.containsAny(minuteExpression, ['/', '-', '*'])
      && !StringUtilities.containsAny(hourExpression, ['/', '-', '*'])
    ) {
      // 先不关心 *
      const secondArr = secondsExpression.split(',').filter(v => v)
      const minuteArr = minuteExpression.split(',').filter(v => v)
      const hourArr = hourExpression.split(',').filter(v => v)
      const dateArr = []
      // todo: 如何提z
      for (let x = 0; x < hourArr.length; x++) {
        if (minuteArr.length > 0) {
          for (let y = 0; y < minuteArr.length; y++) {
            if (secondArr.length > 0) {
              for (let z = 0; z < secondArr.length; z++)
                dateArr.push([hourArr[x], minuteArr[y], secondArr[z]])
            }
            else {
              dateArr.push([hourArr[x], minuteArr[y], ''])
            }
          }
        }
        else {
          dateArr.push([hourArr[x], '', ''])
        }
      }
      description += this.i18n.at()

      for (let i = 0; i < dateArr.length; i++) {
        description += ' '
        description += this.formatTime(
          dateArr[i][0],
          dateArr[i][1],
          dateArr[i][2],
        )

        if (i < dateArr.length - 2)
          description += ','

        if (i == dateArr.length - 2)
          description += this.i18n.spaceAnd()
      }
    }
    else {
      // default time description
      const secondsDescription = this.getSecondsDescription()
      const minutesDescription = this.getMinutesDescription()
      const hoursDescription = this.getHoursDescription()
      // description += secondsDescription;

      // if (description && minutesDescription) {
      //   description += ", ";
      // }

      // description += minutesDescription;

      // if (minutesDescription === hoursDescription) {
      //   return description;
      // }

      // if (description && hoursDescription) {
      //   description += ", ";
      // }

      // description += hoursDescription;
      if (minutesDescription === hoursDescription) {
        description += [minutesDescription, secondsDescription]
          .filter(v => v)
          .join(', ')
      }
      else {
        description += [
          hoursDescription,
          minutesDescription,
          secondsDescription,
        ]
          .filter(v => v)
          .join(', ')
      }

      // console.log(
      //   "hoursDescription",
      //   // description,
      //   hoursDescription,
      //   minutesDescription,
      //   secondsDescription
      // );
    }

    return description
  }

  protected formatTime(
    hourExpression: string,
    minuteExpression: string,
    secondExpression: string,
  ) {
    let hour: number = parseInt(hourExpression)
    let period = ''
    let setPeriodBeforeTime = false
    if (!this.options.use24HourTimeFormat) {
      setPeriodBeforeTime = !!(
        this.i18n.setPeriodBeforeTime && this.i18n.setPeriodBeforeTime()
      )
      period = setPeriodBeforeTime
        ? `${this.getNewPeriod(hour)} `
        : ` ${this.getNewPeriod(hour)}`
      if (hour > 12)
        hour -= 12

      if (hour === 0) {
        // hour = 12;
      }
    }

    const minute = minuteExpression
    let second = ''
    if (secondExpression)
      second = `:${`00${secondExpression}`.substring(secondExpression.length)}`

    return `${
      setPeriodBeforeTime ? period : ''
    }${`00${hour.toString()}`.substring(
      hour.toString().length,
    )}:${`00${minute.toString()}`.substring(
      minute.toString().length,
    )}${second}${!setPeriodBeforeTime ? period : ''}`
  }

  getNewPeriod(hour: number): string {
    return hour > 12
      ? (this.i18n.pm && this.i18n.pm()) || 'PM'
      : (this.i18n.am && this.i18n.am()) || 'AM'
  }

  protected transformVerbosity(description: string, useVerboseFormat: boolean) {
    if (!useVerboseFormat) {
      description = description.replace(
        new RegExp(`${this.i18n.everyMinute()}, `, 'g'),
        '',
      )
      description = description.replace(
        new RegExp(`${this.i18n.everyHour()}, `, 'g'),
        '',
      )
      description = description.replace(
        new RegExp(this.i18n.commaEveryDay(), 'g'),
        '',
      )
      description = description.replace(/\, ?$/, '')
    }
    return description
  }
}
NewCronstrue.locales.zh_CN = new zh_CN()
export function cron2chinese(cron: string) {
  let s = NewCronstrue.toString(cron, { locale: 'zh_CN' })
  // 去掉多余的
  s = s.replace(/的的/, '的')
  return s
}

export default cron2chinese

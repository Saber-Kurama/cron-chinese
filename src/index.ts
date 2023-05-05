import cronstrue from 'cronstrue'
import type { Options } from 'cronstrue/dist/options'
import { StringUtilities } from './stringUtilities'
import { zh_CN } from './locales/zh_CN'

// eslint-disabled-next-line
cronstrue.locales.zh_CN = new zh_CN()
class NewCronstrue extends cronstrue {
  constructor(expression: string, options: Options) {
    super(expression, options)
  }

  static toString(
    expression: string,
    {
      throwExceptionOnParseError = true,
      verbose = false,
      dayOfWeekStartIndexZero = true,
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
      && !(minuteExpression.includes(','))
      && !(minuteExpression.includes('/'))
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
      //   description,
      //   hoursDescription,
      //   minutesDescription,
      //   secondsDescription
      // );
    }

    return description
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
export function cron2chinese(cron: string) {
  const s = NewCronstrue.toString(cron, { locale: 'zh_CN' })
  return s
}

export default cron2chinese

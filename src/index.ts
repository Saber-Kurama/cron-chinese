import cronstrue from 'cronstrue'
import type { Options } from 'cronstrue/dist/options'

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

  protected getFullDescription() {
    return super.getFullDescription()
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
}
export function cron2chinese(cron: string) {
  const s = NewCronstrue.toString(cron, { locale: 'zh_CN' })
  return s
}

export default cron2chinese

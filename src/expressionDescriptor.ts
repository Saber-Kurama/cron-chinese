import { CronParser } from './cronParser'
import { StringUtilities } from './stringUtilities'

export class ExpressionDescriptor {
  expression: string
  expressionParts: string[]
  constructor(expression: string) {
    this.expression = expression
    this.expressionParts = new Array(7)
  }

  static toString(expression: string): string {
    const descripter = new ExpressionDescriptor(expression)
    descripter.getFullDescription()
    return 'saber'
  }

  protected getFullDescription() {
    const description = ''
    try {
      const parser = new CronParser(this.expression)
      this.expressionParts = parser.parse()
      const yearDesc = this.getYearDescription()
    }
    catch (error) {}
  }

  protected getSegmentDescription(
    expression: string,
    allDescription: string,
    getSingleItemDescription: (t: string, form?: number) => string,
    getIncrementDescriptionFormat: (t: string) => string,
    getRangeDescriptionFormat: (t: string) => string,
    getDescriptionFormat: (t: string) => string,
  ) {
    let description: string | null = null
    // 判断是不是 增量
    const doesExpressionContainIncrement = expression.includes('/')
    const doesExpressionContainRange = expression.includes('-')
    const doesExpressionContainMultipleValues = expression.includes(',')
    if (!expression) {
      // Empty
      description = ''
    }
    else if (expression === '*') {
      // * (All)
      description = allDescription
    }
    if (
      !doesExpressionContainIncrement
      && !doesExpressionContainRange
      && !doesExpressionContainMultipleValues
    ) {
      // Simple
      description = StringUtilities.format(
        getDescriptionFormat(expression),
        getSingleItemDescription(expression),
      )
    }
    else if (doesExpressionContainMultipleValues) {
      // Multiple Values

      const segments: string[] = expression.split(',')
      let descriptionContent = ''
      for (let i = 0; i < segments.length; i++) {
        if (i > 0 && segments.length > 2) {
          descriptionContent += ','

          if (i < segments.length - 1)
            descriptionContent += ' '
        }

        if (
          i > 0
          && segments.length > 1
          && (i == segments.length - 1 || segments.length == 2)
        )
          descriptionContent += `${this.i18n.spaceAnd()} `

        if (segments[i].includes('/') || segments[i].includes('-')) {
          // Multiple Values with Increment or Range

          const isSegmentRangeWithoutIncrement
            = segments[i].includes('-') && !segments[i].includes('/')

          let currentDescriptionContent = this.getSegmentDescription(
            segments[i],
            allDescription,
            getSingleItemDescription,
            getIncrementDescriptionFormat,
            isSegmentRangeWithoutIncrement
              ? this.i18n.commaX0ThroughX1
              : getRangeDescriptionFormat,
            getDescriptionFormat,
          )

          if (isSegmentRangeWithoutIncrement) {
            currentDescriptionContent = currentDescriptionContent!.replace(
              ', ',
              '',
            )
          }

          descriptionContent += currentDescriptionContent
        }
        else if (!doesExpressionContainIncrement) {
          descriptionContent += getSingleItemDescription(segments[i])
        }
        else {
          descriptionContent += this.getSegmentDescription(
            segments[i],
            allDescription,
            getSingleItemDescription,
            getIncrementDescriptionFormat,
            getRangeDescriptionFormat,
            getDescriptionFormat,
          )
        }
      }

      if (!doesExpressionContainIncrement) {
        description = StringUtilities.format(
          getDescriptionFormat(expression),
          descriptionContent,
        )
      }
      else {
        description = descriptionContent
      }
    }
  }

  protected getYearDescription() {
    const description: string | null = this.getSegmentDescription(
      this.expressionParts[6],
      '',
      (s) => {
        return /^\d+$/.test(s)
          ? new Date(parseInt(s), 1).getFullYear().toString()
          : s
      },
      (s) => {
        return StringUtilities.format(this.i18n.commaEveryX0Years(s), s)
      },
      (s) => {
        return (
          this.i18n.commaYearX0ThroughYearX1() || this.i18n.commaX0ThroughX1()
        )
      },
      (s) => {
        return this.i18n.commaOnlyInYearX0
          ? this.i18n.commaOnlyInYearX0()
          : this.i18n.commaOnlyInX0()
      },
    )

    return description
  }
}

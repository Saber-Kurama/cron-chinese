interface CompiledI {
  raw: string
  isAny: boolean // 是否是任意值
  hasStepping: boolean // 是否是step
  hasList: boolean // 是否是数组，？ 只有一个值呢
  hasRange: boolean // 是否是范围
  values: (number | string)[]
}

function compileNode(raw: string, type?: string) {
  const values = raw.split(',')
  const isAny = raw === '*'
  const hasStepping = raw.includes('/')
  const hasRange = raw.includes('-')
  const hasList = raw.includes(',')
  return {
    raw,
    isAny,
    hasStepping,
    hasRange,
    hasList,
    values,
  }
}

function getDateText(data: any) {}

export function cron2chinese(cron: string) {
  const tokens = cron.trim().split(' ')
  // todo 是否正确呢
  if (tokens.length !== 5 && tokens.length !== 6 && tokens.length !== 7) {
    console.error('请检查一下cron表达式是否正确')
    return ''
  }
  // todo 校验cron 表达式的错误
  // 1. 只能有 /

  // rust 风格
  const cronStruct = {
    time: {
      second: compileNode(tokens[0]),
    },
    date: {
      year: compileNode(tokens[6] || '*'),
    },
  }
}

export default cron2chinese

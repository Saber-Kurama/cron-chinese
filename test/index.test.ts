import { describe, expect, it } from 'vitest'
import { cron2chinese } from '../src/index'

// import cronstrue from "../src/cronstrue";

// describe("测试基本", () => {
//   it("exported", () => {
//     cron2chinese("0 0 0 * * ? *");
//     expect(1).toEqual(1);
//   });
//   it("exported11", () => {
//     expect(1).toEqual(1);
//   });
// });
const examples = [
  {
    expression: '*/5 * * * * ?',
    text: '每隔 5 秒',
  },
  {
    expression: '0 */1 * * * ?',
    text: '每分钟',
  },
  {
    expression: '0 0 2 1 * ? *',
    text: '每月 1 号的上午 02:00',
  },
  {
    expression: '0 15 10 ? * MON-FRI',
    text: '星期一至星期五的上午 10:15',
  },
  {
    expression: '0 15 10 ? * 6L 2002-2006',
    text: '从2002年至2006年的每月的最后一个星期五的上午 10:15',
  },
  {
    expression: '0 0 23 * * ?',
    text: '下午 11:00',
  },
  {
    expression: '0 0 1 * * ?',
    text: '上午 01:00',
  },
  {
    expression: ' 0 0 1 1 * ?',
    text: '每月 1 号的上午 01:00',
  },
  {
    expression: '0 0 23 L * ?',
    text: '每月的最后一天的下午 11:00',
  },
  {
    expression: '0 0 23 L * ?',
    text: '每月的最后一天的下午 11:00',
  },
  {
    expression: '0 26,29,33 * * * ?',
    text: '在每小时的第 26, 29, 和 33 分钟',
  },
  {
    expression: '0 0 0,13,18,21 * * ?',
    text: '在 上午 00:00, 下午 01:00, 下午 06:00 和 下午 09:00',
  },
  {
    expression: '0 0/30 9-17 * * ?',
    text: '在 上午 09:00 和 下午 05:59 之间, 每隔 30 分钟',
  },
  {
    expression: '0 0 12 ? * WED',
    text: '星期三的上午 12:00',
  },
  {
    expression: '0 15 10 * * ? *',
    text: '上午 10:15',
  },
  {
    expression: '0 15 10 * * ? 2005',
    text: '2005 年的每天的上午 10:15',
  },
  {
    expression: '0 * 14 * * ?',
    text: '在 下午 02:00 和 下午 02:59 之间, 每分钟',
  },
  {
    expression: '0 0/5 14 * * ?',
    text: '在 下午 02:00 和 下午 02:59 之间, 每隔 5 分钟',
  },
  {
    expression: '0 0/5 14,18 * * ?',
    text: '在下午 02:00 和 下午 06:00, 每隔 5 分钟???',
    // 每天下午 2 点到 2:55 期间和下午 6 点到 6:55 期间的每 5 分钟触发
  },
  {
    expression: '0 0-5 14 * * ?',
    text: '在 下午 02:00 至 下午 02:05 之间的每分钟',
  },
  {
    expression: '0 10,44 14 ? 3 WED',
    text: '三月的星期三的下午 2:10 和 2:44 ',
  },
  {
    expression: '0 15 10 ? * MON-FRI',
    text: '星期一至星期五的上午 10:15',
  },
  {
    expression: '0 15 10 15 * ?',
    text: '每月 15 号的上午 10:15',
  },
  {
    expression: '0 15 10 L * ?',
    text: '每月的最后一天的上午 10:15',
  },
  {
    expression: '0 15 10 ? * 6L',
    text: '每月的最后一个星期五的上午 10:15',
  },
  {
    expression: '0 15 10 ? * 6L 2002-2005',
    text: '从2002年至2005年的每月的最后一个星期五的上午 10:15',
  },
  {
    expression: '0 15 10 ? * 6#3',
    text: '每月的第三个星期五的上午 10:15',
  },
  {
    expression: '0 0/5 14,18 * * ?',
    text: '在下午 02:00 和 下午 06:00, 每隔 5 分钟',
  },
]

describe('测试cronstrue', () => {
  for (let i = 0; i < examples.length; i++) {
    it(examples[i].expression, () => {
      const str = cron2chinese(examples[i].expression)
      expect(str).toEqual(examples[i].text)
    })
  }
  // it("exported2", () => {
  //   const a = cron2chinese("*/5 * * * * ?");
  //   console.log("111", a);
  //   expect(1).toEqual(1);
  // });
  // it("0 15 10 ? * MON-FRI", () => {
  //   const a = cron2chinese("0 15 10 ? * MON-FRI");
  //   console.log("111", a);
  //   expect(1).toEqual(1);
  // });
  // it("0 15 10 ? * 6L 2002-2005", () => {
  //   const a = cron2chinese("0 15 10 ? * 6L 2002-2005");
  //   console.log("111", a);
  //   expect(1).toEqual(1);
  // });
  // it("0 10,20,44 14 ? 3 WED", () => {
  //   const a = cron2chinese("0 10,20,44 14 ? 3 WED");
  //   console.log("111", a);
  //   expect(1).toEqual(1);
  // });
})

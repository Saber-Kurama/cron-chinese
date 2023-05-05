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
    text: '从2002年至2006年的每月的最后一个星期六的上午 10:15',
  },
  {
    expression: '0 0 23 * * ?',
    text: '下午 11:00',
  },
  {
    expression: '0 0/5 14,18 * * ?',
    text: '在下午 02:00 和 下午 06:00, 每隔 5 分钟',
  },
]

describe('测试cronstrue', () => {
  for (let i = 0; i < examples.length; i++) {
    it(examples[i].expression, () => {
      // cronstrue.toString("0 0 0 * * ? *");
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

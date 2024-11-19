const testArray = [
  {
    id: 1,
    name: "수학1",
    problems: [
      {
        //1번문제
        type: 0, // type 0 : 객관식 , type 1 : 단답식
        number: 1,
        content: "A = 10, B = 20, A+B = ?",
        selection: [
          { number: 1, answer: 30 },
          { number: 2, answer: 40 },
          { number: 3, answer: 10 },
          { number: 4, answer: 100 },
        ],
      },
      {
        //2번문제
        type: 0,
        number: 2,
        content: "A = 10, B = 20, A*B = ?",
        selection: [
          { number: 1, answer: 10 },
          { number: 2, answer: 200 },
          { number: 3, answer: 20 },
          { number: 4, answer: 100 },
        ],
      },
      {
        //3번문제
        type: 0,
        number: 3,
        content: "A = 10, B = 20, A-B = ?",
        selection: [
          { number: 1, answer: 0 },
          { number: 2, answer: 10 },
          { number: 3, answer: -10 },
          { number: 4, answer: 40 },
        ],
      },
    ],
  },

  //두번째 시험지
  {
    id: 2,
    name: "수학2",
    problems: [
      {
        //1번문제
        type: 0,
        number: 1,
        content: "A = 40, B = 2, A**B = ?",
        selection: [
          { number: 1, answer: 60 },
          { number: 2, answer: 80 },
          { number: 3, answer: 1600 },
          { number: 4, answer: 20 },
        ],
      },
      {
        //2번문제
        type: 1,
        number: 2,
        content: "A = 256, B = 1/2, A**B= ?",
      },
    ],
  },
];

export default testArray;

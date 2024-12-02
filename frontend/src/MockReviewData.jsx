import profile from "./assets/profile.png";

const reviewData = {
  solved_exam_id: 1,
  problems: [
    {
      solved_prob_id: 2,
      prob: "hello",
      solution: profile,
      response: 1,
      correctness: true,
    },
  ],
  comments: {
    type: "teacher",
    name: "김지웅",
    content:
      "현재 개념 이해는 잘 하고 있는 것으로 보입니다.\n다만 실수가 너무 많은 것 같습니다.\n평균적으로 한 문제에 쏟는 시간이 짧은데, 오히려 시간을 족므 더 쓰면서 신중하게 문제를 풀 필요가 있어보입니다.\n\n예를 들어 3번 문제에 30초 박에 사용을 안하셨는데 그러다보니 중간 계산식의 값을 도출하는 과정에서 실수를 하셨고 그러다 보니 푸는 방법이 모두 맞았음에도 최종 답안이 틀려서 점수를 잃는 사태가 발생했습니다. 조금 더 시간을 들여서 푸셔도 좋을 것 같습니다.",
  },
  score: 1,
  feedback: "굳",
  time: "00:47:35",
  exam: 1,
  student: 1,
  teacher: 1,
};

export default reviewData;

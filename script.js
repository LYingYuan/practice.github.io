let question = [];
let timer = null;
let sum_counter = 0;
let right_counter = 0;
let right_rate = 0;
let question_flag = true;
const start_time = new Date().getTime();
let now_time = 0;

const num1_ele = document.querySelector("#num1");
const num2_ele = document.querySelector("#num2");
const num3_ele = document.querySelector("#num3");
const op1_ele = document.querySelector("#op1");
const op2_ele = document.querySelector("#op2");
const answer_ele = document.querySelector(".user_answer");
const btn_sub = document.querySelector("#sub");
const btn_rem = document.querySelector("#rem");
const info = document.querySelector(".info");
const sum_questions_ele = document.querySelector(".all");
const right_num_ele = document.querySelector(".right_num");
const right_rate_ele = document.querySelector(".right_rate");
const time_sum_ele = document.querySelector(".time_sum");
// const btn_next = document.querySelector("#next");

displayQuestion();

btn_sub.addEventListener("click", function (e) {
  e.preventDefault();
  const answer = answer_ele.value;
  if (judgeAnswer(answer)) {
    sum_counter++;
    if (question_flag) right_counter++;
    right_rate = (right_counter / sum_counter).toFixed(3) * 100;
    displayUserInfo();
    displayQuestion();
  } else {
    question_flag = false;
    info.textContent = "答错了再试一试";
  }
  answer_ele.value = "";
});

btn_rem.addEventListener("click", function (e) {
  e.preventDefault();
  answer_ele.value = "";
});

// btn_next.addEventListener("click", function (e) {
//   // e.preventDefault();
// });

// 功能：显示用户当前信息
function displayUserInfo() {
  sum_questions_ele.textContent = sum_counter;
  right_num_ele.textContent = right_counter;
  right_rate_ele.textContent = right_rate;
  now_time = new Date().getTime();
  time_sum_ele.textContent = Math.floor((now_time - start_time) / 1000);
}

// 功能：显示式子
function displayQuestion() {
  question = createQuestion();
  num1_ele.textContent = question[0];
  num2_ele.textContent = question[2];
  num3_ele.textContent = question[4];
  op1_ele.textContent = changeOp(question[1]);
  op2_ele.textContent = changeOp(question[3]);
  info.textContent = "";
  question_flag = true;

  console.log(question);
  console.log(
    "原结果为:",
    myEval(question.join("")),
    "约为:",
    myEval(question.join("")).toFixed(2)
  );
}

// 功能：判断答案是否正确
function judgeAnswer(answer) {
  return Number(myEval(question.join("")).toFixed(2)) === Number(answer)
    ? true
    : false;
}

// 功能：美化操作符
function changeOp(op) {
  switch (op) {
    case "+":
      return "➕";
    case "-":
      return "➖";
    case "*":
      return "✖️";
    case "/":
      return "➗";
  }
}

// 功能：产生式子
/* 加减：三位数 + 三个因子
   乘除：两位数及以下 + 两个因子
   除法：被除数大于除数 + 除不尽时四舍五入保留两位小数 */
function createQuestion() {
  const arr = [
    getRandomNum(3),
    getRandomNum(2),
    getRandomNum(2),
    getRandomNum(3),
    getRandomNum(2),
    getRandomNum(1),
    getRandomNum(3),
    getRandomNum(1),
    getRandomNum(1),
  ];
  const len = arr.length;
  const nums = [];
  const ops = shuffle();
  const questions = [];
  let res = 0;
  let flag = 0;
  backTracking(nums, res, 0, []);
  return questions[0];

  // 洗牌算法处理操作符
  function shuffle() {
    const default_ops = ["+", "+", "-", "-", "*", "*", "/", "/"];
    const res = [];
    let flag = 0;
    while (flag < 2) {
      res.push(default_ops[Math.floor(Math.random() * default_ops.length)]);
      flag++;
    }
    return res;
  }

  // 回溯算法处理数据
  function backTracking(nums, res, start_index, flags) {
    // 满足条件
    if (nums.length === 3 && res > 100 && res < 2000) {
      const question = [nums[0], ops[0], nums[1], ops[1], nums[2]];
      questions.push(question);
      return;
    }

    for (let i = start_index; i < len; i++) {
      if (flags[i]) continue;
      const last_res = res;
      nums.push(arr[i]);
      flags[i] = true;
      res = calculate_res(nums, ops);
      backTracking(nums, res, i + 1, flags);
      flags[i] = false;
      nums.pop();
      res = last_res;
    }
  }
}

// 功能：产生随机数
function getRandomNum(digit) {
  return Math.floor(Math.random() * Math.pow(10, digit));
}

// 功能：实时计算
function calculate_res(nums, ops) {
  const len = nums.length;
  let str = "";
  switch (true) {
    case len === 1:
      res = nums[0];
      break;
    case len === 2:
      res = myEval(nums[0] + ops[0] + nums[1]);
      break;
    case len === 3:
      res = myEval(nums[0] + ops[0] + nums[1] + ops[1] + nums[2]);
      break;
  }
  return res;
}

// 功能：eval()方法的替代方案
function myEval(str) {
  return new Function("return " + str)();
}

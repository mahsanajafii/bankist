"use strict";

// Data................................................................................................................

const account1 = {
  owner: "Jonas Schmedtmann", 
  movements: [
    200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 500, -800, 700,
  ],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
    "2023-12-31T11:08:12.583Z",
    "2023-12-30T11:08:12.583Z",
    "2023-12-26T11:08:12.583Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [],
};
const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [],
};

const accounts = [account1, account2, account3, account4];

// select items:
const inputusername = document.querySelector(".namebox");
const inputpin = document.querySelector(".passwordbox");
const inputTransfer = document.querySelector(".Transfer--to");
const inputTransferAmount = document.querySelector(".Transfer--Amount");
const inputAmountloan = document.querySelector(".Amountloan");
const inputConfirmuser = document.querySelector(".Confirm--user");
const inputConfirmpin = document.querySelector(".Confirm--pin");
const balancevalue = document.querySelector(".balance__value");
const summaryvaluein = document.querySelector(".summary__value--in");
const summaryvalueout = document.querySelector(".summary__value--out");
const summaryvalueInterest = document.querySelector(
  ".summary__value--Interest"
);
const Transferbtn = document.querySelector(".Transferbtn");
const btnAmountloan = document.querySelector(".btnamount");
const cloesbtn = document.querySelector(".cloesbtn");
const sortbtn = document.querySelector(".sortbtn");
const changesection = document.querySelector(".change");
const lableuser = document.querySelector(".namebox");
const lablepin = document.querySelector(".passwordbox");
const lableenterbtn = document.querySelector(".enter");
const lablewellcome = document.querySelector(".welcome");
const contianertimelogged = document.querySelector(".timeloggedout");
const timeout = document.querySelector(".timeout");
const timelogin = document.querySelector(".timelogin");
const apps = document.querySelector(".app");
const contianermovements = document.querySelector(".movements");
const movementsrow = document.querySelector(".movements__row");
const movementsdate = document.querySelector(".movements__date");
const movementsvalue = document.querySelector(".movements__value");
const movementstype = document.querySelector(".movements__type");

// functions..............................................................................................................
let currentAccount, timer;
let amount = [];
let balance;
let now = new Date();
const locate = navigator.language;
const optionstime = {
  hour: "numeric",
  minute: "numeric",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const formatmov = function (value, locate, currency) {
  return new Intl.NumberFormat(locate, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const calcdate = function (now, pass) {
  const daypased = Math.round(
    (new Date(now) - new Date(pass)) / (24 * 60 * 60 * 1000)
  );
  if (daypased === 0) {
    return "today";
  }
  if (daypased === 1) {
    return "yesterdey";
  }
  if (daypased <= 7) {
    return `${daypased} days ago`;
  }
  {
    const t = new Date(pass);
    return new Intl.DateTimeFormat(currentAccount.locale).format(t);
  }
};
// create time login:

timelogin.textContent = `As of  ${new Intl.DateTimeFormat(
  locate,
  optionstime
).format(now)}`;

// create username:
const createusername = function (accounts) {
  accounts.forEach(function (el) {
    el.username = el.owner
      .toLocaleLowerCase()
      .split(" ")
      .map((value) => value[0])
      .join("")
      .toLocaleUpperCase();
  });
};
createusername(accounts);
// create movs and date array:
const creatmovanddate = function (accounts) {
  accounts.forEach(function (el) {
    el.movanddate = [];
    for (let k = 0; k <= el.movements.length - 1; k++) {
      el.movanddate.push({
        mov: el.movements[k],
        date: el.movementsDates[k],
      });
    }
  });
};
// display Movements:
const displayMovements = function (movanddate, sort = false) {
  contianermovements.innerHTML = "";

  const movs = sort
    ? movanddate.slice().sort((a, b) => a.mov - b.mov)
    : movanddate;

  movs.forEach(function (mov, i) {
    let type = mov.mov > 0 ? "deposit" : "withdrawal";

    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
    <div class="movements__date">${calcdate(
      new Date().toISOString(),
      mov.date
    )}</div>
    <div class="movements__value">${formatmov(
      mov.mov,
      currentAccount.locale,
      currentAccount.currency
    )}</div>
  </div>
`;
    contianermovements.insertAdjacentHTML("afterbegin", html);
  });
};
const calcDisplayBalance = function (account) {
  balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  balancevalue.textContent = formatmov(
    balance,
    currentAccount.locale,
    currentAccount.currency
  );
  return balance;
};

const calcDisplaySummary = function (account) {
  const deposit = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const withdrawal = Math.abs(
    account.movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0)
  );
  const Interest = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + (mov * account.interestRate) / 100, 0);
  summaryvaluein.textContent = formatmov(
    deposit,
    currentAccount.locale,
    currentAccount.currency
  );
  summaryvalueout.textContent = formatmov(
    withdrawal,
    currentAccount.locale,
    currentAccount.currency
  );
  summaryvalueInterest.textContent = formatmov(
    Interest,
    currentAccount.locale,
    currentAccount.currency
  );
};
const updateui = function (currentAccount) {
  creatmovanddate(accounts);
  displayMovements(currentAccount.movanddate);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

const setIntervaltimer = function () {
  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(Math.floor(time % 60)).padStart(2, 0);
    timeout.textContent = `you will be logged out in ${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      changesection.style.opacity = 0;
      lablewellcome.textContent = `login to get started`;
      alert("time out, please login again!");
    }
    time--;
  };
  let time = 12000;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
const resettimer = () => {
  clearInterval(timer);
  timer = setIntervaltimer();
};
// login:...........................................................................................................
lableenterbtn.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === lableuser.value.toLocaleUpperCase()
  );
  if (currentAccount?.pin === Number(lablepin.value)) {
    lableuser.value = lablepin.value = "";
    lableenterbtn.blur();
    lablewellcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    changesection.style.opacity = 1;
    resettimer();

    updateui(currentAccount);
  } else {
    changesection.style.opacity = 0;
    alert("no accunt!");
    lableuser.value = lablepin.value = "";
  }
});

// transfer:..........................................................

Transferbtn.addEventListener("click", function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    (curr) => curr.username === inputTransfer.value.toLocaleUpperCase()
  );
  const amounts = Number(inputTransferAmount.value);
  inputTransfer.value = inputTransferAmount.value = "";

  resettimer();
  if (
    amounts > 0 &&
    balance >= amounts &&
    currentAccount !== receiverAcc &&
    receiverAcc &&
    amounts !== 0
  ) {
    currentAccount.movements.push(-amounts);
    receiverAcc.movements.push(amounts);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateui(currentAccount);
  }
});
// loan.......................................................................

btnAmountloan.addEventListener("click", function (e) {
  e.preventDefault();
  const loan = Math.floor(inputAmountloan.value);
  console.log(loan);
  if (balance >= loan * 0.1 && loan > 0) {
    setTimeout(() => {
      currentAccount.movements.push(loan);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateui(currentAccount);
    }, 3000);
  }
  inputAmountloan.value = "";
  resettimer();
});

// close account:
cloesbtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputConfirmuser.value.toLocaleUpperCase() &&
    currentAccount.pin === Number(inputConfirmpin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    changesection.style.opacity = 0;
    lablewellcome.textContent = "login to get started";
  } else {
    inputConfirmpin.value = inputConfirmuser.value = "";
  }
});

let sort = false;
sortbtn.addEventListener("click", function () {
  resettimer();
  displayMovements(currentAccount.movanddate, !sort);
  sort = !sort;
});

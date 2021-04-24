'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 0.012, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 0.015,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.007,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 0.01,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');




// TODO: BEGINNING OF BANKIST APP
////////////////////////////////////////////////////////////
//////////////////   Bankist App    ////////////////////////
////////////////////////////////////////////////////////////
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acct){ 
  acct.balance = acct.movements.reduce((acc, mov) => 
  acc + mov, 0);
  labelBalance.textContent = `${acct.balance} €`
};

const updateUI = function (acct) {
  //Display movements
displayMovements(acct.movements);
//Display balance
calcDisplayBalance(acct);
//Display summary
calcDisplaySummary(acct);
}


//////////////    Computing Usernames      /////////////////
const createUsernames = function(accs){
  accs.forEach(function(acc){
  acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })};
  
  createUsernames(accounts);
  

///////////////    Login Event handler     ///////////////
let currentAccount;

btnLogin.addEventListener('click', function(e) {
//prevent form from submitting
e.preventDefault();

currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

if(currentAccount?.pin === Number(inputLoginPin.value)) {
  //Display UI and welcome message
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
};
containerApp.style.opacity = 100;

//clear input fields
inputLoginUsername.value = inputLoginPin.value = '';
inputLoginPin.blur();

updateUI(currentAccount);

});


//////////    Display Summary    /////////////////////////
const calcDisplaySummary = function(acct) {
  const incomes = acct.movements.filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acct.movements.filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov),0)
  labelSumOut.textContent = `${out}€`;

  const interest = acct.movements
    .filter(mov => mov > 0)
    .map(mov => mov * acct.interestRate)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}

/*
Lesson(s) learned: 
1) a ternary operator can't be used in a map method call. I wanted to write something like this:
const incomes = movements.filter(mov => mov > 0 ? mov * .012)

Instead, I had to use the filter method, as above, and then apply the map method.

2) Chaining methods should be done sparingly and cautiously. It can introduce bugs, especially when applied to very large arrays. In particular, methods which mutate the original array, such as  splice or reverse, can introduce bugs when applied to large arrays.
*/


////////////  Implementing transfers   /////////////////////
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acct => acct.username === inputTransferTo.value);

if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);
}

//Clear input fields
inputTransferAmount.blur();
inputTransferTo.value = inputTransferAmount.value = '';

updateUI(currentAccount);
})


////////////  Request a Loan  /////////////////////
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);

    updateUI(currentAccount);

    inputLoanAmount.textContent = inputLoanAmount.blur();
  }
})




////////////   Closing an account      ////////////////////
btnClose.addEventListener('click', function(e) {
  e.preventDefault();
if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
const index = accounts.findIndex(acct => acct.username === currentAccount.username);

//Delete account
accounts.splice(index, 1);

  //Hide UI
  containerApp.style.opacity = 0;
}
})


////////////   Sort button functionality    ///////////////
// We create a state variable, 'sorted', outside of the function, so that the boolean value of the sort parameter in the displayMovements function can be toggled. 

//When the sort button is clicked, displayMovements is called with the current account movements and !sorted. Since 'sorted' is set to false, !sorted = true. sort = true is the condition by which displayMovements initiates sorting of movements. The value of sorted is then changed from false to true. When the button is clicked again, all of this is reversed, allowing the movements to be displayed in the UI just as they are passed into it. See lecture 161 @ 13:08.

let sorted = false;

btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})








// TODO: END OF BANKIST APP


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
/////////////   Simple Array Methods, lect. 141     /////////////
/////////////////////////////////////////////////////////////////
let arr = ['a', 'b', 'c', 'd', 'e'];

//slice
arr.slice(2); // ['c', 'd', 'e']


//splice: changes the contents of an array by removing or replacing existing elements and/or adding new elements in place
// splice(start position, delete count)
arr.splice(-1); //deletes the last element of arr 
// console.log(arr.splice(-1)) // ['a', 'b', 'c', 'd']

const months = ['Jan', 'March', 'April', 'June'];
months.splice(1, 0, 'Feb');
// inserts at index 1
// expected output: Array ["Jan", "Feb", "March", "April", "June"]

months.splice(4, 1, 'May');
// replaces 1 element at index 4
// expected output: Array ["Jan", "Feb", "March", "April", "May"]


//Reverse
const arr2 = ['j', 'i', 'h', 'g', 'f'];
arr2.reverse(); // ['f', 'g', 'h', 'i', 'j']


//Concat: concatenates two arrays
const letters = arr.concat(arr2); //concatenates arr and arr2


//Join
//returns a string with a specified separator
const names = ['John', 'Joe', 'Jake'];
names.join('+'); // 'John+Joe+Jake'




////////////////////////////////////////////////////////////////
/////////////   Looping Arrays: forEach, lect. 142     /////////
////////////////////////////////////////////////////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//Example: Compare the for of loop to the forEach loop by looping over the movements array to print a message.
// for(const [i, movement] of movements.entries()){
//   if(movement > 0){
//     console.log(`You deposited ${movement}.`);
//   }else console.log(`You withdrew ${Math.abs(movement)}`);
// };
// console.log(' ---- forEach ----');
// movements.forEach(function(mov, i, arr){
//   if(movement > 0){
//     console.log(`You deposited ${movement}.`);
//   }else console.log(`You withdrew ${Math.abs(movement)}`);
// })

// For each iteration, the forEach method passes the current element, the index, and the entire array in that order to the callback function(see funciton parameters in the example above).

// the continue and break statements are not effective in the forEach loop



////////////////////////////////////////////////////////////////
/////////////   forEach with Maps & Sets, lect. 143    /////////
////////////////////////////////////////////////////////////////
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// currencies.forEach(function(value, key, map) {
//   console.log(`${key}: ${value}`);
// });
//expected output: 
// USD: United States dollar
// EUR: Euro
// GBP: Pound sterling

//Sets
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

// currenciesUnique.forEach(function(value, _, set) {
// console.log(`${value}: ${value}`);
// });
// expected output:
// USD: USD
// GBP: GBP
// EUR: EUR




////////////////////////////////////////////////////////////////
/////////////   Coding Challenge, lect. 146    /////////////////
////////////////////////////////////////////////////////////////
// TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
const checkDogs = function(juliaArr, kateArr) {
const juliaArrCorrect = juliaArr.slice(1,3);
const dogs = juliaArrCorrect.concat(kateArr);

dogs.forEach(function(age, i, _){
  age >= 3 ? console.log(`Dog number ${i + 1} is an adult, and is ${age} years old.`) : console.log(`Dog number ${i + 1} is a puppy.`);
})
};

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]); 
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4])



////////////////////////////////////////////////////////////////////////////////// Overview of Data Transformations with MAP, FILTER, and REDUCE, lect. 147  /  
///////////////////////////////////////////////////////////////////////////////
// The map method is similar to the forEach loop, but it creates a new array, based on the original. It loops over an array, applying a callback function in each iteration. In situations where a new array is not required, the forEach method may be preferable.

// The filter method selects and returns elements of an array which conform to a given condition.

// The reduce method can perform a number of operations on an array to return a single value. It may be a sum of all elements. But other operations are possible. It doesn't produce a new array, but replaces the original with a single value, determined by the specified operation.



////////////////////////////////////////////////////////////////////////////////
/////   Using the Map method for data transformaiton, lect. 148   //////////////
///////////////////////////////////////////////////////////////////////////////
// Use case: convert values in the movements array to US Dollars, assuming that they are currently in Euros
const euroToUsd = 1.1; //conversion rate

const movementsUSD = movements.map(mov => mov * euroToUsd);




//////////////////////////////////////////////////////////////////
//////////////////   The Filter method, lect. 150   //////////////
//////////////////////////////////////////////////////////////////
// As in the map and forEach methods, filter gets access to the element, index, and array.

// Use case: Create a deposits array which contains only account movements which are positive, i.e. above 0:
const deposits = movements.filter(mov => mov > 0);
// console.log(movements);
// console.log(deposits);

// Use case: Create an array of withdrawals:
const withdrawals = movements.filter(mov => mov < 0);
// console.log(movements);
// console.log(withdrawals);



//////////////////////////////////////////////////////////////////
//////////////////   The Reduce method, lect. 151   //////////////
//////////////////////////////////////////////////////////////////
// The first argument in the callback function for the reduce method is an accumulator, i.e. a sum of all elements which have been iterated at a given point in time. As in other data transformation methods, the index and entire array are inputs, but they aren't needed in the example below.

const balance = movements.reduce((acc, curr) => acc + curr, 0); // the zero in this line is the initial value of the accumulator
// console.log(balance);


// Use case: Get the maximum value of the movements array (3000)
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

  const max = movements.reduce((acc, mov) => {
if(acc > mov) return acc
else return mov;
}, movements[0]);

// console.log(max);




//////////////////////////////////////////////////////////////////
//////////////////   Coding challenge, lect. 152   //////////////
//////////////////////////////////////////////////////////////////
const dogAges1 = [5, 2, 4, 1, 15, 8, 3];
const dogAges2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function(ages) {
    //convert dogAge ages to human ages
    const humanAge = ages.map(dogAge => 
      dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4);

    console.log(humanAge);

    //filter dogs whose human age is under 18 years 
    const adultDogs = humanAge.filter(dogAge => dogAge >= 18);
  
    console.log(adultDogs);

    //loop through adultDogs, using the reduce method accumulator. Then divide the accumulator by the array length to get an average age
    const averageAge = adultDogs.reduce((acc, age) => acc + age, 0) / adultDogs.length;
    return averageAge;
  };

// console.log(calcAverageHumanAge(dogAges1));

/* Lessons learned from this challenge: 
1) Store data transformations in a variable

2) As in the averageAge variable above, the accumulator operation must be specified. It isn't a sum function by default. It could have been, for example, multiplied or divided by age.

*/




//////////////////////////////////////////////////////////////////
//////////////////   Coding challenge, lect. 154   //////////////
//////////////////////////////////////////////////////////////////

//Rewrite the calcAverageHumanAge function using an arrow function and chaining

const calcAverageHumanAge2 = ages =>
  ages.map(dogAge => dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4)
    .filter(dogAge => dogAge >= 18)
    .reduce((acc, age, i, arr) => acc + age, 0) / arr.length;

// console.log(calcAverageHumanAge(dogAges1));




//////////////////////////////////////////////////////////////////
//////////////////   The Find Method, lect. 155   //////////////
//////////////////////////////////////////////////////////////////

//Retrieve one element of an array, based on a condition
const firstWithdrawal = movements.find(mov => mov < 0);

// Like the filter method, find accepts a callback f'n which returns a boolean. Rather than return a new array as filter does, find returns only the first element of an array which satisfies the specified condition.

// Use case: Find an account whose owner is Jessica Davis:
const accountJD = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(accountJD);

//Using the for...of loop, for comparison:
// for(const acc of accounts) {
//   const jdAccount = acc.owner === 'Jessica Davis' ? acc 
// };

// console.log(jdAccount);





//////////////////////////////////////////////////////////////////
//////////////////   The FindIndex Method, lect. 158   //////////////
//////////////////////////////////////////////////////////////////
/*
As the name suggests, the findIndex method returns the index of an array element which satisfies a specified condition

*/




//////////////////////////////////////////////////////////////////
//////////////////   Some and Every methods, lect. 159   //////////////
//////////////////////////////////////////////////////////////////
/*       SOME
The some method works in a way similar to includes, which checks to see if an array contains a value exactly equal to the one queried:
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
movements.includes(-130); //true

Rather than checking for equality, some checks for a condition: 
movements.some(mov => mov > 5000); //false
movements.some(mov => mov < 300): //true

        EVERY
As the name suggests, the every method performs an action only when every element of an array fits the given criteria.

movements.every(mov => mov > 0); //false
account4.movements.every(mov => mov > 0); //true
*/




////////////////////////////////////////////////////////////
///////////   Flat and Flatmap methods, lect. 160   ////////
////////////////////////////////////////////////////////////

//          FLAT
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// arr.flat(); //[1, 2, 3, 4, 5, 6, 7, 8]

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// arrDeep.flat(); //[[1, 2,] 3, 4, [5, 6], 7, 8] flat goes one level of nesting by default, but more levels can be specified:
// arrDeep.flat(2); //[1, 2, 3, 4, 5, 6, 7, 8]


//An array which contains all the movements of all the accounts:
const accountMovements = accounts.map(acct => acct.movements).flat();

const allAccountMovements = accountMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(allAccountMovements);

//        FlatMap
//Combines the utility of flat and map, but works on only one level of nesting.




////////////////////////////////////////////////////////////
///////////   Sorting Arrays, lect. 161   //////////////////
////////////////////////////////////////////////////////////

//Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
owners.sort(); // ['Adam', 'Jonas', 'Martha', 'Zach'] mutates the original array

//Numbers
// The sort method only works on strings. So, if we used it to sort the movements array, we'd get the following:
// [-130, -400, -650, 1300, 200, 3000, 450, 70]

//So, to use the sort method to work with number arrays, we have to use a comparison f'n in the sort method:
//return < 0: a, b (keep current order)
//return > 0: b, a (switch order)
movements.sort((a, b) => a - b); //ascending order
movements.sort((a, b) => b - a); //descending order

// the parameters 'a, b' represent the current value and the next value, if we imagine the sort method looping over the array. If 'a' is larger than 'b', then a - b will return > 0, which triggers the sort method to swap the value's position in the array. If 'a' is a smaller value than 'b', a - b will return < 0, which will signal the sort method to keep the current order. When 'a' is equal to 'b', zero is returned, which keeps the current order.




//////////////////////////////////////////////////////////////
///  More ways of creating and filling arrays, lect. 162   ///
//////////////////////////////////////////////////////////////
//create a new empty array:
const newEmptyArr = new Array(5); //[empty × 5]

//fill the new empty array with values:
newEmptyArr.fill(3); //[3, 3, 3, 3, 3]

//combine the functions of the Array constructor and fill method:
const betterArrayMaker = Array.from({length: 5}, (_, i) => 3);
//[3, 3, 3, 3, 3]

//user the from method to create a new array with ascending values:
const ascendingArr = Array.from({length: 7}, (_, i) => i + 1);
//[1, 2, 3, 4, 5, 6, 7]

const countBy2 = Array.from({length: 7}, (_, i) => i * 2);
//[0, 2, 4, 6, 8, 10, 12]

//Create an array of 100 random dice rolls
const diceRolls100 = Array.from({length: 100}, () => Math.trunc(Math.random() * 6));
//(100) [3, 5, 4, 3, 5, 5, 5, 1, 3, 1, 1, 0, 4, 0, 4, 1, 3, 2, 1, 4, 4, 0, 5, 0, 1, 0, 4, 5, 5, 1, 4, 1, 1, 5, 2, 0, 2, 5, 3, 5, 5, 0, 4, 0, 5, 1, 0, 3, 2, 3, 4, 1, 3, 0, 1, 3, 2, 0, 5, 2, 3, 3, 1, 0, 4, 0, 1, 1, 5, 5, 0, 0, 5, 3, 0, 3, 0, 3, 2, 4, 4, 1, 3, 4, 4, 5, 3, 4, 5, 5, 3, 4, 3, 4, 2, 5, 3, 1, 1, 5]
//How can I exclude 0 from this array?


/* 
1)Generate an array of movements based on data in the UI as the user clicks on the balance DOM element
2) use the 2nd argument of Array.from, which functions as a map method, to remove the € sign from the resulting array.
*/
labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from(document.querySelctorAll('.movements__value'), el => el.textContent.replace('€', ''));
});
// console.log(movementsUI);






//////////////////////////////////////////////////////////////
//////////  Which array method to use, lect. 163   ///////////
//////////////////////////////////////////////////////////////
// see screenshot of lecture, saved on desktop, entitled 'Basic Array Methods'





//////////////////////////////////////////////////////////////
//////////  Array Method Practice, lect. 164   ///////////
//////////////////////////////////////////////////////////////

//Get a sum of all deposits made in the bankist accounts:
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)//takes movements from each account and flattens them into a single array
  .filter(mov => mov > 0)
  .reduce((sum, curr) => sum + curr, 0); //25180

//How many deposits have been made of at least 1,000?
const minDeposit1000 = accounts
.flatMap(acct => acct.movements)
.filter(mov => mov >= 1000)
.reduce((acc, curr, i, arr) => arr.length);
// console.log(minDeposit1000); // 6

const numDeposits1000 = accounts
.flatMap(acct => acct.movements)
.filter(mov => mov >= 1000)
.reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);
//console.log(numDeposits1000); // 6

//Prefixed ++ (explanation of how ++ works when applied as a prefix as oppossed to a suffix)
let a = 10;
//console.log(a++); // 10
//console.log(++a); // 11

//Use reduce method to create a new object, instead of a number or string:
// Create an object which contains the sum of deposits and the sum of withdrawals
const sums = accounts
  .flatMap(acct => acct.movements)
  .reduce((sums, curr) => {
    // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
    sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
    return sums; //an arrow f'n requires an explicit return statement when there is a code block
  }, {deposits: 0, withdrawals: 0})

  //console.log(sums); // {deposits: 25180, withdrawals: -7340}


//Create a f'n that converts a string to title-case.
//E.g. this is a nice title --> This Is a Nice Title
const convertTitleCase = function(title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title.toLowerCase().split(' ').map(word => exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join(' ');

return capitalize(titleCase);
};

// console.log(convertTitleCase('this is a nice title'));
// //This Is a Nice Title

// console.log(convertTitleCase('this is a LONG title but not too long'));
// //This Is a Long Title but Not Too Long

// console.log(convertTitleCase('and, here is another title with an EXAMPLE'));
//And, Here Is Another Title with an Example







//////////////////////////////////////////////////////////////
//////////      Coding Challenge 4, lect. 165      ///////////
//////////////////////////////////////////////////////////////
/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

dogs.forEach(dog => {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
}
)
console.table(dogs)


//2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

//this way of logging the string is much better than the long if/else statement which follows.
// console.log(`Sarah's dog is eating ${sarahDog.curFood > sarahDog.recommendedFood * 1.1 ? 'too much' : 'too little'} `);

// if(sarahDog.curFood < sarahDog.recommendedFood * 0.9) {
// console.log(`Sarah's dog is eating too little`);
// } else if(sarahDog.curFood > (sarahDog.recommendedFood * 0.9) && sarahDog.curFood < (sarahDog.recommendedFood * 1.1)) { 
// console.log(`Sarah's dog is eating a healthy amount.`);
// } else if(sarahDog.curFood > sarahDog.recommendedFood * 1.1) {
//   console.log(`Sarah's dog is eating too much.`);
// };


// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

const ownersEatTooMuch = dogs.filter(dog => dog.curFood > (dog.recommendedFood * 1.1)).flatMap(dog => dog.owners);
const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recommendedFood * 0.9).map(dog => dog.owners);

console.log(ownersEatTooMuch, ownersEatTooLittle);


// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much.`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little.`);


// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
//use .some
const exactEater = dogs.some(dog => dog.curFood === dog.recommendedFood);
//console.log(exactEater); //false


// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
const checkOkayEater = dogs.some(dog => dog.curFood > (dog.recommendedFood * 0.9) && dog.curFood < (dog.recommendedFood * 1.1));
//console.log(checkOkayEater); //true


// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)

const okayEater = dogs.filter(dog => dog.curFood > (dog.recommendedFood * 0.9) && dog.curFood < (dog.recommendedFood * 1.1));
// console.log(okayEater); //Michael's food


// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
const dogsCopy = dogs.map(dog => dog);
console.table(dogsCopy);

//arr.sort((a, b) => a - b); //ascending order
const dogsSortedByFood = dogsCopy.map(dog => dog.recommendedFood).sort((a, b) => a - b);
console.log(dogsSortedByFood);

//Jonas' approach
//const dogsSorted = dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood);












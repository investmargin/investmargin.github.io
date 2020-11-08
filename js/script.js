function scriptJsLoad() {


// Объявление переменных


// Доходность годовых
let yield;

// Сумма первоначальных инвестиций
let sumBegin;

// Итоговая оценка всех инвестиций
let sumEnd;

// Результат инвестирования за период в абсолютном выражении 
let sumDelta;

// Средневзвешенная сумма вложенных средств
let sumWeighted;

// Годовой период
const daysYear = 365;



// Заполение данных из формы

let allOperations = [];
let operationsRow = document.getElementById('operationsRow');
let operationsCount;


function fillAllOperations () {
    
    // Добавить валидацию заполненности
    // преобразование пустой строки из input и валидацю заполнения

    
    operationsCount = operationsRow.childElementCount;


    // заполнить 0 операцию
    
    let date0 = document.getElementById('date0').value;
    let add0 = Number(document.getElementById('add0').value);

    allOperations = [];

    allOperations[0] = {
        operationNumber: 0,
        date: date0,
        add: add0,
        out: 0,
    }


    // заполнить операции с 1 по последнюю
    for (let a=1; a <= operationsCount; a++) {

        let date = document.getElementById(`date${a}`).value,
            add = Number(document.getElementById(`add${a}`).value),
            out = Number(document.getElementById(`out${a}`).value);

        allOperations[a] = {
            operationNumber: a,
            date: date,
            add: add,
            out: out,
        }
    }
    
    let dateEnd = document.getElementById('dateEnd').value;

    allOperations[operationsCount+1] = {
        operationNumber: "end",
        date: dateEnd,
        add: 0,
        out: 0,
    }


    // console.log(allOperations);

}






// Функция расчета доходности


function yieldCalc () {

    let timeFirst,
    timeSecond,
    timeBegin,
    timeEnd,
    timeDiff,
    diffDays,
    timeDiffEnd,
    diffDaysEnd;

    let count = allOperations.length-1;
    
    // Сумма всех выводов средств
    let sumOut = 0;

    // Сумма всех вводов средств
    let sumAdd = 0;

    sumEnd = Number(document.getElementById('sumEnd').value);
    sumBegin = Number(allOperations[0].add);

    let sumPeriod = 0,
        sumMultip = 0;


    for (let i = 1; i <= count; i++){
        sumAdd = sumAdd + Number(allOperations[i].add);
        sumOut = sumOut + Number(allOperations[i].out);
        // console.log(allOperations[i].add);
        // console.log(Number(allOperations[i].add));

        timeFirst = new Date(allOperations[i-1].date);
        timeSecond = new Date(allOperations[i].date);
        timeDiff = Math.abs(timeSecond.getTime() - timeFirst.getTime());
        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // console.log("Период " + i +":", diffDays);

        sumPeriod = sumPeriod + Number(allOperations[i-1].add)-Number(allOperations[i-1].out);
        sumMultip = sumMultip + (diffDays * sumPeriod);
        // console.log("Сумма:", sumPeriod);
        // console.log("Произведение накопительным:", sumMultip);

    };


    timeBegin = new Date(allOperations[0].date);
    timeEnd = new Date(allOperations[count].date);
    timeDiffEnd = Math.abs(timeEnd.getTime() - timeBegin.getTime());
    diffDaysEnd = Math.ceil(timeDiffEnd / (1000 * 3600 * 24));
    // console.log("Весь период:", diffDaysEnd);
    // console.log("Сумма произведений:", sumMultip);
    

    // Итоговые формулы:
    sumDelta = (sumEnd + sumOut) - (sumBegin + sumAdd);
    sumWeighted = sumMultip / diffDaysEnd;
    yield = (sumDelta / sumWeighted) * (daysYear / diffDaysEnd) * 100;
       
    
    
    // console.log("Первоначальная сумма:", sumBegin);
    // console.log("Сумма всех вводов средств:", sumAdd);
    // console.log("Сумма всех выводов средств:", sumOut);
    // console.log("Весь период:", diffDaysEnd);
    // console.log("Сумма произведений:", sumMultip);
    
    // console.log("Результат инвестирования за период:", sumDelta);
    // console.log("Средневзвешенная сумма вложенных средств:", sumWeighted);
    // console.log("Доходность годовых:", yield);
    
    // return sumAdd, sumOut, diffDaysEnd, sumMultip;
};



// Добавление и удаление строк-операций

function addOperation() {
    
    operationsCount = operationsRow.childElementCount;
    let y = operationsCount + 1;

    operationsRow.insertAdjacentHTML('beforeend', 
    `<div class="row mt-1">
        <div class="col-4 col-md-3 col-xl-2">
            <input type="date" value="" class="form-control" id="date${y}">
        </div>
        <div class="col-4">
            <input type="number" value="" class="form-control" id="add${y}" placeholder="ввести сумму">
        </div>
        <div class="col-4">
            <input type="number" class="form-control" id="out${y}" placeholder="ввести сумму">
        </div>
    </div>`);

    let showResult = document.getElementById('showResult');
    if (showResult) {
        showResult.remove();
    }
}

function delOperation() {
    let lastOperation = operationsRow.lastElementChild;
    lastOperation.remove();
    
    let showResult = document.getElementById('showResult');
    if (showResult) {
        showResult.remove();
    }
}


let addButton = document.getElementById('addButton');
addButton.addEventListener("click", addOperation);


let delButton = document.getElementById('delButton');
delButton.addEventListener("click", delOperation);



// Вывод результата на страницу

function showResult() {
    let showResult = document.getElementById('showResult');
    let resultRow = document.getElementById('resultRow');

    if (showResult) {
        showResult.remove();
    }
    let yieldRound = Math.floor(yield* 100) / 100;

    resultRow.insertAdjacentHTML('beforeend',
    `<strong id="showResult" class="ml-3">Доходность годовых: ${yieldRound}%</strong>
    `);  

}


// Старт расчета доходности

function start() {
    let promise = new Promise (function () {
        fillAllOperations()});
    
    promise.then(yieldCalc());
    promise.then(showResult());

}

let startCalc = document.getElementById('startCalc');
startCalc.addEventListener("click", start);


// let str = "2134532";
// console.log(str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));

};

document.addEventListener("DOMContentLoaded", scriptJsLoad);
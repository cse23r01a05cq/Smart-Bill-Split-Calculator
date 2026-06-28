const billInput = document.getElementById("bill");
const tipInput = document.getElementById("tip");
const personsInput = document.getElementById("persons");
const currencySelect = document.getElementById("currency");

const calculateBtn = document.getElementById("calculate-btn");
const resetBtn = document.getElementById("reset-btn");
const themeBtn = document.getElementById("theme-btn");

const billAmount = document.getElementById("billAmount");
const tipAmount = document.getElementById("tipAmount");
const totalAmount = document.getElementById("totalAmount");
const perPerson = document.getElementById("perPerson");

const error = document.getElementById("error");

const tipButtons = document.querySelectorAll(".tip-btn");

let darkMode = localStorage.getItem("theme");

if (darkMode === "dark") {
    document.body.classList.add("dark");
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});

tipButtons.forEach(button => {

    button.addEventListener("click", () => {

        tipInput.value = button.dataset.tip;

        calculateBill();

    });

});


calculateBtn.addEventListener("click", calculateBill);

resetBtn.addEventListener("click", resetCalculator);

function calculateBill() {

    error.textContent = "";

    const bill = Number(billInput.value);

    const tip = Number(tipInput.value);

    const persons = Number(personsInput.value);

    const currency = currencySelect.value;

    if (
        billInput.value === "" ||
        tipInput.value === "" ||
        personsInput.value === ""
    ) {

        clearOutput();

        return;

    }

    if (
        bill <= 0 ||
        persons <= 0 ||
        tip < 0
    ) {

        error.textContent =
            "Please enter valid values.";

        clearOutput();

        return;

    }

    const tipValue =
        bill * (tip / 100);

    const total =
        bill + tipValue;

    const each =
        total / persons;

    billAmount.textContent =
        currency + bill.toFixed(2);

    tipAmount.textContent =
        currency + tipValue.toFixed(2);

    totalAmount.textContent =
        currency + total.toFixed(2);

    perPerson.textContent =
        currency + each.toFixed(2);

    saveLastCalculation(
        bill,
        tip,
        persons,
        currency,
        tipValue,
        total,
        each
    );

}

function resetCalculator() {

    billInput.value = "";

    tipInput.value = "";

    personsInput.value = "";

    currencySelect.selectedIndex = 0;

    error.textContent = "";

    clearOutput();

}

function clearOutput() {

    const currency = currencySelect.value;

    billAmount.textContent =
        currency + "0.00";

    tipAmount.textContent =
        currency + "0.00";

    totalAmount.textContent =
        currency + "0.00";

    perPerson.textContent =
        currency + "0.00";

}
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");
const downloadBtn = document.getElementById("download-btn");

function saveLastCalculation(
    bill,
    tip,
    persons,
    currency,
    tipValue,
    total,
    each
) {

    const currentBill = {
        bill,
        tip,
        persons,
        currency,
        tipValue,
        total,
        each,
        date: new Date().toLocaleString()
    };

    localStorage.setItem(
        "lastBill",
        JSON.stringify(currentBill)
    );

    let history =
        JSON.parse(localStorage.getItem("billHistory")) || [];

    history.unshift(currentBill);

    if (history.length > 10) {
        history.pop();
    }

    localStorage.setItem(
        "billHistory",
        JSON.stringify(history)
    );

    loadHistory();

}

function loadHistory() {

    const history =
        JSON.parse(localStorage.getItem("billHistory")) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
            `<p class="empty">No history available.</p>`;

        return;

    }

    history.forEach(item => {

        const div = document.createElement("div");

        div.className = "history-item";

        div.innerHTML = `
            <div>
                <strong>${item.currency}${item.total.toFixed(2)}</strong><br>
                <small>${item.persons} Person(s)</small><br>
                <small>${item.date}</small>
            </div>

            <div>
                Each : ${item.currency}${item.each.toFixed(2)}
            </div>
        `;

        historyList.appendChild(div);

    });

}

clearHistoryBtn.addEventListener("click", () => {

    localStorage.removeItem("billHistory");

    loadHistory();

});

downloadBtn.addEventListener("click", () => {

    const text =

`SMART BILL SPLIT RECEIPT

----------------------------

Bill Amount : ${billAmount.textContent}

Tip Amount : ${tipAmount.textContent}

Total Amount : ${totalAmount.textContent}

Each Person Pays : ${perPerson.textContent}

Generated On :

${new Date().toLocaleString()}

Thank You
`;

    const blob = new Blob([text], {
        type: "text/plain"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "BillReceipt.txt";

    link.click();

    URL.revokeObjectURL(link.href);

});
window.addEventListener("load", () => {

    const last =
        JSON.parse(localStorage.getItem("lastBill"));

    if (last) {

        billInput.value = last.bill;
        tipInput.value = last.tip;
        personsInput.value = last.persons;
        currencySelect.value = last.currency;

    }

    loadHistory();

});


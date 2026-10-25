const display = document.getElementById('display');
const previousOpDisplay = document.getElementById('previous-op');
const historyList = document.getElementById('history-list');

let currentInput = '';
let isEvaluated = false;

// Menambahkan nilai/karakter ke layar
function appendValue(value) {
    if (isEvaluated && !isOperator(value)) {
        currentInput = '';
        isEvaluated = false;
    } else {
        isEvaluated = false;
    }

    if (display.value === '0' && value !== '.' && !isOperator(value)) {
        currentInput = value;
    } else {
        currentInput += value;
    }

    updateDisplay();
}

// Menambahkan fungsi matematika seperti sin, cos, sqrt
function appendFunction(funcName) {
    if (isEvaluated) {
        currentInput = '';
        isEvaluated = false;
    }

    if (display.value === '0') {
        currentInput = funcName;
    } else {
        currentInput += funcName;
    }

    updateDisplay();
}

// Memeriksa apakah karakter adalah operator
function isOperator(char) {
    return ['+', '-', '*', '/', '**'].includes(char);
}

// Menghapus seluruh input (AC)
function clearDisplay() {
    currentInput = '';
    previousOpDisplay.textContent = '';
    display.value = '0';
    isEvaluated = false;
}

// Menghapus karakter terakhir (DEL)
function deleteLast() {
    if (isEvaluated) {
        clearDisplay();
        return;
    }
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') {
        display.value = '0';
    } else {
        updateDisplay();
    }
}

// Memperbarui tampilan layar
function updateDisplay() {
    display.value = currentInput || '0';
}

// Menghitung hasil persamaan ilmiah
function calculate() {
    if (!currentInput) return;

    try {
        let expression = currentInput;
        
        // Format ekspresi agar mudah dibaca pada riwayat
        let readableExpression = expression
            .replace(/Math\.sin\(/g, 'sin(')
            .replace(/Math\.cos\(/g, 'cos(')
            .replace(/Math\.tan\(/g, 'tan(')
            .replace(/Math\.sqrt\(/g, '√(')
            .replace(/Math\.log10\(/g, 'log(')
            .replace(/Math\.log\(/g, 'ln(')
            .replace(/Math\.PI/g, 'π')
            .replace(/\*\*/g, '^');

        // Evaluasi matematika
        let result = eval(expression);

        // Menangani pembagian dengan nol atau nilai NaN
        if (!isFinite(result)) {
            throw new Error('Hasil tidak terdefinisi');
        }

        // Bulatkan hasil jika desimal terlalu panjang
        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8));
        }

        previousOpDisplay.textContent = `${readableExpression} =`;
        display.value = result;

        // Tambahkan ke riwayat
        addToHistory(readableExpression, result);

        currentInput = result.toString();
        isEvaluated = true;
    } catch (error) {
        display.value = 'Error';
        previousOpDisplay.textContent = '';
        currentInput = '';
        isEvaluated = true;
    }
}

// Menambahkan hasil ke daftar riwayat
function addToHistory(expression, result) {
    const li = document.createElement('li');
    li.textContent = `${expression} = ${result}`;
    historyList.prepend(li);
}

// Menghapus riwayat
function clearHistory() {
    historyList.innerHTML = '';
}
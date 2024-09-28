// game-server.js
const net = require('net');

let min, max;

const server = net.createServer((socket) => {
    console.log("Сервер готов...");

    socket.on('data', (data) => {
        const message = JSON.parse(data.toString());
        console.log(`Получено сообщение от клиента: ${JSON.stringify(message)}`);

        if (message.range) {
            [min, max] = message.range.split('-').map(Number);
            guessNumber(socket);
        } else if (message.answer !== undefined) {
            const guess = message.answer;
            console.log(`Сервер предполагает: ${guess}`);

            // Генерация нового предположения
            if (guess < min || guess > max) {
                console.log("Предположение вне диапазона!");
                return;
            }

            // Отправка ответа клиенту
            socket.write(JSON.stringify({ answer: guess }));

            // Обработка подсказки
            if (message.hint === "more") {
                min = guess + 1;
            } else if (message.hint === "less") {
                max = guess - 1;
            }
        }
    });
});

function guessNumber(socket) {
    const guess = Math.floor((min + max) / 2);
    socket.write(JSON.stringify({ answer: guess }));
}

server.listen(3000, '127.0.0.1', () => {
    console.log('Сервер запущен на порту 3000');
});

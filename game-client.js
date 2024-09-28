// game-client.js
const net = require('net');
const argv = require('yargs').argv;

const min = parseInt(argv._[0]);
const max = parseInt(argv._[1]);
const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

const client = new net.Socket();

client.connect(3000, '127.0.0.1', () => {
    console.log(`Клиент готов. Загаданное число между ${min} и ${max}.`);
    // Отправка диапазона на сервер
    client.write(JSON.stringify({ range: `${min}-${max}` }));
});

client.on('data', (data) => {
    const response = JSON.parse(data.toString());
    console.log(`Получено от сервера: ${JSON.stringify(response)}`);

    if (response.answer < randomNumber) {
        client.write(JSON.stringify({ hint: "more" }));
    } else if (response.answer > randomNumber) {
        client.write(JSON.stringify({ hint: "less" }));
    } else {
        console.log("Поздравляем! Загаданное число угадано!");
        client.destroy(); // Закрытие соединения
    }
});

client.on('close', () => {
    console.log('Соединение закрыто');
});

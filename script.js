let numPlayers, players = [], currentRound = 1, totalRounds = 12, playerScores = [], roundNames = [];
let betNumbers = [], betResults = [], roundsWon = [], betsWon = [], betsLost = [];
let currentPlayer = 0; // Variable para llevar el control del turno
let startTime;

function startGame() {
    numPlayers = document.getElementById('numPlayers').value;

    if (numPlayers < 1) {
        alert("Por favor ingresa una cantidad válida de jugadores.");
        return;
    }

    players = [];
    for (let i = 0; i < numPlayers; i++) {
        const name = prompt(`Ingresa el nombre del jugador ${i + 1}:`);
        players.push(name);
        playerScores.push(0);
    }

    startTime = new Date(); // Almacenar la hora de inicio del juego

    document.getElementById('input-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    
    roundNames = [];
    for (let i = 1; i <= 6; i++) roundNames.push(`Ronda ${i}`);
    roundNames.push("Ronda 6 (Sin espada)");
    for (let i = 5; i >= 1; i--) roundNames.push(`Ronda ${i}`);

    showRoundInfo();
}

function showRoundInfo() {
    document.getElementById('round-info').innerHTML = 
        `<h3>${roundNames[currentRound - 1]}</h3>
        <p><strong>Turno de: ${players[currentPlayer]}</strong></p>`;

    document.getElementById('players-section').innerHTML = players.map((player, index) => 
        `<div class="player-bet-container">
            <label for="bet-${index}" class="bet-label">${player} - Número de Apuesta: </label>
            <input type="number" id="bet-${index}" class="bet-input" placeholder="Número de Apuesta" min="0" required />
        </div>`
    ).join('');

    document.getElementById('players-section').innerHTML += `<button onclick="saveBets()" class="bet-button">Guardar Apuestas</button>`;
}

function saveBets() {
    betNumbers = [];
    for (let i = 0; i < numPlayers; i++) {
        const bet = document.getElementById(`bet-${i}`).value;
        if (bet === '' || isNaN(bet)) {
            alert(`Por favor, ingresa un número de apuesta válido para ${players[i]}.`);
            return;
        }
        betNumbers.push(parseInt(bet));
    }

    let betList = `<h4 class="bet-title">Números de Apuesta:</h4><div class="bet-list">`;
    for (let i = 0; i < numPlayers; i++) {
        betList += 
            `<div class="bet-item">
                <span class="bet-player">${players[i]}:</span>
                <span class="bet-number">${betNumbers[i]}</span>
            </div>`;
    }
    betList += `</div>`;

    document.getElementById('players-section').innerHTML = betList;

    setTimeout(() => {
        document.getElementById('round-info').innerHTML = 
            `<h3>${roundNames[currentRound - 1]}</h3>
            <p><strong>Turno de: ${players[currentPlayer]}</strong></p>`;
        document.getElementById('players-section').innerHTML += players.map((player, index) => 
            `<div>
                <label for="bet-result-${index}">${player} - ¿Ganó la apuesta?: </label>
                <select id="bet-result-${index}">
                    <option value="yes">Sí</option>
                    <option value="no">No</option>
                </select>
            </div>
            <div>
                <label for="rounds-won-${index}">${player} - ¿Cuántas rondas ganó?: </label>
                <input type="number" id="rounds-won-${index}" min="0" placeholder="Rondas ganadas" />
            </div>`
        ).join('');
        document.getElementById('players-section').innerHTML += `<button onclick="applyResults()" class="result-button">Aplicar Resultados</button>`;
    }, 2000);
}

function applyResults() {
    betResults = [];
    roundsWon = [];

    for (let i = 0; i < numPlayers; i++) {
        const betResult = document.getElementById(`bet-result-${i}`).value;
        const roundsWonValue = document.getElementById(`rounds-won-${i}`).value;

        if (roundsWonValue === '' || isNaN(roundsWonValue) || roundsWonValue < 0) {
            alert(`Por favor, ingresa un número válido de rondas ganadas para ${players[i]}.`);
            return;
        }

        betResults.push(betResult);
        roundsWon.push(parseInt(roundsWonValue));

        if (betResult === 'yes') {
            playerScores[i] += 10;
            betsWon[i] = (betsWon[i] || 0) + 1;
        } else {
            playerScores[i] -= 10;
            betsLost[i] = (betsLost[i] || 0) + 1;
        }

        playerScores[i] += roundsWon[i] * 3;
    }

    updateScoresTable();

    if (currentRound < totalRounds) {
        currentRound++;
        currentPlayer = (currentPlayer + 1) % numPlayers;
        showRoundInfo();
    } else {
        showResults();
    }
}

function updateScoresTable() {
    let playersWithScores = [];
    for (let i = 0; i < numPlayers; i++) {
        playersWithScores.push({ player: players[i], score: playerScores[i] });
    }

    playersWithScores.sort((a, b) => b.score - a.score);

    let tableHTML = 
        `<table border="1">
            <thead>
                <tr>
                    <th>Jugador</th>
                    <th>Puntuación Acumulada</th>
                </tr>
            </thead>
            <tbody>`;
    for (let i = 0; i < playersWithScores.length; i++) {
        tableHTML += 
            `<tr>
                <td>${playersWithScores[i].player}</td>
                <td>${playersWithScores[i].score}</td>
            </tr>`;
    }
    tableHTML += `</tbody></table>`;

    document.getElementById('scores-table').innerHTML = tableHTML;
}

function showResults() {
    document.getElementById('game-section').style.display = 'none';
    let resultSection = document.getElementById('result-section');
    resultSection.style.display = 'block';

    // Agregar la clase de animación de desvanecimiento al resultado
    resultSection.classList.add('fade-in');

    let endTime = new Date(); 
    let duration = endTime - startTime;

    let hours = Math.floor(duration / (1000 * 60 * 60));
    let minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((duration % (1000 * 60)) / 1000);

    let durationString = `${hours} horas, ${minutes} minutos, ${seconds} segundos`;

    let sortedScores = [...playerScores];
    let sortedPlayers = [...players];
    let results = [];

    sortedScores.sort((a, b) => b - a);
    sortedPlayers.sort((a, b) => {
        return playerScores[players.indexOf(b)] - playerScores[players.indexOf(a)];
    });

    let maxScore = sortedScores[0];
    let winner = sortedPlayers[0];

    for (let i = 0; i < sortedPlayers.length; i++) {
        results.push(`<p>${i + 1}º puesto: ${sortedPlayers[i]} - ${sortedScores[i]} puntos</p>`);
    }

    // Determinar quién ganó más apuestas y quién perdió más
    let maxBetsWon = Math.max(...betsWon);
    let minBetsLost = Math.min(...betsLost);

    let playerMaxBetsWon = players[betsWon.indexOf(maxBetsWon)];
    let playerMinBetsLost = players[betsLost.indexOf(minBetsLost)];

    // Mostrar los resultados
    let finalResults = 
        `<h3 class="zoom-in">¡Felicidades! El ganador es: ${winner} (${maxScore} puntos)</h3>
        ${results.join('')}
        <p>Duración del juego: ${durationString}</p>
        <p>Jugador que ganó más apuestas: ${playerMaxBetsWon} (${maxBetsWon} apuestas ganadas)</p>
        <p>Jugador que perdió más apuestas: ${playerMinBetsLost} (${minBetsLost} apuestas perdidas)</p>`;

    document.getElementById('final-results').innerHTML = finalResults;
}

function restartGame() {
    location.reload();
}

function correctData() {
    document.getElementById('input-section').style.display = 'block';
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'none';
}

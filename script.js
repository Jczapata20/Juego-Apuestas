let numPlayers, players = [], currentRound = 1, totalRounds = 12, playerScores = [], roundNames = [];
let betNumbers = [], betResults = [], roundsWon = [];  // Arreglos para guardar las apuestas, los resultados y las rondas ganadas

function startGame() {
    numPlayers = document.getElementById('numPlayers').value;

    if (numPlayers < 1) {
        alert("Por favor ingresa una cantidad válida de jugadores.");
        return;
    }

    // Pedir nombres de los jugadores
    players = [];
    for (let i = 0; i < numPlayers; i++) {
        const name = prompt(`Ingresa el nombre del jugador ${i + 1}:`);
        players.push(name);
        playerScores.push(0);
    }

    document.getElementById('input-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    
    // Crear el patrón de rondas
    roundNames = [];
    for (let i = 1; i <= 6; i++) roundNames.push(`Ronda ${i}`);
    roundNames.push("Ronda 6 (Sin espada)");
    for (let i = 5; i >= 1; i--) roundNames.push(`Ronda ${i}`);

    showRoundInfo();
}

function showRoundInfo() {
    document.getElementById('round-info').innerHTML = `<h3>${roundNames[currentRound - 1]}</h3>`;

    // Mostrar el campo para ingresar el número de apuesta antes de las puntuaciones
    document.getElementById('players-section').innerHTML = players.map((player, index) => `
        <div class="player-bet-container">
            <label for="bet-${index}" class="bet-label">${player} - Número de Apuesta: </label>
            <input type="number" id="bet-${index}" class="bet-input" placeholder="Número de Apuesta" min="0" required />
        </div>
    `).join('');

    // Agregar un botón para guardar las apuestas
    document.getElementById('players-section').innerHTML += `<button onclick="saveBets()" class="bet-button">Guardar Apuestas</button>`;
}

function saveBets() {
    // Guardar los números de apuesta de cada jugador
    betNumbers = [];
    for (let i = 0; i < numPlayers; i++) {
        const bet = document.getElementById(`bet-${i}`).value;
        if (bet === '' || isNaN(bet)) {
            alert(`Por favor, ingresa un número de apuesta válido para ${players[i]}.`);
            return;
        }
        betNumbers.push(parseInt(bet)); // Guardar el número de apuesta, permitiendo 0
    }

    // Mostrar los números de apuesta de forma llamativa
    let betList = `<h4 class="bet-title">Números de Apuesta:</h4><div class="bet-list">`;
    for (let i = 0; i < numPlayers; i++) {
        betList += `
            <div class="bet-item">
                <span class="bet-player">${players[i]}:</span>
                <span class="bet-number">${betNumbers[i]}</span>
            </div>
        `;
    }
    betList += `</div>`;

    document.getElementById('players-section').innerHTML = betList;

    // Después de mostrar las apuestas, mostrar las opciones para ganar la apuesta y rondas ganadas
    setTimeout(() => {
        document.getElementById('round-info').innerHTML = `<h3>${roundNames[currentRound - 1]}</h3>`; // Mostrar solo una vez el nombre de la ronda
        document.getElementById('players-section').innerHTML += players.map((player, index) => `
            <div>
                <label for="bet-result-${index}">${player} - ¿Ganó la apuesta?: </label>
                <select id="bet-result-${index}">
                    <option value="yes">Sí</option>
                    <option value="no">No</option>
                </select>
            </div>
            <div>
                <label for="rounds-won-${index}">${player} - ¿Cuántas rondas ganó?: </label>
                <input type="number" id="rounds-won-${index}" min="0" placeholder="Rondas ganadas" />
            </div>
        `).join('');
        document.getElementById('players-section').innerHTML += `<button onclick="applyResults()" class="result-button">Aplicar Resultados</button>`;
    }, 2000); // Esperar 2 segundos antes de mostrar las nuevas opciones
}

function applyResults() {
    // Inicializamos los arreglos para los resultados
    betResults = [];
    roundsWon = [];

    for (let i = 0; i < numPlayers; i++) {
        const betResult = document.getElementById(`bet-result-${i}`).value;
        const roundsWonValue = document.getElementById(`rounds-won-${i}`).value;

        // Verificar si las entradas son válidas
        if (roundsWonValue === '' || isNaN(roundsWonValue) || roundsWonValue < 0) {
            alert(`Por favor, ingresa un número válido de rondas ganadas para ${players[i]}.`);
            return;
        }

        // Guardar el resultado de la apuesta
        betResults.push(betResult);
        roundsWon.push(parseInt(roundsWonValue));

        // Actualizar los puntos en función de si ganó la apuesta
        if (betResult === 'yes') {
            playerScores[i] += 10; // Si ganó la apuesta, sumamos 10 puntos
        } else {
            playerScores[i] -= 10; // Si no ganó, restamos 10 puntos
        }

        // Sumar los puntos por las rondas ganadas (3 puntos por cada ronda)
        playerScores[i] += roundsWon[i] * 3;
    }

    // Mostrar los puntos actualizados
    updateScoresTable();

    // Pasar a la siguiente ronda
    if (currentRound < totalRounds) {
        currentRound++; // Aumenta la ronda actual
        showRoundInfo();
    } else {
        showResults();
    }
}

function updateScoresTable() {
    // Crear la tabla de puntuaciones
    let tableHTML = `
        <table border="1">
            <thead>
                <tr>
                    <th>Jugador</th>
                    <th>Puntuación Acumulada</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < numPlayers; i++) {
        tableHTML += `
            <tr>
                <td>${players[i]}</td>
                <td>${playerScores[i]}</td>
            </tr>
        `;
    }

    tableHTML += `
            </tbody>
        </table>
    `;

    // Mostrar la tabla
    document.getElementById('scores-table').innerHTML = tableHTML;
}

function showResults() {
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';

    let maxScore = Math.max(...playerScores);
    let winner = players[playerScores.indexOf(maxScore)];

    let results = players.map((player, index) => {
        return `<p>${player}: ${playerScores[index]} puntos</p>`;
    }).join('');

    document.getElementById('final-results').innerHTML = `
        <h3>Jugador con más puntos: ${winner} (${maxScore} puntos)</h3>
        ${results}
    `;
}

// Función para corregir (borrar) los puntajes de la ronda actual
function clearCurrentScores() {
    // Limpiar las puntuaciones de esta ronda (sin afectar el puntaje acumulado)
    for (let i = 0; i < numPlayers; i++) {
        document.getElementById(`score-${i}`).value = ''; // Borrar el campo de la entrada de puntuación
    }
}

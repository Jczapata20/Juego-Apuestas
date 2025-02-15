let numPlayers, players = [], currentRound = 1, totalRounds = 12, playerScores = [], roundNames = [];
let isDescending = false;

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
    document.getElementById('players-section').innerHTML = players.map((player, index) => `
        <div>
            <label for="score-${index}">${player}: </label>
            <input type="number" id="score-${index}" placeholder="Puntuación" min="0" max="100" />
        </div>
    `).join('');
}

function nextRound() {
    // Verificar si todos los campos de puntuación están llenos
    for (let i = 0; i < numPlayers; i++) {
        const score = document.getElementById(`score-${i}`).value;
        
        // Si el campo está vacío o no es un número válido, mostrar alerta
        if (score === '' || isNaN(score) || score < 0) {
            alert(`Por favor, ingresa una puntuación válida para ${players[i]}.`);
            return;
        }

        // Guardar las puntuaciones de esta ronda
        playerScores[i] += parseInt(score);
    }

    // Mostrar la tabla de puntuaciones después de cada ronda
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

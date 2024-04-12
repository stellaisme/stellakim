    let currentPlayer = 1;
    let player1Lives = 3;
    let player2Lives = 3;

    function startNewGame() {
        currentPlayer = 1;
        gameActive = true; //게임이 진행중임을 표시
        player1Lives = 3;
        player2Lives = 3;
        generateRandomEquation();
        updateLivesDisplay(); //플레이어 생명 수 화면에 표시하는 함수 호출
        updateCurrentPlayerDisplay(); //현재 플레이어 화면에 표시하는 함수 호출
        document.getElementById('player1-card-header').style.backgroundColor = 'green';
        document.getElementById('player2-card-header').style.backgroundColor = '';
        clearInputs(); 
    }

    function resetGame() {
        startNewGame(); //html에서 start을 누르면 게임이 시작되도록 하는 함수 호출
    }

    function generateRandomEquation() {
        const num1 = Math.floor(Math.random() * 10); //0-9사이의 숫자 랜덤 생성 (math.floor 사용해서 소수점 아래 버림)
        const num2 = Math.floor(Math.random() * 10); // *10은 math.random()이 생성한 숫자를 10배 확대 0.0-0.999 -> 0.0-9.999로 변환
        document.getElementById('equation').innerText = `${num1} + ${num2} = ?`; 
        window.correctAnswer = num1 + num2; //window = 브라우저 창 의미 객체, correctAnswer를 전역변수로 만들어서 접근성 올림
    }

    function updateCurrentPlayerDisplay() {
        document.getElementById('current-player-display').innerText = `Player ${currentPlayer} is playing.`;
    }

    function updateLivesDisplay() {
        const player1LivesDisplay = document.getElementById('Player1Lives');
        const player2LivesDisplay = document.getElementById('Player2Lives');
        player1LivesDisplay.innerHTML = '&hearts;'.repeat(player1Lives);
        player2LivesDisplay.innerHTML = '&hearts;'.repeat(player2Lives);
    }

    //두 플레이어의 input 값 모두 삭제
    function clearInputs() {
        document.getElementById('score').value = '';
        document.getElementById('score2').value = '';
    }

    function updateInput(number) {
        if (currentPlayer !== 1) return; //다른 플레이어가 버튼 입력하는 것 방지
        const inputField = document.getElementById('score'); //ID=score인 것 찾아서 inputfield에 저장
        inputField.value += number; //현재 값에 number로 받은 값 추가
    }

    function updateInput2(number) {
        if (currentPlayer !== 2) return;
        const inputField = document.getElementById('score2');
        inputField.value += number;
    }

    //플레이어의 enter키 활성화
    document.getElementById('player1Calculator').getElementsByClassName('enter')[0].onclick = function() {
        if (currentPlayer !== 1) return; //current player가 1이 아닐 경우 값을 받지 않고 반환
        checkAnswer(parseInt(document.getElementById('score').value, 10)); //parseInt = 값을 정수로 변환, 10은 값을 10진수로 해석하라는 것
    };

    document.getElementById('player2Calculator').getElementsByClassName('enter')[0].onclick = function() {
        if (currentPlayer !== 2) return;
        checkAnswer(parseInt(document.getElementById('score2').value, 10));
    };

    // 플레이어의 정답 확인
    function checkAnswer(answer) {
        if (answer === window.correctAnswer) { //정답이 맞으면 switch player
            switchPlayer();
        } else {
            if (currentPlayer === 1) {
                player1Lives--;
                if (player1Lives === 0) gameOver(1);
            } else {
                player2Lives--;
                if (player2Lives === 0) gameOver(2);
            }
            switchPlayer(); // 정답 여부와 상관없이 Switch player
        }
        generateRandomEquation();
        updateLivesDisplay();
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1; //current player가 1이면 2로 설정, 2면 1로 설정하라는 의미
        updateCurrentPlayerDisplay();
        clearInputs();
        // Update header colors
        document.getElementById('player1-card-header').style.backgroundColor = currentPlayer === 1 ? 'green' : ''; //current player가 1이면 녹색으로 아니면 배경색 제거
        document.getElementById('player2-card-header').style.backgroundColor = currentPlayer === 2 ? 'green' : '';
    }

    function gameOver(loserPlayer) {
        alert(`Game over! Player ${loserPlayer} has lost all hearts. Click 'New Game' to start over.`);
        gameActive = false;
        resetGame();
        document.getElementById('player1-card-header').style.backgroundColor = '';
        document.getElementById('player2-card-header').style.backgroundColor = '';
    }
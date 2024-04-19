    let currentPlayer = 1;
    let player1Lives = 3;
    let player2Lives = 3;
    let gameActive = false; //게임이 비활성상태

    window.onload = function() { //페이지가 모두 로드된 뒤에 코드 실행
        disableControls();  //게임 시작 전 비활성화
        document.getElementById('startButton').disabled = false; //시작버튼 활성화
    };

    function startNewGame() {
        if (!gameActive) {
            currentPlayer = 1;
            gameActive = true; //게임이 진행중임을 표시
            player1Lives = 3;
            player2Lives = 3;
            enableControls();
            generateRandomEquation();
            updateLivesDisplay(); //플레이어 생명 수 화면에 표시하는 함수 호출
            updateCurrentPlayerDisplay(); //현재 플레이어 화면에 표시하는 함수 호출
            document.getElementById('player1-card-header').style.backgroundColor = 'green';
            document.getElementById('player2-card-header').style.backgroundColor = '';
            clearInputs();
            document.getElementById('startButton').disabled = true; //게임 시작되면 start 버튼 비활성화
        }
    }

    function resetGame() {
        startNewGame();
        document.getElementById('startButton').disabled = true;
    }

    function generateRandomEquation() {
        const num1 = Math.floor(Math.random() * 10); //0-9사이의 숫자 랜덤 생성 (math.floor 사용해서 소수점 아래 버림)
        const num2 = Math.floor(Math.random() * 10); // *10은 math.random()이 생성한 숫자를 10배 확대 0.0-0.999 -> 0.0-9.999로 변환
        const operators = ['+', '-']; //operator 배열에 +, - 추가
        const operator = operators[Math.floor(Math.random() * operators.length)]; //operators.length = 2 -> 0.0 ~ 1.999까지 숫자 생성
        if (operator === '+') {
            document.getElementById('equation').innerText = `${num1} + ${num2} = ?`;
            window.correctAnswer = num1 + num2;
        } else {
            let max = Math.max(num1, num2);
            let min = Math.min(num1, num2);
            document.getElementById('equation').innerText = `${max} - ${min} = ?`;
            window.correctAnswer = max - min;
        }
    } 

    function updateCurrentPlayerDisplay() {
        document.getElementById('current-player-display').innerText = `Player ${currentPlayer} is playing.`;
    }

    function updateLivesDisplay() {
        const player1LivesDisplay = document.getElementById('Player1Lives');
        const player2LivesDisplay = document.getElementById('Player2Lives');
        player1LivesDisplay.innerHTML = '&hearts;'.repeat(player1Lives > 0 ? player1Lives : 1); //조건 ? 참 : 거짓
        player2LivesDisplay.innerHTML = '&hearts;'.repeat(player2Lives > 0 ? player2Lives : 1); //생명 수가 0보다 크면 해당 수만큼 하트 모양 반복, 0 이하이면 최소 1개의 하트 보이도록 설정
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
        if (answer === window.correctAnswer) {
            switchPlayer(); //정답이 맞으면 switch player
        } else {
            if (currentPlayer === 1) {
                player1Lives--;
                if (player1Lives === 0) gameOver(1);
            } else {
                player2Lives--;
                if (player2Lives === 0) gameOver(2);
            }
            clearInputs();
        }
        generateRandomEquation();
        updateLivesDisplay();
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateCurrentPlayerDisplay();
        clearInputs();
        document.getElementById('player1-card-header').style.backgroundColor = currentPlayer === 1 ? 'green' : '';
        document.getElementById('player2-card-header').style.backgroundColor = currentPlayer === 2 ? 'green' : '';
    }

    function gameOver(loserPlayer) {
        alert(`Game over! Player ${loserPlayer} has lost all hearts. Click 'New Game' to start over.`);
        gameActive = false;
        disableControls();
        document.getElementById('startButton').disabled = true;
        document.getElementById('player1-card-header').style.backgroundColor = '';
        document.getElementById('player2-card-header').style.backgroundColor = '';
    }

    function disableControls() {
        const buttons1 = document.getElementById('player1Calculator').getElementsByTagName('button'); //player 1 caculator 버튼 전부 선택
        const buttons2 = document.getElementById('player2Calculator').getElementsByTagName('button'); //player 2 caculator 버튼 전부 선택
        for (let button of buttons1) {
            button.disabled = true;
        }
        for (let button of buttons2) {
            button.disabled = true;
        }
        document.getElementById('score').readOnly = true; //읽기 전용으로 input란에 입력 막기
        document.getElementById('score2').readOnly = true;
    }

    function enableControls() {
        const buttons1 = document.getElementById('player1Calculator').getElementsByTagName('button');
        const buttons2 = document.getElementById('player2Calculator').getElementsByTagName('button');
        for (let button of buttons1) {
            button.disabled = false;
        }
        for (let button of buttons2) {
            button.disabled = false;
        }
        document.getElementById('score').readOnly = false;
        document.getElementById('score2').readOnly = false;
    }

var sec = 0;
var min = 0;
var timer = null;
var pomodoros = 0;
var descansos = 0;
var descansosLargos = 0;
var esPomodoro = false;
var esDescanso = false;
var esDescansoLargo = false;
var contDescansos = 0;
var contPomodoros = 0;
var clock = null;

function Start() {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(Timer, 1000);
  clock = document.getElementById('clock');
  End();
}

function End() {
  if (esPomodoro === true) {
    pomodoros++;
    contPomodoros++;
  } else if (esDescanso === true) {
    descansos++;
    contDescansos++;
  } else if (esDescansoLargo === true) {
    descansosLargos++;
  }

  sec = 0;
  if (esDescansoLargo) {
    min = 25;
    esPomodoro = true;
    esDescanso = false;
    esDescansoLargo = false;
    document.getElementById('evento').innerHTML = 'Pomodoro';
  } else if (contDescansos == 2 && contPomodoros == 3) {
    contDescansos = 0;
    contPomodoros = 0;
    min = 15;
    esPomodoro = false;
    esDescanso = false;
    esDescansoLargo = true;
    document.getElementById('evento').innerHTML = 'Descanso largo';
  } else if (esPomodoro) {
    min = 5;
    esPomodoro = false;
    esDescanso = true;
    esDescansoLargo = false;
    document.getElementById('evento').innerHTML = 'Descanso';
  } else {
    min = 25;
    esPomodoro = true;
    esDescanso = false;
    esDescansoLargo = false;
    document.getElementById('evento').innerHTML = 'Pomodoro';
  }
  document.getElementById('pomodoros').innerHTML = pomodoros + ' pomodoros';
  document.getElementById('descansos').innerHTML = descansos + ' descansos';
  document.getElementById('descansosLargos').innerHTML = descansosLargos + ' descansos largos';
}

function Timer() {
  sec--;

  if (sec == -1) {
    min--;
    sec = 59
  }

  if (min == 0 && sec == 0) {
    Start();
  }

  ShowClock();
}

function ShowClock() {
  clock.innerHTML =
    `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
}

function Stop() {
  clearInterval(timer);
  sec = 0;
  min = 0;
  ShowClock();
}

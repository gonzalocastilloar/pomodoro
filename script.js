var sec = 0;
var min = 0;
var timer = null;
var focos = 0;
var descansos = 0;
var descansosLargos = 0;
var esFoco = false;
var esDescanso = false;
var esDescansoLargo = false;
var contDescansos = 0;
var contFocos = 0;
var isRunning = false;
var isFirstRun = true;

// DOMS
var clockDom = null;
var button1Dom = false;
var button2Dom = false;

function StartButton() {
  if (isRunning) {
    clearInterval(timer);
    ShowClock();
    button1Dom.innerHTML = 'Continuar';
    isRunning = false;
  } else {
    isRunning = true;
    button1Dom.innerHTML = 'Pausar';
    if (isFirstRun) {
      StartFoco();
      isFirstRun = false;
    }

    Start();
  }
  button1Dom.classList.toggle('active');
  button2Dom.classList.toggle('active');
}

function Start() {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(Timer, 1000);
  document.getElementById('button2').classList.remove('locked');
}

function ShowClock() {
  clockDom.innerHTML =
    `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
}

function Next() {
  End();
  ShowClock();
  ShowCounters();
}

function Stop() {
  clearInterval(timer);
  isRunning = false;
  button1Dom.innerHTML = 'Iniciar';
  button1Dom.classList.remove('active');
  button2Dom.classList.remove('active');
  // sec = 0; min = 0;
  ShowClock();
  RestartDoms();
  document.getElementById('button2').classList.add('locked');
}

function RestartDoms() {
  document.getElementById('descansos').classList.remove('active');
  document.getElementById('descansosLargos').classList.remove('active');
  document.getElementById('focos').classList.remove('active');
}


function End() {
  if (esFoco === true) {
    focos++;
    contFocos++;
  } else if (esDescanso === true) {
    descansos++;
    contDescansos++;
  } else if (esDescansoLargo === true) {
    descansosLargos++;
  }

  document.getElementById('descansos').classList.remove('active');
  document.getElementById('descansosLargos').classList.remove('active');
  document.getElementById('focos').classList.remove('active');

  sec = 0;
  if (esDescansoLargo) {
    StartFoco();
  } else if (contDescansos == 2 && contFocos == 3) {
    StartDescansoLargo();
  } else if (esFoco) {
    StartDescanso();
  } else {
    StartFoco();
  }
  ShowCounters();
  Save();
}

function ShowCounters() {
  document.getElementById('focos').innerHTML = focos + ' focos';
  document.getElementById('descansos').innerHTML = descansos + ' descansos';
  document.getElementById('descansosLargos').innerHTML = descansosLargos + ' descansos largos';
}

function StartFoco() {
  min = 25;
  esFoco = true;
  esDescanso = false;
  esDescansoLargo = false;
  document.getElementById('focos').classList.add('active');
  ShowNotification('Pomodoro', 'Es hora de volver al trabajo.');
}

function StartDescanso() {
  min = 5;
  esFoco = false;
  esDescanso = true;
  esDescansoLargo = false;
  document.getElementById('descansos').classList.add('active');
  ShowNotification('Pomodoro', 'Tomate una pausa.');
}

function StartDescansoLargo() {
  contDescansos = 0;
  contFocos = 0;
  min = 15;
  esFoco = false;
  esDescanso = false;
  esDescansoLargo = true;
  document.getElementById('descansosLargos').classList.add('active');
  ShowNotification('Pomodoro', '¡A descansar! tomate unos 15 minutos.');
}

function Timer() {
  sec--;

  if (sec == -1) {
    min--;
    sec = 59
  }

  if (min == 0 && sec == 0) {
    End();
  }

  ShowClock();
}

function Save() {
  let obj = {
    sec,
    min,
    focos,
    descansos,
    descansosLargos,
    esFoco,
    esDescanso,
    esDescansoLargo,
    contDescansos,
    contFocos
  };

  window.localStorage.setItem('history', JSON.stringify(obj));
}

function Reset() {
  if (confirm("¿Seguro desea eliminar todos los registros?")) {
    button1Dom.innerHTML = 'Iniciar';
    isFirstRun = true;
    isRunning = false;
    sec = 0;
    min = 0;
    focos = 0;
    descansos = 0;
    descansosLargos = 0;
    esFoco = false;
    esDescanso = false;
    esDescansoLargo = false;
    contDescansos = 0;
    contFocos = 0;
    ShowClock();
    ShowCounters();
    Save();
    RestartDoms();
    clearInterval(timer);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // set doms
  clockDom = document.getElementById('clock');
  button1Dom = document.getElementById('button1');
  button2Dom = document.getElementById('button2');

  // load history
  let data = window.localStorage.getItem('history');

  if (data) {
    data = JSON.parse(data);
    sec = data.sec;
    min = data.min;
    focos = data.focos;
    descansos = data.descansos;
    descansosLargos = data.descansosLargos;
    esFoco = data.esFoco;
    esDescansoLargo = data.esDescansoLargo;
    esDescanso = data.esDescanso;
    contDescansos = data.contDescansos;
    contFocos = data.contFocos;
  }
  ShowClock();

  // ACTIVACION DE NOTIFICACION
  Notification.requestPermission().then(permiso => {
    if (permiso === "granted") {
      console.log("¡Permiso concedido!");
    }
  });
})

function ShowNotification(_title, _text) {
  const opciones = {
    body: _text,
    icon: "https://yumserver.com/pomodoro/icon.png", // Icono pequeño
    image: "https://yumserver.com/pomodoro/icon.png", // Imagen principal
    badge: "https://yumserver.com/pomodoro/icon.png" // Icono de barra de estado (Android)
  };

  new Notification(_title, opciones);
}

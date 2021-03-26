var emailUser = "";

function registrar (){
    let email = document.getElementById('emailRegistro').value;
    let contrasena = document.getElementById('contrasenaRegistro').value;

    firebase.auth().createUserWithEmailAndPassword(email, contrasena)
    .then((user) => {
      verificacion();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(error.message);
      // ..
    });

}

function iniciarSesion(){
    let email = document.getElementById('emailInicio').value;
    let contrasena = document.getElementById('contrasenaInicio').value;

    firebase.auth().signInWithEmailAndPassword(email, contrasena)
    .then((user) => {
        // Signed in
        // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(error.message)
    });

}

function observador (){
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          emailUser = user.email;
          aparece();
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
}

observador();

function aparece(){
  let contenido = document.getElementById('contenido');
  contenido.innerHTML = `
  <div class="container mt-5">
    <div class="jumbotron" style="background-color: transparent !important">
        <p class="lead">Hola ${emailUser}</p>
      <a onclick = "cerrar()" class="btn btn-primary btn-lg" role="button" style="float: right">Cerrar sesión</a>
      <a class="btn btn-light btn-lg mr-3" role="button" style="float: right" href = "http://localhost/Farebase/WebContent/alta.html">Dar de alta</a>
    </div>
  </div>
  `;
  $('#inicio').hide();
  $( '#login' ).hide();
  $( '#registro' ).hide();
}

function cerrar(){
  firebase.auth().signOut()
  .then(function(){
    let contenido = document.getElementById('contenido');
    contenido.innerHTML = ``;
    $('#inicio').show();
    $( '#login' ).show();
    $( '#registro' ).show();
  })
  .catch(function(error){
    console.log(error);
  })
}

function verificacion(){
  var user = firebase.auth().currentUser;

  user.sendEmailVerification().then(function() {
    // Email sent.
  }).catch(function(error) {
    // An error happened.
  });
}

//video

// Get the video
var video = document.getElementById("myVideo");

// Get the button
var btn = document.getElementById("myBtn");

// Pause and play the video, and change the button text
function myFunction() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    btn.innerHTML = "Play";
  }
}

// Initialize Cloud Firestore through Firebase

firebase.initializeApp({
    apiKey: "AIzaSyBaoajjby-Xf2JJPtg_jBpwRqBDPs-sTtg",
    authDomain: "eduardo-2e350.firebaseapp.com",
    projectId: "eduardo-2e350",
    storageBucket: "eduardo-2e350.appspot.com",
    messagingSenderId: "92943753930",
    appId: "1:92943753930:web:51c7bcc5630b2c0e2bca33",
    measurementId: "G-F7NBV4BHZY"
});
  
var db = firebase.firestore();

//Agregar usuarios

function guardar(){
    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let fecha = document.getElementById('fecha').value;
    if(nombre == "" && apellido == "" && fecha == ""){
        alert("Agerega los datos")
    }else{
        db.collection("users").add({
            first: nombre,
            last: apellido,
            born: fecha
        })
        .then((docRef) => {
          nombre = document.getElementById('nombre').value = "";
          apellido = document.getElementById('apellido').value = "";
          fecha = document.getElementById('fecha').value = "";
          //console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }
}

//Leer documentos 

let tabla = document.getElementById('tabla');
db.collection("users").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()}`);
        tabla.innerHTML += `
        <tr>
            <th scope="row">${doc.id}</th>
            <td>${doc.data().first}</td>
            <td>${doc.data().last}</td>
            <td>${doc.data().born}</td>
            <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
            <td><button class="btn btn-warning" onclick="editar('${doc.id}', '${doc.data().first}', '${doc.data().last}', '${doc.data().born}')">Editar</button></td>
        </tr>
        `
    });
});

//Borrar datos

function eliminar (id){
    db.collection("users").doc(id).delete().then(() => {
        //console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

//Actualizar un documento 

function editar(id, nombre, apellido, fecha){

    nombre = document.getElementById('nombre').value = nombre;
    apellido = document.getElementById('apellido').value = apellido;
    fecha = document.getElementById('fecha').value = fecha;

    var boton = document.getElementById('boton');
    boton.innerHTML = 'Editar';

    boton.onclick = function(){
        var usuarioRef = db.collection("users").doc(id);

        let nombre = document.getElementById('nombre').value;
        let apellido = document.getElementById('apellido').value;
        let fecha = document.getElementById('fecha').value;

        // Set the "users" field of the inf
        return usuarioRef.update({
            first: nombre,
            last: apellido,
            born: fecha
        })
        .then(() => {
            console.log("Document successfully updated!");
            boton.innerHTML = 'Guadar';
            boton.onclick=function(){
                guardar();
            }
            nombre = document.getElementById('nombre').value = "";
            apellido = document.getElementById('apellido').value = "";
            fecha = document.getElementById('fecha').value = "";
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }
    
}


/*Estos metodos son extras a lo que se utiliza en un CRUD pero de igual manera
es bueno saber las herramientas con las que cuenta  FIREBASE*/


//Agegar un nuevo campo a nuestra coleccion.
var cityRef = db.collection('users').doc('id');

var setWithMerge = cityRef.set({
    capital: true
}, { merge: true });

//Actualiza un documento
//Para actualizar algunos campos de un documento sin reemplazarlo por completo, usa el método update():

var washingtonRef = db.collection("cities").doc("DC");

// Set the "capital" field of the city 'DC'
return washingtonRef.update({
    capital: true
})
.then(() => {
    console.log("Document successfully updated!");
})
.catch((error) => {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
});

//Marca de tiempo del servidor
//Puedes configurar un campo en tu documento para una marca de tiempo de servidor que haga un seguimiento de cuando el servidor recibe la actualización.

var docRef = db.collection('objects').doc('some-id');

// Update the timestamp field with the value from the server
var updateTimestamp = docRef.update({
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
});


//Actualiza los campos en objetos anidados
//Si tu documento contiene objetos anidados, puedes usar la notación de puntos para hacer referencia a los campos anidados dentro del documento cuando llames a update():


// Create an initial document to update.
var frankDocRef = db.collection("users").doc("frank");
frankDocRef.set({
    name: "Frank",
    favorites: { food: "Pizza", color: "Blue", subject: "recess" },
    age: 12
});

// To update age and favorite color:
db.collection("users").doc("frank").update({
    "age": 13,
    "favorites.color": "Red"
})
.then(() => {
    console.log("Document successfully updated!");
});

//La notación de puntos te permite actualizar un solo campo anidado sin reemplazar otro campo anidado. Si actualizas un campo anidado sin notación de puntos, reemplazarás todo el campo del mapa, por ejemplo:

// Create our initial doc
db.collection("users").doc("frank").set({
    name: "Frank",
    favorites: {
      food: "Pizza",
      color: "Blue",
      subject: "Recess"
    },
    age: 12
  }).then(function() {
    console.log("Frank created");
  });
  
  // Update the doc without using dot notation.
  // Notice the map value for favorites.
  db.collection("users").doc("frank").update({
    favorites: {
      food: "Ice Cream"
    }
  }).then(function() {
    console.log("Frank food updated");
  });
  
  /*
  Ending State, favorite.color and favorite.subject are no longer present:
  /users
      /frank
          {
              name: "Frank",
              favorites: {
                  food: "Ice Cream",
              },
              age: 12
          }
   */

//Actualiza elementos de un array
//Si tu documento contiene un campo de array, puedes usar arrayUnion() y arrayRemove() para agregar y quitar elementos. Con arrayUnion(), se pueden agregar elementos a un array, pero solo si aún no están presentes. arrayRemove() permite quitar todas las instancias de cada elemento dado.

var washingtonRef = db.collection("cities").doc("DC");

// Atomically add a new region to the "regions" array field.
washingtonRef.update({
    regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
});

// Atomically remove a region from the "regions" array field.
washingtonRef.update({
    regions: firebase.firestore.FieldValue.arrayRemove("east_coast")
});

/*Incrementa un valor numérico
Puedes aumentar o disminuir un valor de campo numérico como se muestra en el 
siguiente ejemplo. Una operación de incremento aumenta o disminuye 
el valor actual del campo según la cantidad dada. Si el campo no existe o 
si el valor actual del campo no es uno numérico, la operación configura el 
campo en el valor dado.*/


var washingtonRef = db.collection('cities').doc('DC');

// Atomically increment the population of the city by 50.
washingtonRef.update({
    population: firebase.firestore.FieldValue.increment(50)
});

/*
Las operaciones de incremento son útiles para implementar contadores, 
pero ten en cuenta que puedes actualizar un documento individual solo una vez por segundo. 
Si necesitas actualizar tu contador por encima de esta frecuencia, 
consulta la página Contadores distribuidos.
*/


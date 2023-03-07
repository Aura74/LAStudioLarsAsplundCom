// Här har jag samlat alla Selectors, +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// QuerySelector retunerar det första elementet i ett dokument 
// som matchar selectorn, i detta fall classen
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");

// Här har jag samlat Event Listners ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Denna hör till save-delen
document.addEventListener("DOMContentLoaded", getTodos);// vad denna gör är att om allt laddas ok så kör funktopnen getTodos

// Här läggs en eventlisener till knappen addtodo, när vi klickar så addar vi en todo-funktion
todoButton.addEventListener("click", addTodo);

// Denna hör till ta-bort knappen och avklarat knappen
todoList.addEventListener("click", deleteTodo); //++++++++++++++ kolla deleteTodo (deleteCheck)

// Här har jag samlat alla Funktioner +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function addTodo(e) { // e event
  // hindrar form från att submitta hela tiden när du skriver in i todo
  e.preventDefault();

  // Todo DIV, här skapas div:en som skapas på html--sidan i todo-list
  // createElement() metoden kan använas för att skapahtml-element via tag-namn, i detta fall en div
  const todoDiv = document.createElement("div");

  // classlist är readonly, lägger här till classen todo på diven
  todoDiv.classList.add("todo");

  // Skapa LI - här skapas <li> listan, här används createElement för att skapa en <li>
  const newTodo = document.createElement("li");

  // Värdet jag vill ha i den, värdet kommer ifrån todoInput
  newTodo.innerText = todoInput.value;

  //Spara todoInput.value till local storage som kallas för saveLocalTodos. 
  saveLocalTodos(todoInput.value);

  // Värdet jag vill ha i den, värdet kommer ifrån todoInput
  newTodo.classList.add("todo-item");
  // Grabba tododiv och stoppa in newTodo in i diven todoDiv vi skapade lite högre upp i koden
  todoDiv.appendChild(newTodo);

  // nollställer rutan todoInput, värdet blir inget ""
  todoInput.value = "";

  // Skapar här en klart-knapp, createElement skapar en <button>
  const completedButton = document.createElement("button");

  // infogar här en ikon in i klar-knappen
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;

  // tilldelar en class till klar-knappen
  completedButton.classList.add("complete-btn");

  // Ser till att klar-knappen hamnar i diven todoDiv
  todoDiv.appendChild(completedButton);

  // Skapar här en delete-knapp
  const trashButton = document.createElement("button");

  // infogar här en ikon i delete-knappen
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;

  // tilldelar en class till delete-knappen
  trashButton.classList.add("trash-btn");

  // ser till att delete-knappen hamnar i diven todoDiv
  todoDiv.appendChild(trashButton);

  // attach slutgiltliga Todo, nu ska vi få in två knappar, en <div> och en <li> in in <ul> todo-list 
  todoList.appendChild(todoDiv);
}

// Funktionen som tar bort aktivitet.
function deleteTodo(e) {
  // Grabbar det som du klickar på, det kan vbara vad som helst
  const item = e.target;

  // Ta bort en todo aktivitet, om item är lika som "trash-btn"  
  if (item.classList[0] == "trash-btn") {

    // går upp till parent elementet för annans deletar vi bara knappen, hela rutan och bägge knapparna ska bort
    // e.target.parentElement.remove();
    const todo = item.parentElement;

    // En snygg animation, skapar en class som kallas för fall, 
    // och i css:en ser vi att det blir en - transform: translateY(8rem) trycker ner den med 8 rem
    // och en rotate(20deg); med opacity: 0;
    todo.classList.add("fall");

    //På slutet
    removeLocalTodos(todo);

    // vi animerar ut händelsen sedan tas det bort, lyssnar efter transitionend, väntar på att transition är klar 
    // och sedan körs funktionen och det tas bort
    todo.addEventListener("transitionend", e => {
    // här tas det bort
      todo.remove();
    });
  }

  // check mark // om du greppar tag i något som är lika som "complete-btn"
  // då körs funktionen
  if (item.classList[0] == "complete-btn") {

  // går till parent-elemet som i delete-knappen, ska markera allt inte bara knappen
    const todo = item.parentElement;

    // skapar en klass som heter completed här lägger vi på en toggel för completed, 
    //kolla i css:en så syns där att en linje kommer att dras över texten text-decoration: line-through;
    // knapparna och rutan och texten blir mörkare - opacity: 0.5; 
    todo.classList.toggle("completed");
    console.log(todo); //ska inte vara här egentligen
  }
}


// ********************* Nästa del, spara till local storage*******************************************************
// En fuktion för save
function saveLocalTodos(todo) {
  // kollar här om finns det några todos redan
  let todos;
  if (localStorage.getItem("todos") === null) { // om det inte finns skapa en tom array
    todos = [];// här är arrayen som nu är tom
  } else {// annars så används json som skapare en array
    // hämtar det som liger i textfilen och hämtar tillbaka det, gör det till en array, parsar den tillbaka.
    // parse program som analyserar en sträng av tecken, 
    //delar upp dem i funk­tion­ella delar och inordnar delarna i en detaljerad struktur enligt ett regelsystem
    todos = JSON.parse(localStorage.getItem("todos"));
  }// The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by 
  //the string. An optional reviver function can be provided to perform a transformation on the resulting object before it is returned.
  todos.push(todo);// ska nu pusha in det i todos, nedan till todo-arrayen
  // tillbaka till local storage
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Funktionen som tar bort vissa enskilda todos
function removeLocalTodos(todo) {// kollar först om det finns något där.
  let todos;
  if (localStorage.getItem("todos") === null) { // om det är null
    todos = []; // skapa då en tom array
  } else {// annars 
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  // letar rätt på den innre texten inte div men vad som finns i <li>
  const todoIndex = todo.children[0].innerText;// hittar här index-nummret
  // ska nu splica arrayen, dela upp, så man kan ta bort i mitten av arrayen om man vill
  todos.splice(todos.indexOf(todoIndex), 1); // 1 är ett element
  // sänder tillbaka till local storage, JSON.stringify, konverterar till json, 
  // json är en string, local storage kan bara ha data som han göras om till string 
  localStorage.setItem("todos", JSON.stringify(todos));
}

// funktionen getTodos 
function getTodos() {
  let todos; // kolla om det finns 
  if (localStorage.getItem("todos") == null) {
    todos = []; // är den tom
  } else { // annars
    todos = JSON.parse(localStorage.getItem("todos")); // json dler uppsträngen so är sparad
  }// lite reperis från uppefrån med lite ändringar
  todos.forEach(function (todo) { // här kallas funktionen todo

    // Skapa todo div:en
    const todoDiv = document.createElement("div"); // skapar elementet <div>
    todoDiv.classList.add("todo");

    // Skapa listan
    const newTodo = document.createElement("li"); // skapar elementet <li>
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item"); // lägger till classen till listan
    todoDiv.appendChild(newTodo);
    todoInput.value = ""; // Värdet blir inget ""

    // Skapa klar-knappen
    const completedButton = document.createElement("button"); // skapar elementet <button>
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;  // ikonen från fontawesome
    completedButton.classList.add("complete-btn"); // lägger till classen till knappen
    todoDiv.appendChild(completedButton);

    // Skapa delete-knappen
    const trashButton = document.createElement("button"); // skapar elementet <button>
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`; // ikonen från fontawesome
    trashButton.classList.add("trash-btn"); // lägger till classen till knappen
    todoDiv.appendChild(trashButton);

    //Lägger nu till todoDiv
    todoList.appendChild(todoDiv);
  });
}
const avengers = db.collection("Avengers");
const storageRef = firebase.storage().ref();
const imagesRef = storageRef.child("images");

let myList = document.getElementById("my-list");
let myForm = document.getElementById("my-form");
let showCase = document.getElementById("showcase");
let image = document.getElementById("image");

function createListItems(doc) {
  let li = document.createElement("li");
  let name = document.createElement("h1");
  let alias = document.createElement("h5");
  let age = document.createElement("div");
  let remove = document.createElement("btn");

  li.setAttribute("data-id", doc.id);
  li.classList.add("list-group-item");
  remove.classList.add("btn", "btn-danger", "my-2");
  age.classList.add("lead");

  name.textContent = doc.data().Name;
  alias.textContent = `Alias: ${doc.data().Alias}`;
  age.textContent = `Age: ${doc.data().Age}`;
  remove.innerText = "Delete";
  li.appendChild(name);
  li.appendChild(alias);
  li.appendChild(age);
  li.appendChild(remove);

  myList.appendChild(li);

  remove.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    avengers.doc(id).delete();
  });
}

avengers.orderBy("Name").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();

  changes.forEach((change) => {
    console.log(change.doc.data());

    if (change.type == "added") {
      createListItems(change.doc);
    } else if (change.type == "removed") {
      let li = myList.querySelector("[data-id=" + change.doc.id + "]");
      myList.removeChild(li);
    }
  });
});

myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  avengers.add({
    Name: myForm.name.value,
    Alias: myForm.alias.value,
    Age: myForm.age.value,
  });
  myForm.name.value = "";
  myForm.alias.value = "";
  myForm.age.value = "";
});

let files = [];
image.addEventListener("change", (e) => {
  files = e.target.files;
});

function uploadPic() {
  for (let file of files) {
    let uploadTask = storageRef.child("images/" + file.name).put(file);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
        if (progress==100) {
            displayAlert(1);}
      }
      
    );
    
  }
  
}

function createImageTag(url) {
  let img = document.createElement("img");
  let col = document.createElement("div");
  let remove = document.createElement("btn");

  img.setAttribute("src", url);
  img.setAttribute("width", "300px");

  remove.classList.add("btn", "btn-danger", "my-2");

  col.setAttribute("data-url", url);
  col.classList.add("col-md");
  remove.innerText = "Delete";

  col.appendChild(img);
  col.appendChild(remove);

  showCase.appendChild(col);

  remove.addEventListener("click", () => {
    let fileRef = storage.refFromURL(url);
    fileRef
      .delete()
      .then(() => {
        setTimeout(displayAlert(0), 2000);
      })
  });
}

// Find all the prefixes and items.
imagesRef.listAll().then((res) => {
  res.items.forEach((itemRef) => {
    itemRef.getDownloadURL().then((url) => {
      createImageTag(url);
    });
  });
});

function displayAlert(res) {
  myAlert = document.createElement("div");
  myAlert.classList.add("alert");

  switch (res) {
    case 1:
      myAlert.classList.add("alert-success");
      myAlert.innerText = "Added Image Successfuly, Refresh to see effect.";
      break;
    case 0:
      myAlert.classList.add("alert-warning");
      myAlert.innerText = "Image Was Deleted, Refresh to see effect.";
      break;

    default:
        myAlert.classList.add("alert-danger");
      myAlert.innerText = "An Error Occured.";
      break;
  }
  showCase.insertAdjacentElement("afterbegin", myAlert);
}

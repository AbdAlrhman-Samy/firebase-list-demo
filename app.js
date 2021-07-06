const avengers = db.collection("Avengers");

let myList = document.getElementById("my-list");
let myForm = document.getElementById("my-form");

function createListItems(doc) {

    let li = document.createElement('li')
    let name = document.createElement('h1');
    let alias = document.createElement('h5');
    let age = document.createElement('div');
    let remove = document.createElement('btn');

    
    li.setAttribute('data-id', doc.id);
    li.classList.add('list-group-item')
    remove.classList.add('btn', 'btn-danger', 'my-2')
    age.classList.add('lead')

    name.textContent = doc.data().Name;
    alias.textContent = `Alias: ${doc.data().Alias}`;
    age.textContent = `Age: ${doc.data().Age}`;
    remove.innerText = 'Delete'
    li.appendChild(name);
    li.appendChild(alias);
    li.appendChild(age);
    li.appendChild(remove);


    myList.appendChild(li);

    remove.addEventListener('click', (e)=>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        avengers.doc(id).delete();
    })
}

avengers.orderBy('Name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            createListItems(change.doc);
        } else if (change.type == 'removed'){
            let li = myList.querySelector('[data-id=' + change.doc.id + ']');
            myList.removeChild(li);
        }
    });
});

// avengers.get().then(
//     (snapshot)=>{
//         snapshot.docs.forEach((doc)=>{
//             console.log(doc.data());
//             createListItems(doc)
//         })
//     }
// )

myForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    avengers.add({
        Name: myForm.name.value,
        Alias: myForm.alias.value,
        Age: myForm.age.value
    });
    myForm.name.value = '';
    myForm.alias.value = '';
    myForm.age.value = '';

})
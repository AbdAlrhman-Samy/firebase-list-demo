var firebaseConfig = {
    apiKey: "AIzaSyCs2cZ7AxYt64PtouDiGJmHRqhYw5cWV6w",
    authDomain: "team-blue-1.firebaseapp.com",
    projectId: "team-blue-1",
    storageBucket: "team-blue-1.appspot.com",
    messagingSenderId: "269511525096",
    appId: "1:269511525096:web:bb9ce9b8279661e7277f5d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const db = firebase.firestore();
db.settings({timestampsInSnapshot : true});

const storage = firebase.storage();

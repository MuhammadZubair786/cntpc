// const firebaseConfig = {
//     apiKey: "AIzaSyAk8zCJcRcPkjTb3_gmSPGB5jDp_CW-l3U",
//     authDomain: "vh-1-5ed7e.firebaseapp.com",
//     projectId: "vh-1-5ed7e",
//     storageBucket: "vh-1-5ed7e.appspot.com",
//     messagingSenderId: "549792424345",
//     appId: "1:549792424345:web:51e6d49e75280494f53308",
//     measurementId: "G-WRSZ71C786"
// };


// firebase.initializeApp(firebaseConfig);


// let db = firebase.firestore();


const firebaseConfig = {
    apiKey: "AIzaSyAV77t3dE8Upt-gKmPgczplnECJJyiBVZQ",
    authDomain: "cntpc-30e03.firebaseapp.com",
    projectId: "cntpc-30e03",
    storageBucket: "cntpc-30e03.appspot.com",
    messagingSenderId: "287487416783",
    appId: "1:287487416783:web:4956ffdcb8b245c66b5aba",
    measurementId: "G-HLRB802GDD"
  };


firebase.initializeApp(firebaseConfig);


let db = firebase.firestore();


let orgID = localStorage.getItem('orgID');
let doctorID = localStorage.getItem('docID');

console.log(orgID);
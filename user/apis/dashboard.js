async function getData(){


// Query the collection to get the latest updated document
const latestSnapshot = await db.collection("orders")
                              .limit(1)
                              .get();

if (!latestSnapshot.empty) {
    const latestDocument = latestSnapshot.docs[0].data();
    console.log("Latest updated data:", latestDocument);
    document.getElementById("order_name").innerText = latestDocument.carName
} else {
    console.log("No documents found in the collection.");
}
}
getData()
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVZjFSvGMZ5v5ao7f6orIHDFPmweaaWVw",
  authDomain: "community-care-4be6a.firebaseapp.com",
  projectId: "community-care-4be6a",
  storageBucket: "community-care-4be6a.firebasestorage.app",
  messagingSenderId: "908684288564",
  appId: "1:908684288564:web:91e7a4021c8472741a2061",
  measurementId: "G-LNPK94FCGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Register user

function registerUser(e) {

  e.preventDefault()

  const name = document.getElementById("regName").value
  const email = document.getElementById("regEmail").value
  const pass = document.getElementById("regPass").value

  const user = { name, email, pass }

  localStorage.setItem("user", JSON.stringify(user))

  alert("Account created")

}


function loginUser(e) {

  e.preventDefault()

  const email = document.getElementById("email").value
  const pass = document.getElementById("password").value

  const user = JSON.parse(localStorage.getItem("user"))

  if (user && user.email === email && user.pass === pass) {

    window.location = "dashboard.html"

  } else {

    alert("Invalid login")

  }

}


// submit help request

async function submitRequest(e) {

  e.preventDefault()

  const request = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    location: document.getElementById("location").value,
    type: document.getElementById("type").value,
    problem: document.getElementById("problem").value,
    time: new Date().toLocaleString()
  }

  try {

    await addDoc(collection(db, "requests"), request)

    alert("Request sent successfully")

  } catch (err) {

    alert("Error submitting request")
    console.log(err)

  }

}



// show requests on dashboard

async function loadRequests() {

  const querySnapshot = await getDocs(collection(db, "requests"));

  const container = document.getElementById("requests")
  let map;

  if (document.getElementById('map')) {
    map = L.map('map').setView([22.5726, 88.3639], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userMarker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        userMarker.bindPopup("<b>Your Location</b>").openPopup();
        map.setView([position.coords.latitude, position.coords.longitude], 13);
      });
    }
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    // Add to Map if coordinates exist
    if (map && data.location) {
      const coords = data.location.split(',').map(c => parseFloat(c.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        L.marker(coords).addTo(map).bindPopup(`<b>${data.type} Request</b><br>${data.name}`);
      }
    }

    const card = document.createElement("div");
    card.className = "requestCard";

    let labelHtml = data.label ? `<span style="background:#e8f5e9; color:#2e7d32; padding:2px 6px; border-radius:4px; font-size:11px; margin-right:8px;">${data.label}</span>` : '';
    let address = data.fullAddress || data.location;
    let contact = data.receiverName ? `${data.receiverName} (${data.receiverPhone})` : data.phone;

    let mapLink = data.location ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}" target="_blank" style="display:inline-block; margin-top:8px; padding:6px 12px; background:#2e7d32; color:white; text-decoration:none; border-radius:4px; font-size:13px; font-weight:bold;">📍 View Location</a>` : '';

    card.innerHTML = `
      <div style="margin-bottom:10px;">${labelHtml}<b>${data.type}</b></div>
      <b>Requester:</b> ${data.name}<br>
      <b>Contact:</b> ${contact}<br>
      <b>Address:</b> ${address}<br>
      ${data.locationPhoto ? `<img src="${data.locationPhoto}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin:10px 0;">` : ''}
      <b>Problem:</b> ${data.problem}<br>
      ${mapLink}
      <small style="color:#999; display:block; margin-top:8px;">${data.time || data.timestamp?.toDate().toLocaleString() || ''}</small>
    `;
    container.appendChild(card);
  });

}

if (document.getElementById("requests")) {
  loadRequests()
}

function notifyVolunteer() {

  if (Notification.permission === "granted") {
    new Notification("New Help Request Nearby");
  }

  else {
    Notification.requestPermission();
  }
}

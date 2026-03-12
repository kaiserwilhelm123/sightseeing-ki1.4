let map = L.map('map').setView([20,0],2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19
}).addTo(map);

async function search(){

let city = document.getElementById("city").value;
let interests = document.getElementById("interests").value.toLowerCase();
let time = document.getElementById("time").value * 60 || 9999;

if(!city){

alert("Bitte Stadt eingeben");
return;

}

let geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);

let geoData = await geo.json();

let lat = geoData[0].lat;
let lon = geoData[0].lon;

map.setView([lat,lon],13);

let overpass = await fetch(`
https://overpass-api.de/api/interpreter?data=
[out:json];
node(around:5000,${lat},${lon})[tourism];
out;
`);

let data = await overpass.json();

let results = document.getElementById("results");
results.innerHTML="";

let usedTime = 0;

data.elements.forEach(place=>{

let name = place.tags.name || "Unbekannt";
let category = place.tags.tourism || "place";

let visitTime = 60;

if(usedTime + visitTime > time) return;

if(interests && !category.includes(interests)) return;

usedTime += visitTime;

let card = document.createElement("div");

card.className="card";

card.innerHTML = `<h3>${name}</h3><p>${category}</p>`;

results.appendChild(card);

L.marker([place.lat,place.lon]).addTo(map)
.bindPopup(name);

});

}

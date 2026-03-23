console.log("--> Skrypt app.js wystartował");
 

let currentLat = null;

let currentLng = null;

let myMap = null;

let marker = null;

const mapContainer = document.getElementById('map');

const shareBtn = document.getElementById('shareBtn');
 

if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('./sw.js')

        .then(() => console.log('SW gotowy'))

        .catch(err => console.warn('Błąd SW:', err));

}
 

const cameraInput = document.getElementById('cameraInput');

const openCameraBtn = document.getElementById('openCameraBtn');

const photoPreview = document.getElementById('photoPreview');
 
if (!openCameraBtn || !cameraInput) {

    console.error("BŁĄD: Nie widzę przycisku. Sprawdź, czy plik HTML jest zapisany.");

} else {

    console.log("--> Przyciski znalezione. Podpinam kliknięcie.");

    openCameraBtn.addEventListener('click', () => {

        console.log("--> Kliknięto przycisk!");

        cameraInput.click();

    });
 

    cameraInput.addEventListener('change', (event) => {

        console.log("--> Zmiana w inpucie (plik wybrany)");

        const file = event.target.files[0];

        if (file) {

            photoPreview.src = URL.createObjectURL(file);

            photoPreview.classList.remove('d-none');

            openCameraBtn.textContent = '📸 Zmień zdjęcie';

            fetchLocation();

        }

    });

}
 

function fetchLocation() {

    console.log("--> Próbuję pobrać GPS...");

    if ('geolocation' in navigator) {

        navigator.geolocation.getCurrentPosition(

            (pos) => {

                currentLat = pos.coords.latitude;

                currentLng = pos.coords.longitude;

                console.log(`--> SUKCES GPS: Lat ${currentLat}, Lng ${currentLng}`);


                showMap(currentLat, currentLng);

            },

            (err) => console.error('--> BŁĄD GPS:', err.message),

            { enableHighAccuracy: true }

        );

    }

}
function showMap(lat, lng) {

    console.log("--> Rysuję mapę...");


    mapContainer.classList.remove('d-none');

    shareBtn.classList.remove('d-none');
 
    if (myMap !== null) {


        myMap.setView([lat, lng], 16);

        marker.setLatLng([lat, lng]);

    } else {


        myMap = L.map('map').setView([lat, lng], 16);
 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

            attribution: '&copy; OpenStreetMap contributors'

        }).addTo(myMap);
 

        marker = L.marker([lat, lng]).addTo(myMap)

            .bindPopup('<b>Pychota!</b><br>Tutaj zrobiono zdjęcie.')

            .openPopup();

    }

}
 
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        console.log("--> Kliknięto Udostępnij");
        
        // Sprawdzamy, czy przeglądarka i system wspierają Web Share API
        if (navigator.share) {
            try {
                // Generujemy link do Map Google z pobranymi wcześniej współrzędnymi
                const mapLink = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`;
                
                await navigator.share({
                    title: 'Moje odkrycie kulinarne!',
                    text: 'Zobacz, gdzie zjadłem coś pysznego. Gorąco polecam to miejsce!',
                    url: mapLink
                });
                console.log('--> Udostępniono pomyślnie');
            } catch (error) {
                console.error('--> Błąd lub anulowanie udostępniania:', error.message);
            }
        } else {
            // Fallback dla starszych przeglądarek lub systemów desktopowych
            alert(`Twoja przeglądarka nie obsługuje udostępniania. \nSkopiuj ten link: \nhttps://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`);
        }
    });
}
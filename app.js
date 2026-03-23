console.log("--> Skrypt app.js wystartował");

// Rejestracja Service Workera
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('SW gotowy'))
        .catch(err => console.warn('Błąd SW:', err));
}

// Pobranie elementów
const cameraInput = document.getElementById('cameraInput');
const openCameraBtn = document.getElementById('openCameraBtn');
const photoPreview = document.getElementById('photoPreview');

// Natychmiastowe sprawdzenie
if (!openCameraBtn || !cameraInput) {
    console.error("BŁĄD: Nie widzę przycisku. Sprawdź, czy plik HTML jest zapisany.");
} else {
    console.log("--> Przyciski znalezione. Podpinam kliknięcie.");
    
    // Akcja na kliknięcie
    openCameraBtn.addEventListener('click', () => {
        console.log("--> Kliknięto przycisk!");
        cameraInput.click();
    });

    // Akcja po wybraniu pliku
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

// Pobieranie GPS
function fetchLocation() {
    console.log("--> Próbuję pobrać GPS...");
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => console.log(`--> SUKCES GPS: Lat ${pos.coords.latitude}, Lng ${pos.coords.longitude}`),
            (err) => console.error('--> BŁĄD GPS:', err.message),
            { enableHighAccuracy: true }
        );
    }
}
let map;
let markers = [];

const mapUtils = {
    initMap: (elementId, lat = 30.3753, lng = 69.3451, zoom = 6) => {
        // Default center is Pakistan
        map = L.map(elementId).setView([lat, lng], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        return map;
    },

    addMarker: (lat, lng, popupContent, type = 'shelter') => {
        const icon = mapUtils.getIcon(type);
        const marker = L.marker([lat, lng], { icon: icon }).addTo(map);

        if (popupContent) {
            marker.bindPopup(popupContent);
        }

        markers.push(marker);
        return marker;
    },

    clearMarkers: () => {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    },

    getIcon: (type) => {
        // Define custom icons based on type
        // For simplicity, using default marker for now, but could be customized
        return new L.Icon.Default();
    },

    locateUser: () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocation is not supported by your browser');
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        map.setView([latitude, longitude], 13);
                        L.marker([latitude, longitude]).addTo(map)
                            .bindPopup('You are here').openPopup();
                        resolve({ lat: latitude, lng: longitude });
                    },
                    () => {
                        reject('Unable to retrieve your location');
                    }
                );
            }
        });
    }
};

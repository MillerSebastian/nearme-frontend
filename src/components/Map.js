import L from "leaflet";
import "leaflet-routing-machine";

export class Map {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.markers = [];
    this.userLocation = null;
    this.routeControl = null; // Initialize routing control
  }

  init(lat = 10.9634, lng = -74.7967) {
    this.map = L.map(this.containerId).setView([lat, lng], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    this.getUserLocation();
    this.fetchStores(); // Load stores from API

    this.routeControl = L.Routing.control({
      waypoints: [],
      routeWhileDragging: false,
      createMarker: () => null, // Do not show markers
      lineOptions: {
        styles: [
          {
            color: "#1E90FF",
            weight: 6,
            opacity: 0.9,
          },
          {
            color: "#87CEFA",
            weight: 10,
            opacity: 0.4,
          },
        ],
      },
      show: false,
      useZoomParameter: true,
    }).addTo(this.map);

    return this.map;
  }

  getUserLocation() {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.userLocation = [lat, lng];

          const userIcon = L.divIcon({
            html: `
              <div class="relative">
                <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                <div class="absolute inset-0 w-4 h-4 bg-blue-600 rounded-full animate-ping opacity-75"></div>
              </div>
            `,
            iconSize: [16, 16],
            className: "user-location-marker",
          });

          L.marker([lat, lng], { icon: userIcon })
            .addTo(this.map)
            .bindPopup("Your location")
            .openPopup();

          this.map.setView([lat, lng], 13);

          this.updateStoreDistances();
        },
        (error) => {
          console.error("Error getting location:", error);
          const errorMessages = {
            1: "Permission denied to access location. Check your browser permissions.",
            2: "Location not available at this time. Try reloading the page or check your internet connection.",
            3: "Timeout while obtaining location. Please try again.",
          };
          const errorMessage =
            errorMessages[error.code] || "Error obtaining location";
          this.showLocationError(errorMessage);

          this.map.setView([4.6097, -74.0817], 10);
        },
        options
      );
    } else {
      console.warn("Geolocation not supported by this browser");
      this.map.setView([4.6097, -74.0817], 10);
    }
  }

  showLocationError(message) {
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 left-4 bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md";
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="text-sm">${message}</span>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  async fetchStores() {
    try {
      const response = await fetch(`${window.app.authManager.apiUrl}/stores`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const stores = await response.json();
      if (Array.isArray(stores) && stores.length > 0) {
        this.addStoreMarkers(stores);
      } else {
        this.showNoStoresMessage();
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      this.showErrorMessage(
        "Error loading stores. Make sure the server is running."
      );
    }
  }

  showNoStoresMessage() {
    const message = L.control({ position: "topright" });
    message.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = `
        <div style="background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-size: 12px;">
          <strong>No registered stores</strong><br>
          Register your store to appear on the map
        </div>
      `;
      return div;
    };
    message.addTo(this.map);
  }

  showErrorMessage(message) {
    const errorControl = L.control({ position: "topright" });
    errorControl.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = `
        <div style="background: rgba(220,38,38,0.9); color: white; padding: 10px; border-radius: 5px; font-size: 12px;">
          <strong>Error</strong><br>
          ${message}
        </div>
      `;
      return div;
    };
    errorControl.addTo(this.map);
  }

  async addStoreMarkers(stores) {
    this.clearMarkers();

    for (const store of stores) {
      let lat = store.latitude || null;
      let lng = store.longitude || null;

      if ((!lat || !lng) && store.address) {
        const coordinates = await this.getCoordinatesFromAddress(store.address);
        if (coordinates) {
          lat = coordinates.lat;
          lng = coordinates.lon;
        }
      }

      if (lat === null || lng === null) {
        const baseLat = 4.6097;
        const baseLng = -74.0817;
        const variation = 0.01;
        lat = baseLat + (Math.random() - 0.5) * variation;
        lng = baseLng + (Math.random() - 0.5) * variation;
      }

      let distance = "0 km";
      if (this.userLocation) {
        distance = this.calculateDistance(
          this.userLocation[0],
          this.userLocation[1],
          lat,
          lng
        );
      }

      store.distance = distance;
      store.latitude = lat;
      store.longitude = lng;

      const marker = await this.createStoreMarker(store, lat, lng);
      if (marker) {
        marker.storeId = store.nit_store;
        this.markers.push(marker);
        marker.addTo(this.map);
      }
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)} km`;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  updateStoreDistances() {
    if (!this.userLocation) return;

    this.markers.forEach((marker) => {
      const latLng = marker.getLatLng();
      const distance = this.calculateDistance(
        this.userLocation[0],
        this.userLocation[1],
        latLng.lat,
        latLng.lng
      );

      const popup = marker.getPopup();
      const content = popup.getContent();
      const updatedContent = content.replace(
        /<span class="text-xs text-slate-400">[^<]+<\/span>/,
        `<span class="text-xs text-slate-400">${distance}</span>`
      );
      popup.setContent(updatedContent);
    });
  }

  async getCoordinatesFromAddress(address) {
    try {
      const correctedAddress =
        address.charAt(0).toUpperCase() + address.slice(1).toLowerCase();
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        correctedAddress
      )}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  }

  async createStoreMarker(store, lat, lng) {
    if (isNaN(lat) || isNaN(lng)) return null;

    const icon = L.divIcon({
      html: `
        <div class="relative">
          <div class="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      className: "store-marker",
    });

    const marker = L.marker([lat, lng], { icon })
      .bindPopup(
        `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-white mb-2">${store.store_name}</h3>
          <p class="text-slate-300 text-sm mb-2">${store.address || "Address not available"}</p>
          <div class="flex justify-between items-center">
            <span class="text-green-400 font-semibold">Registered store</span>
            <span class="text-xs text-slate-400">${store.distance || "0 km"}</span>
          </div>
        </div>
      `
      )
      .on("click", () => {
        this.highlightStoreCard(store.nit_store);
        this.createRouteToStore(lat, lng, store.nit_store);
      });

    return marker;
  }

  highlightStoreCard(storeId) {
    document.querySelectorAll(".store-card").forEach((card) => {
      card.classList.remove("ring-2", "ring-blue-500");
    });
    const storeCard = document.querySelector(`[data-store-id="${storeId}"]`);
    if (storeCard) {
      storeCard.classList.add("ring-2", "ring-blue-500");
      storeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  highlightMarker(storeId) {
    this.markers.forEach((marker) => {
      if (marker.storeId === storeId) {
        const element = marker.getElement();
        if (element) {
          element.style.animation = "pulse 1s infinite";
          setTimeout(() => (element.style.animation = ""), 3000);
        }
        this.map.setView(marker.getLatLng(), 15);
        marker.openPopup();
      }
    });
  }

  clearMarkers() {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];
  }

  // Create route and show distance in popup + external board
  createRouteToStore(destLat, destLng, storeId = null) {
    if (!this.userLocation) {
      alert("Could not obtain your current location.");
      return;
    }

    if (this.routeControl) {
      this.routeControl.setWaypoints([
        L.latLng(this.userLocation[0], this.userLocation[1]),
        L.latLng(destLat, destLng),
      ]);

      this.routeControl.on("routesfound", (event) => {
        const totalDistance = event.routes[0].summary.totalDistance;
        const totalDistanceInKm = (totalDistance / 1000).toFixed(2);

        // Show on external board
        const distElem = document.getElementById("distanciaTotal");
        if (distElem) distElem.innerHTML = `Total distance: ${totalDistanceInKm} km`;

        // Show on marker popup
        if (storeId) {
          const marker = this.markers.find((m) => m.storeId === storeId);
          if (marker) {
            const popup = marker.getPopup();
            const content = popup.getContent();
            const updatedContent = content.replace(
              /<span class="text-xs text-slate-400">[^<]+<\/span>/,
              `<span class="text-xs text-slate-400">${totalDistanceInKm} km</span>`
            );
            popup.setContent(updatedContent);
            popup.update();
          }
        }
      });
    } else {
      console.error("Route control is not available.");
    }
  }

  destroy() {
    if (this.map) this.map.remove();
  }
}

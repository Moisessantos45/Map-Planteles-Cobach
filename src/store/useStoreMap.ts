import { defineStore } from "pinia";
import markers from "../data/data";
import { computed, ref, watch } from "vue";
import mapboxgl from "mapbox-gl";
import { GeoJSONSource } from "mapbox-gl";
import axios from "axios";
import { Feature, LineString } from "geojson";

const useStoreMap = defineStore("storeMap", () => {
  const mapScreen = ref<HTMLElement | null>(null);
  const map = ref<mapboxgl.Map | null>(null);
  const api_key = import.meta.env.VITE_API_KEY;
  const searchMarkers = ref("");
  const isLocationZoom = ref(false);

  const isFindMarker = computed(() => {
    return searchMarkers.value !== ""
      ? markers.filter((marker) =>
          marker.title.toLowerCase().includes(searchMarkers.value.toLowerCase())
        )
      : [];
  });

  const start = [-100.429722, 22.603333]; // San Luis Potosí
  const end = [-100.9733, 22.1505];

  const zoomToLocation = (lng: number, lat: number) => {
    if (!mapScreen.value) return;
    const map = new mapboxgl.Map({
      container: mapScreen.value,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-100.429722, 22.603333],
      zoom: 6.7,
    });
    map?.flyTo({
      center: [lng, lat],
      zoom: 15,
      essential: true,
    });

    new mapboxgl.Marker({ color: "#FF5733" }).setLngLat([lng, lat]).addTo(map);
    searchMarkers.value = "";
  };

  const addMarker = () => {
    if (!mapScreen.value) return;

    const map = new mapboxgl.Map({
      container: mapScreen.value,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-100.429722, 22.603333],
      zoom: 6.7,
    });

    markers.forEach((marker) => {
      new mapboxgl.Marker({
        color: marker.title.includes("Emsad") ? "#FF5733" : "#3887be",
      })
        .setLngLat([marker.lng, marker.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
  <div class="p-4">
    <div class="mb-4">
      <h3 class="text-base font-bold text-gray-800 mb-1">
        ${marker.title}
      </h3>
      <div class="h-1 w-20 bg-blue-500 rounded"></div>
    </div>
    
    <div class="space-y-3">
      <!-- Encargado -->
      <div class="flex items-start text-gray-700">
        <svg class="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <div>
          <span class="text-sm font-semibold block text-gray-600">Encargado</span>
          <span class="text-sm">${marker.encargado}</span>
        </div>
      </div>

      <!-- Correo -->
      <div class="flex items-start text-gray-700">
        <svg class="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <div>
          <span class="text-sm font-semibold block text-gray-600">Correo</span>
          <a href="mailto:${
            marker.correo
          }" class="text-sm text-blue-500 hover:text-blue-600">
            ${marker.correo}
          </a>
        </div>
      </div>

      <!-- Dirección -->
      <div class="flex items-start text-gray-700">
        <svg class="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div>
          <span class="text-sm font-semibold block text-gray-600">Dirección</span>
          <span class="text-sm">${marker.direccion}</span>
        </div>
      </div>

      ${
        marker.telefono
          ? `
      <!-- Teléfono (condicional) -->
      <div class="flex items-start text-gray-700">
        <svg class="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <div>
          <span class="text-sm font-semibold block text-gray-600">Teléfono</span>
          <a href="tel:${marker.telefono}" class="text-sm text-blue-500 hover:text-blue-600">
            ${marker.telefono}
          </a>
        </div>
      </div>
      `
          : ""
      }

    <div class="mt-4 pt-3 border-t border-gray-200">
      <button
        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        Ir a ubicación
      </button>
    </div>
  </div>
      `)
        )
        .addTo(map);
    });
  };

  const initializeMap = () => {
    if (!mapScreen.value) return;
    const map = new mapboxgl.Map({
      container: mapScreen.value,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 1,
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.on("load", () => {
      if (!map) return;
      map.addLayer({
        id: "point",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: start,
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#3887be",
        },
      });
    });

    // new mapboxgl.Marker({ color: "#FF5733" })
    //   .setLngLat([-100.429722, 22.603333])
    //   .addTo(map);

    // new mapboxgl.Marker({ color: "#FF5733" })
    //   .setLngLat([-100.9733, 22.1505])
    //   .addTo(map);

    if (!isLocationZoom) {
      map.flyTo({
        center: [-100.429722, 22.603333],
        zoom: 6.7,
        essential: true,
      });
    }
  };

  watch(isLocationZoom, () => {
    if ("geolocation" in navigator && isLocationZoom) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!mapScreen.value) return;
          const map = new mapboxgl.Map({
            container: mapScreen.value,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [-100.429722, 22.603333],
            zoom: 6.7,
          });
          map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 10,
            essential: true,
          });
        },
        (e) => {
          console.log(e);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  });

  const getRoute = async () => {
    if (!mapScreen.value) return;
    const map = new mapboxgl.Map({
      container: mapScreen.value,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-100.429722, 22.603333],
      zoom: 6.7,
    });
    const query = await axios(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${api_key}`
    );
    const json = query.data;
    const data = json.routes[0];
    const route = data.geometry.coordinates;

    const geojson: Feature<LineString> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };

    if (map.getSource("route")) {
      const source = map.getSource("route") as GeoJSONSource;
      source.setData(geojson);
    } else {
      map.addSource("route", {
        type: "geojson",
        data: geojson,
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }
  };

  const restoreMapState = () => {
    initializeMap();
    addMarker();
  };

  return {
    map,
    api_key,
    searchMarkers,
    isFindMarker,
    mapScreen,
    isLocationZoom,
    addMarker,
    initializeMap,
    getRoute,
    zoomToLocation,
    restoreMapState,
  };
});

export default useStoreMap;

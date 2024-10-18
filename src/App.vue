<template>
  <main ref="mapScreen" class="h-screen w-full relative bg-gray-100">
    <nav class="absolute top-0 left-0 right-0 z-10 p-6 flex gap-3">
      <!-- Input con icono de búsqueda -->
      <div
        class="flex md:flex-grow gap-3 md:max-w-md w-11/12 md:flex-nowrap flex-wrap"
      >
        <div class="relative flex-grow md:max-w-sm w-full">
          <input
            type="search"
            name="search"
            id="search"
            class="w-full p-3 pl-10 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
            v-model="searchMarkers"
            placeholder="Buscar ubicación..."
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- Botón mejorado -->
        <button
          @click="isLocationZoom = !isLocationZoom"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 md:py-3 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2 md:w-auto w-16"
        >
          <svg
            class="md:w-4 w-5 md:h-4 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          @click="store.restoreMapState()"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 md:py-3 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2 md:w-auto w-16"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="md:w-4 w-5 md:h-4 h-7"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </button>
      </div>

      <!-- Lista de resultados mejorada -->
      <ul
        v-if="searchMarkers !== ''"
        class="absolute z-20 bg-white md:top-full top-[50%] mt-2 w-10/12 md:max-w-sm rounded-lg shadow-lg border border-gray-100 max-h-80 overflow-y-auto hidden-scroll"
      >
        <li v-for="marker in isFindMarker" :key="marker.lat" class="w-full">
          <button
            type="button"
            class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none flex items-center gap-3 transition-colors w-full"
            @click="store.zoomToLocation(marker.lng, marker.lat)"
          >
            <svg
              class="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ marker.title }}
          </button>
        </li>
      </ul>
    </nav>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useStoreMap from "./store/useStoreMap";
import { storeToRefs } from "pinia";

const store = useStoreMap();
const { searchMarkers, isFindMarker, mapScreen, isLocationZoom } =
  storeToRefs(store);

onMounted(() => {
  store.initializeMap();
  store.addMarker();
});
</script>

<style>
.hidden-scroll {
  scrollbar-width: none;
}

.hidden-scroll:hover {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
  scroll-padding: 5px;
}

.mapboxgl-popup-close-button {
  font-size: 35px;
}
</style>

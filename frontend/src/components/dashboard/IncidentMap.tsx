'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SEED_AREAS } from '@/lib/demoData';

export default function IncidentMap() {
  const center: [number, number] = [12.965, 77.63]; // Bengaluru center

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border relative z-0">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(SEED_AREAS).map((area) => (
          <CircleMarker
            key={area.name}
            center={[area.lat, area.lng]}
            radius={Math.max(area.affected * 0.9, 10)}
            pathOptions={{
              color: area.category === 'electricity' ? '#A78BFA' : '#38BDF8',
              fillColor: area.category === 'electricity' ? '#A78BFA' : '#38BDF8',
              fillOpacity: 0.5,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-xs font-sans p-1">
                <strong className="block font-bold text-sm text-gray-900">{area.name}</strong>
                <span className="text-gray-700 block">Category: {area.category}</span>
                <span className="text-blue-600 font-semibold block">
                  {area.affected} citizens unified
                </span>
                <span className="text-gray-500 font-mono text-[10px]">
                  Coords: {area.lat.toFixed(4)}, {area.lng.toFixed(4)}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}


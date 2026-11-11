# Repes

Recomienda una ruta de trote de ida y vuelta según el entreno del día en TrainingPeaks:
calcula la distancia de cada fase, propone el punto de giro y marca dónde cae cada serie.

## Estado

Prototipo de factibilidad en un solo archivo (`index.html`, sin build).

- **Entrada:** texto pegado de TrainingPeaks o pantallazo (OCR con Tesseract.js en el navegador).
- **Cálculo:** expande repeticiones, convierte tiempo↔distancia con el ritmo (rápido / medio / lento del rango).
- **Ruteo:** OSRM peatonal (routing.openstreetmap.de) en 6 direcciones; corta la ida en la mitad de la distancia total.
- **Ranking:** desnivel (Open-Meteo Elevation) + giros que caen dentro de las series.
- **Salida:** mapa Leaflet + hoja de ruta (km y minuto de cada tramo) + GPX descargable.

## Probarlo

Sirve la carpeta con un servidor local (abrir el archivo directo puede bloquear mapa y geolocalización):

```bash
npx serve .
# o
python3 -m http.server 8000
```

## Pendientes conocidos

- No se ha probado contra los servicios reales (OSRM, Open-Meteo, Nominatim) ni en el celular.
- La distancia calculada del ejemplo (12,37 km) no coincide con la de TrainingPeaks (13,76 km): revisar qué ritmo asume TP.
- El OCR del pantallazo no está validado con capturas reales.
- Ideas: tramos favoritos para series por ciudad, evitar semáforos/cruces con datos OSM, exportar a Garmin/Coros, integración con la API de TrainingPeaks (requiere ser partner).

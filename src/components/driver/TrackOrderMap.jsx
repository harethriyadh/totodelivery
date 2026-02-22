import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Store, User, Navigation, AlertCircle, Signal, SignalHigh, SignalLow } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fetchOSRMRoute } from '../../utils/mapUtils';

/**
 * Bounds Manager
 */
function MapEffectsManager({ points, zoom = 16 }) {
    const map = useMap();
    useEffect(() => {
        if (points && points.length > 1) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: zoom });
        }
    }, [points, map, zoom]);
    return null;
}

/**
 * Functional Recenter Button
 */
function RecenterAction({ pos }) {
    const map = useMap();
    if (!pos) return null;

    return (
        <div className="leaflet-bottom leaflet-right !mb-6 !mr-6" style={{ pointerEvents: 'auto' }}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    map.flyTo(pos, 16, { duration: 1.5 });
                }}
                className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-primary-500 border border-neutral-100 transform active:scale-95 transition-all hover:bg-neutral-50"
                title="إعادة التمركز"
            >
                <Navigation className="w-7 h-7 fill-current" />
            </button>
        </div>
    );
}

const TrackOrderMap = ({ pickupPos, deliveryPos, currentPos, step, gpsError, gpsPermission, onMapClick, navLabel, showRecenter = true }) => {
    const [routePoints, setRoutePoints] = useState([]);
    const lastRouteRequest = useRef(0);

    // Map Click Listener Component
    function MapEvents() {
        useMapEvents({
            click: (e) => {
                if (onMapClick) {
                    onMapClick([e.latlng.lat, e.latlng.lng]);
                }
            },
        });
        return null;
    }

    // Custom Icons
    const createCustomIcon = (icon, color) => {
        const iconHtml = renderToStaticMarkup(
            <div className="p-2.5 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center animate-in zoom-in duration-300" style={{ backgroundColor: color }}>
                {React.cloneElement(icon, { size: 20, color: 'white', strokeWidth: 3 })}
            </div>
        );
        return L.divIcon({
            html: iconHtml,
            className: 'custom-map-marker',
            iconSize: [42, 42],
            iconAnchor: [21, 21],
        });
    };

    const driverIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center">
                <div class="absolute w-12 h-12 bg-primary-500/30 rounded-full animate-ping"></div>
                <div class="w-6 h-6 bg-primary-500 rounded-full border-[3px] border-white shadow-2xl relative z-10 transition-all duration-1000"></div>
               </div>`,
        className: 'driver-marker',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
    });

    const storeIcon = createCustomIcon(<Store />, '#F59E0B');
    const customerIcon = createCustomIcon(<User />, '#3B82F6');

    // 2. Production-Grade Routing (Throttled OSRM)
    useEffect(() => {
        const throttleTime = 20000; // 20 seconds
        const now = Date.now();

        const updateRoute = async () => {
            const destination = step === 'PICKUP' ? pickupPos : deliveryPos;
            if (!currentPos || !destination) return;

            const roadRoute = await fetchOSRMRoute(currentPos, destination);
            if (roadRoute.length > 0) {
                setRoutePoints(roadRoute);
                lastRouteRequest.current = Date.now();
            }
        };

        if (now - lastRouteRequest.current > throttleTime || routePoints.length === 0) {
            updateRoute();
        }

        // Periodic update every 20s
        const interval = setInterval(updateRoute, throttleTime);
        return () => clearInterval(interval);
    }, [step, pickupPos, deliveryPos, currentPos]);

    return (
        <div className="h-full w-full relative bg-[#f8f9fa] overflow-hidden">
            {/* GPS Health / Permission Error Badge */}
            {(gpsError || gpsPermission === 'denied') && (
                <div className="absolute top-4 left-4 right-4 z-[500] bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3 shadow-lg animate-in slide-in-from-top duration-500">
                    <AlertCircle className="text-red-500 shrink-0" />
                    <div>
                        <p className="text-[11px] font-black text-red-900 leading-tight">
                            {gpsPermission === 'denied' ? 'يرجى تفعيل صلاحيات الموقع الجغرافي' : 'خطأ في تحديث موقع GPS'}
                        </p>
                        <p className="text-[9px] text-red-400 mt-1">الملاحة والتوصل قد تتأثر</p>
                    </div>
                </div>
            )}

            <MapContainer
                center={currentPos || pickupPos}
                zoom={16}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                touchZoom={true}
            >
                <ZoomControl position="bottomright" />
                <TileLayer
                    url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    maxZoom={20}
                />

                {/* Road-Snapped Polyline (Geometric) */}
                {routePoints.length > 1 && (
                    <>
                        <Polyline positions={routePoints} pathOptions={{ color: '#49A06D', weight: 12, opacity: 0.1 }} />
                        <Polyline
                            positions={routePoints}
                            pathOptions={{
                                color: '#49A06D',
                                weight: 6,
                                opacity: 1,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }}
                        />
                    </>
                )}

                {/* Active Target Marker */}
                {step === 'PICKUP' && pickupPos && (
                    <Marker
                        position={pickupPos}
                        icon={storeIcon}
                        draggable={!!onMapClick}
                        eventHandlers={{
                            dragend: (e) => {
                                const marker = e.target;
                                const position = marker.getLatLng();
                                if (onMapClick) onMapClick([position.lat, position.lng]);
                            }
                        }}
                    >
                        <Popup className="font-tajawal font-black">
                            {onMapClick ? "موقع المتجر (اسحب للتعديل)" : "موقع المتجر المثبت"}
                        </Popup>
                    </Marker>
                )}
                {step === 'DELIVERY' && deliveryPos && (
                    <Marker position={deliveryPos} icon={customerIcon}>
                        <Popup className="font-tajawal font-black">موقع العميل</Popup>
                    </Marker>
                )}

                {/* Driver Marker */}
                {currentPos && (
                    <Marker position={currentPos} icon={driverIcon}>
                        <Popup className="font-tajawal font-black">موقعك الآن</Popup>
                    </Marker>
                )}

                <MapEvents />
                <MapEffectsManager points={routePoints.length > 0 ? routePoints : [currentPos, step === 'PICKUP' ? pickupPos : deliveryPos]} />

                {/* Map Action Overlays (Connected to Map Logic) */}
                {showRecenter && <RecenterAction pos={currentPos || pickupPos} />}
            </MapContainer>

            {/* Navigation Status Badge with GPS Strength Icon */}
            <div className="absolute top-4 right-4 z-[400] px-4 py-2 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 shadow-xl flex items-center gap-3 animate-in fade-in duration-500">
                <div className="flex items-center gap-1.5 grayscale-[0.2]">
                    {gpsError ? <SignalLow className="w-4 h-4 text-red-500" /> : <SignalHigh className="w-4 h-4 text-green-500" />}
                </div>
                <span className="text-[11px] font-black text-neutral-800 uppercase tracking-tighter">
                    {navLabel || (step === 'PICKUP' ? 'ملاحة: المتجر' : 'ملاحة: العميل')}
                </span>
            </div>
        </div>
    );
};

export default TrackOrderMap;

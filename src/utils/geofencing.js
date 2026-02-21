
/**
 * Geofencing Utilities for TotoDelivery
 */

export const SERVICE_AREA = {
    points: [
        { lat: 33.18353089701396, lng: 43.83547816819306 },
        { lat: 33.159748807164036, lng: 43.838980063007305 },
        { lat: 33.15860080110426, lng: 43.87246912974589 },
        { lat: 33.180108311854625, lng: 43.867922122839566 }
    ],
    center: { lat: 33.163824682873695, lng: 43.86356535058753 },
    // Bounding box for fast check
    bounds: {
        minLat: 33.1586008,
        maxLat: 33.1835308,
        minLng: 43.8354781,
        maxLng: 43.8724691
    }
};

/**
 * Checks if a point is within the service area (with 500m tolerance)
 */
export const isWithinServiceArea = (lat, lng) => {
    // 500m in degrees (approx)
    const latTolerance = 0.0045;
    const lngTolerance = 0.0053;

    const isInsidePadded = (
        lat >= SERVICE_AREA.bounds.minLat - latTolerance &&
        lat <= SERVICE_AREA.bounds.maxLat + latTolerance &&
        lng >= SERVICE_AREA.bounds.minLng - lngTolerance &&
        lng <= SERVICE_AREA.bounds.maxLng + lngTolerance
    );

    return isInsidePadded;
};

/**
 * Haversine formula to calculate distance between two points in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

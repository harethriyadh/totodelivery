/**
 * Centralized Map Configuration for TotoDelivery
 * Contains all settings related to zooming, controlling, and gestures.
 */

export const MAP_CONFIG = {
    // Zoom Settings
    zoom: {
        default: 16,
        min: 3,
        max: 20,
        editProfile: 15, // Slightly wider view for picking location
        tracking: 16,    // Close up for tracking order
    },

    // Control Display Settings
    controls: {
        zoomControl: true,
        zoomControlPosition: 'bottomright',
        attributionControl: false,
        showRecenter: true,
    },

    // Gesture & Interaction Settings
    gestures: {
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        boxZoom: true,
        keyboard: true,
        tap: true,
    },

    // Animation Settings
    animation: {
        animate: true,
        duration: 1.5, // flyTo duration
        easeLinearity: 0.25,
    },

    // Logic Settings
    logic: {
        interactionBufferMs: 3000, // Time to wait after interaction before auto-recentering
        routeThrottleMs: 20000,    // Time between route updates
    }
};

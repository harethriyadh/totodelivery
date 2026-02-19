/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                tajawal: ['Tajawal', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#ECFDF5',   // Soft Mint Tint
                    500: '#49A06D',  // Toto Green / Main Action
                    700: '#006837',  // Deep Emerald Green
                },
                secondary: {
                    500: '#F59E0B',
                },
                neutral: {
                    50: '#F9FAFB',   // Ghost Gray
                    100: '#E5E7EB',  // Soft Border Gray
                    200: '#F3F4F6',  // Divider Gray
                    400: '#9CA3AF',  // Subtle Text Gray
                    800: '#1F2937',  // Body Text
                    900: '#111827',  // Heading Charcoal
                },
                danger: '#EF4444',
            },
            borderRadius: {
                'button': '0.5rem',
                'card': '1.5rem',
                'pill': '100px',
            },
            boxShadow: {
                'flat': '0 0 0 1px #E5E7EB',
            }
        },
    },
    plugins: [],
}

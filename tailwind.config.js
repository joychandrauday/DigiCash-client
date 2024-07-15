/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Configure your color palette here
        primary:'#007BFF',
        primar2:'#28A745',
        secondaty:'#F8F9FA',
        neutral:'#FFFFFF',
        neutralop:'#212121',
        basic:"#00008b",
      },
      fontFamily:{
        rubik:'"Rubik", sans-serif',
      },
      backgroundImage: {
        'basic-bg': "url('https://i.ibb.co/pvyfDK8/arijit-m-0-F4-Ew-Nk-G5-To-unsplash.jpg')",
        'dashboard': "url('https://i.ibb.co/w6V0xjB/mashiur-rahman-R0p8et-Tpdp-E-unsplash.jpg')",
        'newsletter': "url('https://i.ibb.co/bL2xbYT/pexels-leo-willians-789496294-19365740.jpg')",
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

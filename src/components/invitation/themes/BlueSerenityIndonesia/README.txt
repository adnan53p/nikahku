Blue Serenity Indonesia - modular theme files

Cara pasang:
1. Buat folder:
   src/components/invitation/themes/BlueSerenityIndonesia

2. Masukkan semua isi folder ini ke sana:
   BlueSerenityIndonesia.tsx
   components/Opening.tsx
   components/Hero.tsx
   components/Event.tsx
   components/Gallery.tsx
   components/RSVP.tsx
   components/Footer.tsx
   components/shared.tsx

3. Untuk preview:
   buat src/app/preview-blue/page.tsx

   isi:
   import BlueSerenityIndonesia from '@/components/invitation/themes/BlueSerenityIndonesia/BlueSerenityIndonesia'

   export default function Page() {
     return <BlueSerenityIndonesia guestName="Bapak Ahmad" />
   }

4. Untuk masuk sistem theme:
   daftarkan component dengan slug: blue-serenity-indonesia

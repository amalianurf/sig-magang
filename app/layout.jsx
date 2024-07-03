import './globals.css'

export const metadata = {
    title: 'Sistem Informasi Geografis Lowongan Magang',
    description: 'Sistem Informasi Geografis Lowongan Magang merupakan sebuah sistem informasi yang menyajikan data lowongan magang dalam bentuk peta. Aplikasi ini akan menampilkan sebaran data lowongan magang berdasarkan lokasi perusahaannya dan dapat menampilkan jumlah data per Kabupaten/Kota di Indonesia',
}

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body>{children}</body>
        </html>
    )
}

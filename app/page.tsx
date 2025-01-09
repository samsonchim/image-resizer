import ImageUploader from '@/components/ImageUploader'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Image Resizer</h1>
        <ImageUploader />
      </main>
      <Footer />
    </div>
  )
}


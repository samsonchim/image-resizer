import { Github, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 flex justify-center space-x-4">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
          <Github size={24} />
          <span className="sr-only">GitHub</span>
        </a>
        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
          <Phone size={24} />
          <span className="sr-only">WhatsApp</span>
        </a>
      </div>
    </footer>
  )
}


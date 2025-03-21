export function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-md py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2025 João Coelho. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400">Built with Next.js and Three.js. Vibe coded.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
export function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-md py-6 md:py-8">
      <div className="flex justify-center w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-full md:max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm md:text-base text-gray-400">© 2024 João Antonio Stoll Coelho. All rights reserved.</p>
            <div className="mt-3 md:mt-0">
              <p className="text-sm md:text-base text-gray-400">Built with Next.js and Three.js. Vibe coded.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
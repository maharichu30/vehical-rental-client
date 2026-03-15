import { useState, useEffect } from "react"

function Slider() {

  const images = [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
    "https://images.unsplash.com/photo-1493238792000-8113da705763"
  ]

  const [current, setCurrent] = useState(0)

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)

  }, [])

  return (

    <div className="relative w-full h-[500px]">

      <img
        src={images[current]}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center">

        <h1 className="text-5xl font-bold text-green-400">
          Drive Your Dream Car 
        </h1>

        <p className="text-white mt-4 text-lg">
          Luxury • Comfort • Affordable
        </p>

      </div>

    </div>

  )
}

export default Slider
import Image from "next/image";
import Link from "next/link";

export default function Gallery() {
 
  const images = [
    { src: "/images/bottle-20l.jpg", alt: "20L Bottled Water" },
 
  
  ];

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
     
      <header className="mb-12 border-b border-black pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold uppercase tracking-tighter">Diyana Gallery</h1>

      </header>

    
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div key={index} className="group relative overflow-hidden border border-black">
            <div className="aspect-square relative grayscale hover:grayscale-0 transition-all duration-500">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2 border-t border-black bg-white">
              <p className="text-xs uppercase font-medium">{img.alt}</p>
            </div>
          </div>
        ))}
      </main>

     
    </div>
  );
}
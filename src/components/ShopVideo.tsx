export default function ShopVideo() {
  // Replace with your actual video URL
  const videoSrc = "https://videos.pexels.com/video-files/3196600/3196600-hd_1920_1080_24fps.mp4";

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-2xl">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
      />
      {/* Subtle overlay to make text readable if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const videos = [
  { id: 1, title: 'Understanding Diabetes', url: 'https://www.youtube.com/embed/example1' },
  { id: 2, title: 'Heart Health Basics', url: 'https://www.youtube.com/embed/example2' },
  { id: 3, title: 'Mental Health Awareness', url: 'https://www.youtube.com/embed/example3' },
];

const VideoPage = () => {
  const { id } = useParams();
  const video = videos.find((v) => v.id === parseInt(id));

  if (!video) return <div className="text-gray-800 p-6">Video not found</div>;

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <Link
        to="/"
        className="inline-block mb-4 bg-green-800 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        ← Back Home
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-green-800">{video.title}</h1>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-full rounded shadow-lg"
          src={video.url}
          title={video.title}

          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPage;

import React from 'react';
import { Link } from 'react-router-dom';

const articles = [
  { id: 1, title: 'Nutrition Tips for Migrants', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' },
  { id: 2, title: 'Preventing Common Diseases', url: 'https://www.cdc.gov/globalhealth/healthprotection/index.html' },
  { id: 3, title: 'Mental Health Awareness', url: 'https://www.who.int/mental_health/en/' },
];

const videos = [
  { id: 1, title: 'Healthy Lifestyle Practices', url: 'https://www.youtube.com/embed/example4' },
  { id: 2, title: 'Hygiene & Sanitation', url: 'https://www.youtube.com/embed/example5' },
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-green-800 text-white p-6">
      <Link to="/" className="inline-block mb-4 bg-white text-green-800 px-3 py-1 rounded hover:bg-green-100">
        ← Back Home
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-center">Health Resources</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Articles & Guides</h2>
        <ul className="space-y-3">
          {articles.map((article) => (
            <li key={article.id} className="bg-white text-green-800 p-4 rounded shadow">
              <a href={article.url} target="_blank" rel="noreferrer" className="hover:underline">
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Health Awareness Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white text-green-800 rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-full rounded"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Resources;


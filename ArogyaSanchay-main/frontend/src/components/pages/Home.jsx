import React from 'react';
import { Link } from 'react-router-dom';

const videos = [
  { id: 1, title: 'Understanding Diabetes: Type 1 vs Type 2 Explained', url: 'https://www.youtube.com/embed/Q_epStvzGyc' },
  { id: 2, title: 'Heart Health Basics', url: 'https://www.youtube.com/embed/wXk1Nj28Hm4' },
  { id: 3, title: 'Mental Health Awareness', url: 'https://www.youtube.com/embed/YdMCL9_UTE4' },
  { id: 4, title: 'Nutrition & Wellness', url: 'https://www.youtube.com/embed/SBtRkjXSMmk' },
  { id: 5, title: 'COVID-19 Precautions', url: 'https://www.youtube.com/embed/2XZNNZnGhGY' },
  { id: 6, title: 'Personal Hygiene & Sanitation', url: 'https://www.youtube.com/embed/steDpnoL8vE' },
];

const articles = [
  { id: 1, title: 'Nutrition Tips for Migrants', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' },
  { id: 2, title: 'Preventing Chronic Diseases', url: 'https://www.cdc.gov/chronic-disease/prevention/index.html' },
  { id: 3, title: 'Mental Health Awareness', url: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response' },
  { id: 4, title: 'Vaccination Importance', url: 'https://www.who.int/health-topics/vaccines-and-immunization' },
  { id: 5, title: 'Healthy Lifestyle Habits', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' },
  { id: 6, title: 'First Aid Essentials', url: 'https://www.redcross.org/take-a-class/first-aid' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-800">Healthcare Awareness Hub</h1>

      {/* Featured Videos */}
      <h2 className="text-2xl font-semibold mb-4 text-green-800">Featured Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {videos.map((video) => (
          <div key={video.id} className="bg-green-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">{video.title}</h3>
            <div className="aspect-w-16 aspect-h-9 mb-2">
              <iframe
                className="w-full h-full rounded"
                src={video.url}
                title={video.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <Link
              to={`/video/${video.id}`}
              className="inline-block bg-green-800 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Watch in Page
            </Link>
          </div>
        ))}
      </div>

      {/* Health Resources */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-800">Health Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-green-50 p-4 rounded-lg shadow">
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-green-800 hover:underline"
              >
                {article.title}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

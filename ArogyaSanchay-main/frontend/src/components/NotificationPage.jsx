import React, { useEffect, useState } from "react";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      { id: 1, type: "alert", message: "⚠️ Health camp scheduled at Palakkad on Sep 25" },
      { id: 2, type: "update", message: "📢 New health guideline released" },
      { id: 3, type: "info", message: "💉 Free vaccination drive available" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-green-700">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No new notifications</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((note) => (
              <li
                key={note.id}
                className="border-l-4 border-green-600 bg-green-50 p-3 rounded shadow-sm"
              >
                {note.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { getHealth } from '../services/api';

export default function Home() {
  const [status, setStatus] = useState<string>('loading');

  useEffect(() => {
    getHealth()
      .then((r) => setStatus(r.status))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>MERN App Aldo Franco Chavez</h1>
      <p>API status: {status}</p>
      <img src="https://via.placeholder.com/150" alt="Placeholder" style={{ marginTop: 16 }} />
    </div>
  );
}

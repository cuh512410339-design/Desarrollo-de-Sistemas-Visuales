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
      <h1>MERN App</h1>
      <p>API status: {status}</p>
    </div>
  );
}

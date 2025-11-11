import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { UserAccount, Weight } from 'health-tracker-common';
import z from 'zod';

const FIXED_USER_ID = 'f5e5cdc7-d376-4f5b-a7af-64f7f2e7e08c'; // Grey
const FIXED_ADDRESS = '192.168.0.18';

export function App() {
  const [weights, setWeights] = useState<Weight[] | null>(null);
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [userId] = useState(FIXED_USER_ID); // Grey

  useEffect(() => {
    if (weights === null) {
      fetch(`http://${FIXED_ADDRESS}:3000/api/v1/health/weight`)
        .then(response => response.json())
        .then(z.array(Weight).parse)
        .then(setWeights)
    }

    if (user === null) {
      fetch(`http://${FIXED_ADDRESS}:3000/api/v1/user/`)
        .then(response => response.json())
        .then(z.array(UserAccount).parse)
        .then(users => setUser(users[0]))
    }
  }, [weights]);

  function onAddMeasurement() {
    fetch(`http://${FIXED_ADDRESS}:3000/api/v1/health/weight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        weight_kg: weightKg,
      }),
    })
      .then(() => setWeights(null));
  }

  function onDeleteMeasurement(weight: Weight) {
    fetch(`http://${FIXED_ADDRESS}:3000/api/v1/health/weight`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: weight.user_id,
        weight_recorded_at: weight.weight_recorded_at,
      }),
    })
      .then(() => setWeights(null));
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Weight (kg)</th>
              <th>Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {weights?.map((weight, index) => (
              <tr key={index} style={{ fontWeight: weight.user_id === userId ? 'bold' : 'normal' }}>
                <td>{user?.user_name}</td>
                <td>{weight.weight_kg}</td>
                { /* YYYY-MM-DD HH:mm */ }
                <td>{weight.weight_recorded_at.toLocaleString()}</td>
                <td><button onClick={() => onDeleteMeasurement(weight)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <input type="number" placeholder="Weight (kg)" value={weightKg ?? 0} onChange={e => setWeightKg(Number(e.target.value))} />
        <button onClick={onAddMeasurement}>Add measurement!</button>
      </div>
    </>
  )
}
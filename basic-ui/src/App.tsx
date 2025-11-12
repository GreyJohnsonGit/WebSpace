import { useEffect, useState } from 'react'
import './App.css'
import { UserAccount, Weight } from 'health-tracker-common';
import z from 'zod';

const FIXED_USER_ID = 'f5e5cdc7-d376-4f5b-a7af-64f7f2e7e08c'; // Grey
const FIXED_ADDRESS = '192.168.0.18';

export function App() {
  const [weights, setWeights] = useState<Weight[] | null>(null);
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [userId] = useState(FIXED_USER_ID);
  const [units, setUnits] = useState<'kg' | 'lb'>('lb');

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
  }, [weights, user]);

  function toPounds(weight: number | null) {
    return (weight ?? 0) * (units === 'lb' ? 2.20462 : 1);
  }

  function toKilograms(weight: number | null) {
    return (weight ?? 0) / (units === 'kg' ? 1 : 2.20462);
  }

  function toUnits(weight: number | null): number {
    return units === 'kg' ? toKilograms(weight) : toPounds(weight);
  }

  function toUnitsString(weight: number | null): string {
    const asUnits = toUnits(weight);
    return asUnits.toFixed(2);
  }


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
      <div className="card">
        <h4>Howdy, {user?.user_name}</h4>
        
        <input 
          type="number" 
          placeholder={`Weight (${units})`} 
          value={[weightKg].map(toUnits)[0]} 
          onChange={e => setWeightKg(toKilograms(Number(e.target.value)))}
        />
        <button onClick={onAddMeasurement}>Add measurement!</button>
        <button onClick={() => setUnits(units === 'kg' ? 'lb' : 'kg')}>
          Toggle Units
        </button>

        <table>
          <thead>
            <tr>
              <th>Weight ({units})</th>
              <th>Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {weights?.map((weight, index) => (
              <tr key={index} style={{ fontWeight: weight.user_id === userId ? 'bold' : 'normal' }}>
                <td>{toUnitsString(weight.weight_kg)}</td>
                <td>{weight.weight_recorded_at.toLocaleString()}</td>
                <td><button onClick={() => onDeleteMeasurement(weight)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </>
  )
}
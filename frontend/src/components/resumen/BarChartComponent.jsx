import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data }) => {
  // Formatear la fecha para mostrar solo mes y año
  const formattedDate = new Date(data.fecha).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const chartData = [{ fecha: formattedDate, ingresos: data.total_ingresos, gastos: data.total_gastos }];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
        <XAxis dataKey="fecha" tick={{ fontSize: 14, fill: '#4A5568' }} />
        <YAxis tick={{ fontSize: 14, fill: '#4A5568' }} />
        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 14, fontWeight: 'bold' }} />
        <Bar dataKey="ingresos" fill="#38A169" radius={[6, 6, 0, 0]} barSize={40} />
        <Bar dataKey="gastos" fill="#E53E3E" radius={[6, 6, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;

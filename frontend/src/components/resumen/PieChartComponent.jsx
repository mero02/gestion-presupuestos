import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PieChartComponent = ({ data }) => {
  const pieData = [
    { name: 'Ingresos', value: data.total_ingresos, color: '#38A169' },
    { name: 'Gastos', value: data.total_gastos, color: '#E53E3E' },
  ];

  // Función para personalizar las etiquetas del gráfico
  const renderLabel = ({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          label={renderLabel}
          labelStyle={{ fontSize: 14, fontWeight: 'bold' }}
          stroke="#fff"
          strokeWidth={2}
        >
          {pieData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;

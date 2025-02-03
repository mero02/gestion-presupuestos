import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { listarIngresos, obtenerMonedas } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PieChartIngresos = () => {
    const { userId } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [ingresos, setIngresos] = React.useState([]);
    const [monedas, setMonedas] = React.useState([]);
    const [error, setError] = React.useState(null);

    const colorPalette = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800",
        "#9C27B0", "#F44336", "#00BCD4", "#8BC34A", "#E91E63"
    ];

    React.useEffect(() => {
        const fetchIngresos = async () => {
            try {
                setLoading(true);
                const response = await listarIngresos(userId);
                setIngresos(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchIngresos();
    }, [userId]);

    React.useEffect(() => {
        const fetchMonedas = async () => {
            try {
                const response = await obtenerMonedas();
                setMonedas(response);
            } catch (error) {
                setError(error);
            }
        };
        fetchMonedas();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Hubo un error al cargar los ingresos.</div>;
    }

    const renderLabel = ({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`;

    const pieData = monedas.map((moneda, index) => {
        const ingresosMoneda = ingresos.filter((ingreso) => ingreso.id_moneda === moneda.id_moneda);
        const totalIngresos = ingresosMoneda.reduce((acc, ingreso) => acc + ingreso.monto, 0);
        return {
            name: moneda.nombre,
            value: totalIngresos,
            color: moneda.color || colorPalette[index % colorPalette.length], 
        };
    }).filter(item => item.value > 0); 

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
export default PieChartIngresos;

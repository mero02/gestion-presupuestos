import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { listarGastos, obtenerCategorias } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PieChartGastos = () => {
    const { userId } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [gastos, setGastos] = React.useState([]);
    const [categorias, setCategorias] = React.useState([]);
    const [error, setError] = React.useState(null);

    const colorPalette = [
        "#E91E63", "#8BC34A", "#00BCD4", "#F44336", "#9C27B0",
        "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"
    ];

    React.useEffect(() => {
        const fetchGastos = async () => {
            try {
                setLoading(true);
                const response = await listarGastos(userId);
                setGastos(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchGastos();
    }, [userId]);

    React.useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await obtenerCategorias();
                setCategorias(response);
            } catch (error) {
                setError(error);
            }
        };
        fetchCategorias();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Hubo un error al cargar los gastos.</div>;
    }

    const renderLabel = ({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`;

    const pieData = categorias.map((categoria, index) => {
        const gastosCategoria = gastos.filter((gasto) => gasto.id_categoria === categoria.id_categoria);
        const totalGastos = gastosCategoria.reduce((acc, gasto) => acc + gasto.monto, 0);
        return {
            name: categoria.nombre,
            value: totalGastos,
            color: categoria.color || colorPalette[index % colorPalette.length],
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
export default PieChartGastos;
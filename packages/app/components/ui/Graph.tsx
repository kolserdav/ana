import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { GRAPH_XAXIS_DATA_KEY } from '../../utils/constants';

type GraphData = Record<string, string | number>;

function Graph({ dataKey, stroke, data }: { dataKey: string; stroke: string; data: GraphData[] }) {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 20,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={GRAPH_XAXIS_DATA_KEY} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={dataKey} stroke={stroke} activeDot={{ r: 8 }} />
    </LineChart>
  );
}

export default Graph;

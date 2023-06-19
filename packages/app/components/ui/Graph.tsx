import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { GRAPH_XAXIS_DATA_KEY } from '../../utils/constants';
import { timestampToTime } from '../Statistics.lib';

export type GraphData = Record<string, string | number>;

function Graph({
  dataKey,
  stroke,
  data,
  labelFormatter,
  formatter,
  width,
  height,
}: {
  width: number;
  height: number;
  dataKey: string;
  stroke: string;
  data: GraphData[];
  labelFormatter?: (d: any) => React.ReactNode;
  formatter?: (d: any) => React.ReactNode;
}) {
  return (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{
        top: 20,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={GRAPH_XAXIS_DATA_KEY} />
      <YAxis />
      <Tooltip
        contentStyle={{ color: 'blue', maxWidth: 'calc(100vw / 1.5)', whiteSpace: 'pre-wrap' }}
        labelFormatter={labelFormatter}
        formatter={formatter}
      />
      <Legend />
      <Line type="monotone" dataKey={dataKey} stroke={stroke} activeDot={{ r: 8 }} />
    </LineChart>
  );
}

Graph.defaultProps = {
  labelFormatter: undefined,
  formatter: undefined,
};

export default Graph;

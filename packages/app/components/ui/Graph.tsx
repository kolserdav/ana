import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { GRAPH_XAXIS_DATA_KEY } from '../../utils/constants';
import s from './Graph.module.scss';

export type GraphData = Record<string, string | number>;

function Graph({
  dataKey,
  stroke,
  data,
  labelFormatter,
  formatter,
  width,
  height,
  tickFormatter,
  allowDecimals,
}: {
  width: number;
  height: number;
  dataKey: string | string[];
  stroke: string | string[];
  data: GraphData[];
  // eslint-disable-next-line no-unused-vars
  labelFormatter?: (d: any) => React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  formatter?: (d: any) => React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  tickFormatter?: (value: any, index: number) => string;
  allowDecimals?: boolean;
}) {
  return (
    <div className={s.wrapper}>
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
        <YAxis allowDecimals={allowDecimals} tickFormatter={tickFormatter} />
        <Tooltip
          contentStyle={{ color: 'blue', maxWidth: 'calc(100vw / 1.5)', whiteSpace: 'pre-wrap' }}
          labelFormatter={labelFormatter}
          formatter={formatter}
        />
        <Legend />
        {typeof dataKey === 'string' && typeof stroke === 'string' ? (
          <Line type="monotone" dataKey={dataKey} stroke={stroke} activeDot={{ r: 8 }} />
        ) : (
          typeof dataKey === 'object' &&
          dataKey.map((item, index) => (
            <Line
              key={item}
              type="monotone"
              dataKey={item}
              stroke={stroke[index]}
              activeDot={{ r: 8 }}
            />
          ))
        )}
      </LineChart>
    </div>
  );
}

Graph.defaultProps = {
  labelFormatter: undefined,
  formatter: undefined,
  tickFormatter: undefined,
  allowDecimals: undefined,
};

export default Graph;

import type { NextApiRequest, NextApiResponse } from 'next';

import NextCors from 'nextjs-cors';
import { WS_ADDRESS } from '../../utils/constants';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  res.status(200).json({ status: 'info', data: WS_ADDRESS });
}

export default handler;

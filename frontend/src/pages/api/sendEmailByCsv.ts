import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      // Set file size limit to 10 MB
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/send-receipt-mail-by-csv`,
      {
        method: 'POST',
        headers: req.headers as HeadersInit,
        body: req.body,
      }
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return res.status(204).end();
  } catch (error) {
    return res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

import { rest } from 'msw';

export const handlers = [
  rest.get('/api/submissions', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          _id: '1',
          filename: 'test1.csv',
          status: 'Approved',
          entries: [],
          matches: 10,
          total_rows: 100,
          duplicates: 2,
        },
        {
          _id: '2',
          filename: 'test2.csv',
          status: 'Rejected',
          entries: [],
          matches: 5,
          total_rows: 50,
          duplicates: 1,
        },
      ]),
    );
  }),
  rest.post('/api/upload', (req, res, ctx) => {
    return res(ctx.json({ submissionId: '123' }));
  }),
  rest.put('/api/submissions/:id/status', (req, res, ctx) => {
    return res(ctx.json({ message: 'Status updated' }));
  }),
  rest.delete('/api/submissions/:id', (req, res, ctx) => {
    return res(ctx.json({ message: 'Submission deleted' }));
  }),
  rest.get('/api/submissions/:id/download', (req, res, ctx) => {
    return res(ctx.body('CSV file content'));
  }),
];

/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const pid: number = Number(req.query.id);
  switch (req.method) {
    case 'GET': {
      const QueryResult = await prisma.events.findMany();
      res.send(QueryResult);
      break;
    }
    case 'POST': {
      const QueryResult = await prisma.events.create({
        data: {
          title: req.body.title,
          start: req.body.start,
          end: req.body.end,
          color: req.body.color,
          z_index: req.body.z_index,
          created_by: req.body.created_by,
        },
      });
      res.send('Event Created');
      break;
    }
    default:
      res.status(403).send();
      break;
  }
}

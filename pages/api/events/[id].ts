/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const pid: number = Number(req.query.id);
  switch (req.method) {
    case 'GET': {
      const QueryResult = await prisma.events.findUnique({
        where: {
          id: pid,
        },

      });
      res.send(QueryResult);
      break;
    }
    case 'PUT': {
      const QueryResult = await prisma.events.update({
        where: {
          id: pid,
        },
        data: {
          title: req.body.title,
          start: req.body.start,
          end: req.body.end,
          color: req.body.color,
          z_index: req.body.z_index,
          created_by: req.body.created_by,
        },
      });
      res.send('Event Updated');
      break;
    }
    case 'DELETE': {
      const QueryResult = await prisma.events.delete({
        where: {
          id: pid,
        },
      });
      res.send('Event Deleted');
      break;
    }
    default:
      res.status(403).send();
      break;
  }
}

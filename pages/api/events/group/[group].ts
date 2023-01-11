/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const egroup: string = req.query.group;
  switch (req.method) {
    case 'GET': {
      const QueryResult = await prisma.events.findMany({
        where: {
          belong_to: egroup,
        },

      });
      res.send(QueryResult);
      break;
    }
    default:
      res.status(403).send();
      break;
  }
}

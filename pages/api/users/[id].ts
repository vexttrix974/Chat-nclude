/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const Id = Number(req.query.id);
  switch (req.method) {
    // Delete user

    case 'DELETE': {
      const QueryResult = await prisma.users.delete({
        where: {
          id: Id,
        },
      });
      res.status(200).send('User deleted');
      break;
    }

    // Update user
    case 'PUT': {
      const QueryResult = await prisma.users.update({
        where: {
          id: Id,
        },
        data: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          role_id: req.body.role_id,
          group_id: req.body.group_id,
        },
      });
      res.send(QueryResult);
      break;
    }

    // Get by ID
    case 'GET': {
      const QueryResult = await prisma.users.findUnique({
        where: {
          id: Id,
        },
      });
      if (!QueryResult) {
        res.status(404).send('User not found');
      } else {
        res.send(QueryResult);
      }
      break;
    }
    default:
      res.status(403).send();
      break;
  }
}

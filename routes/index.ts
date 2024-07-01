import express, { Request, Response, Express, NextFunction } from 'express';
import dbConnect from './repository';
import { cats } from './cats'
import { sql } from 'drizzle-orm';

const router = express.Router();
router.get('/cats/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("-check request- \n id : ", id);

  let connection;

  try {
    connection = await dbConnect();
    const result = await connection.select().from(cats).where(sql`id = ${id}`);
    res.json({ message: 'success', data: result });
    console.log(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
    return;

  }
})

router.get('/cats', async (req: Request, res: Response) => {

  let connection;

  try {
    connection = await dbConnect();
    const result = await connection.select().from(cats);
    res.json({ message: 'success', data: result });
    console.log(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
    return;

  }
});

router.post('/cats', async (req: Request, res: Response) => {
  const { name, age, breed } = req.body;
  console.log("Received data:", { name, age, breed });

  let connection;

  try {
    connection = await dbConnect();
    const [result] = await connection.insert(cats).values([{name, age, breed}]);
    res.json({ message: 'success', data: { id: (result as any).insertId, name, age, breed } });
    console.log(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });

  }

});

router.put('/cats/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, breed } = req.body;

  let connection;

  try {
    if (!id) {
      console.log("undifind id element.")
      res.status(400).json({ error: 'undifind Id unaccessed' });
      return;
    }
    connection = await dbConnect();
    const [result] = await connection.update(cats).set({name, age, breed}).where(sql`id = ${id}`);
    res.json({ message: 'update', data: { id, name, age, breed } });
    console.log("Put : ", id);
    console.log(result);

  } catch (err) {
    console.error("500err", err);
    res.status(500).json({ error: "500err" });
    return;

  }
})

router.delete('/cats/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  let connection;

  try {

    if (!id) {
      console.log("id null");
      res.status(400).json({ error: 'id is empty' });
      return;
    }
    connection = await dbConnect();
    const result = await connection.delete(cats).where(sql`id = ${id}`);
    res.json({ message: 'success', data: { id } });

    console.log("DELETED: ", result);

  } catch (err) {
    console.error("500err", err);
    res.status(500).json({ error: "500err" });
    return;

  }
});

export default router;
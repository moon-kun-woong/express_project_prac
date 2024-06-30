import express, { Request, Response, Express, NextFunction } from 'express';
import dbConnect from './repository';

const router = express.Router();
router.get('/cats/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("-check request- \n id : ", id);

  let connection;

  try {
    connection = await dbConnect();
    const [result] = await connection.query('SELECT * FROM cats WHERE id = ?', [id]);
    res.json({ message: 'success', data: result });
    console.log(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
    return;

  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing the database connection:', err);
      }
    }
  }
})

router.get('/cats', async (req: Request, res: Response) => {

  let connection;

  try {
    connection = await dbConnect();
    const [result] = await connection.query('SELECT * FROM `cats`');
    res.json({ message: 'success', data: result });
    console.log(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
    return;

  } finally {
  }
});

router.post('/cats', async (req: Request, res: Response) => {
  const { name, age, breed } = req.body;
  console.log("Received data:", { name, age, breed });

  let connection;

  try {
    connection = await dbConnect();
    const [result] = await connection.query(
      'INSERT INTO `cats` (name, age, breed) VALUES (?, ?, ?)',
      [name, age, breed]
    );
    res.json({ message: 'success', data: { id: (result as any).INSERT, name, age, breed } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });

  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing the database connection:', err);
      }
    }
  }

});

router.put('/cats/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  let connection;

  try {
    if (!id) {
      console.log("undifind id element.")
      res.status(400).json({ error: 'undifind Id unaccessed' });
      return;
    }
    connection = await dbConnect();
    const [result] = await connection.query('PUT FROM cats WHERE id=?', [id]);
    console.log("Put : ", id);
    console.log(result);


  } catch (err) {
    console.error("500err", err);
    res.status(500).json({ error: "500err" });
    return;

  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing the database connection:', err);
      }
    }
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
    const [result] = await connection.query('DELETE FROM cats WHERE id = ?', [id]);
    res.json({ message: 'success', data: { id } });

    console.log("DELETED: ", id);

  } catch (err) {
    console.error("500err", err);
    res.status(500).json({ error: "500err" });
    return;

  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing the database connection:', err);
      }
    }
  }
});

export default router;
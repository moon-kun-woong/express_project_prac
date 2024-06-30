import express, { Request, Response, Express, NextFunction } from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import indexRouter from './routes/index';
import createError from 'http-errors';

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT;

app.listen(PORT);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: createError.HttpError, req: Request, res: Response, next: NextFunction): any => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render(err.message);
});

export default app;

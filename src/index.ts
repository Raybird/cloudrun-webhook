import axios from 'axios';
import express, { Express, Request, Response } from 'express';
import qs from 'querystring';


const app: Express = express();
const port = 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/btc', express.json(), async (req: Request, res: Response) => {
  const body = req.body;

  const data = new URLSearchParams();
  data.append('message', body.message);

  // const BASE_URL = 'https://notify-api.line.me';
  // const PATH = '/api/notify';

  const options = {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization': 'Bearer ' + body.token
    }
  };

  try {
    axios.post(body.url, data, options)
      .then(resp => {
        res.json(resp.data);
      })
      .catch(error => {
        res.json(error);
      });
  } catch (error) {

  }
  // res.json(body);
});

app.post('/line/:token', express.json(), async (req: Request, res: Response) => {
  // https://trendinghook-35hnajh7qq-de.a.run.app/line/S8GCfmqx2jTFPzsGmySbBItIpMrinhqvIVxVtH3z9aK
  const token = req.params.token as string;
  const body = req.body as { message: string };

  console.log('body :>> ', body);

  if (token === undefined || token === '') {
    res.json({ result: false, message: 'token no found' })
  }

  const data = new URLSearchParams();
  data.append('message', body.message);

  // { "message": "{{ticker}} {{interval}} 多\n 點位:{{low}}\n 只損:{{plot("ATR Long Stop Loss")}} \n 只盈:{{plot("longWin")}}" }
  // { "message": "{{ticker}} {{interval}} 空\n 點位:{{high}}\n 只損:{{plot("ATR Short Stop Loss")}}\n 只盈:{{plot("shortWin")}}" }
  const notifyURL = 'https://notify-api.line.me/api/notify';

  const options = {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization': 'Bearer ' + token
    }
  };

  try {
    axios.post(notifyURL, data, options)
      .then(resp => {
        res.json(resp.data);
      })
      .catch(error => {
        res.json(error);
      });
  } catch (error) {

  }
  // res.json(body);
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
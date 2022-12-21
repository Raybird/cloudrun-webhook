import axios from 'axios';
import express, { Express, Request, Response } from 'express';


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

app.post('/line/v2/:token', express.json(), async (req: Request, res: Response) => {
  const token = req.params.token as string;
  const body = req.body as {
    exchange?: string,
    ticker: string,
    interval: number;
    type: 'buy' | 'sell',
    close: number;
    lost: number;
    win1: number;
    win2: number;
    atr: number;
    high: number;
    low: number;
  };

  // 空
  // { 
  // "exchange": "{{exchange}}",
  //   "ticker": "{{ticker}}",
  //   "interval": {{interval}},
  //   "type": "sell",
  //   "close": {{close}},
  //   "lost": {{plot("ATR Short Stop Loss")}},
  //   "win1": {{plot("shortWin")}},
  //   "win2": {{plot("shortWin2")}},
  //   "atr": {{plot("atr")}}
  // }

  // 多
  // { 
  // "exchange": "{{exchange}}",
  //   "ticker": "{{ticker}}",
  //   "interval": {{interval}},
  //   "type": "buy",
  //   "close": {{close}},
  //   "lost": {{plot("ATR Long Stop Loss")}},
  //   "win1": {{plot("longWin")}},
  //   "win2": {{plot("longWin2")}},
  //   "atr": {{plot("atr")}}
  // }

  console.log('body :>> ', body);

  if (token === undefined || token === '') {
    res.json({ result: false, message: 'token no found' })
  }

  const atr = Math.round(body.atr * 10000) / 10000;
  const lost = Math.round(body.lost * 10000) / 10000;
  const win1 = Math.round(body.win1 * 10000) / 10000;
  const win2 = Math.round(body.win2 * 10000) / 10000;

  let message = `
  ${body.type === 'buy' ? '多' : '空'} ${body.ticker} 
  現價: ${body.close}
  高低: ${body.high} - ${body.low}

  止損: ${lost}

  止盈1: ${win1}
  止盈2: ${win2}

  盈虧值: ${atr}

  區間: ${body.interval}
  交易所: ${body.exchange}`;

  console.log('message :>> ', message);

  const data = new URLSearchParams();
  data.append('message', message);

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

});

app.post('/line/:token', express.json(), async (req: Request, res: Response) => {
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
  // { "message": "{{ticker}} {{interval}} 多\n點位:{{low}}\n止損:{{plot("ATR Long Stop Loss")}}\n止盈1:{{plot("longWin")}}\n止盈2:{{plot("longWin2")}}" }
  // { "message": "{{ticker}} {{interval}} 空\n點位:{{high}}\n止損:{{plot("ATR Short Stop Loss")}}\n止盈1:{{plot("shortWin")}}\n止盈2:{{plot("shortWin2")}}" }
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
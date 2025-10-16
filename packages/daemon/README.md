# NodeJS RS485 Daemon

NodeJS application to communicate with the RS485 board.

Uses WebSockets to exchange messages with the UI.


## Run it (standalone)

```bash
node index.js
```

## Usage
In the actual prodution configuration, this should be ran as a daemon service in the Raspberry Pi. 

## Info
The daemon sends and receives messages every 100ms (```tx_loop.js```)

The WS api only mutates the state of a given perif, which is then sent by the cron job at the next iteration.

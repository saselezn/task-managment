import * as config from 'config';
import { initApp } from './server';

const port = config.get('app.port');

initApp().then(app => app.listen(port, () => console.log(`server listening on ${port}`)));

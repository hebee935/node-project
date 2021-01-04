'use strict';

import route_api_v1 from './routes/api/v1';

export default function (app) {
    app.use('/heartbeat', (_req, res) => {
        res.json({ success: true });
    });

    // TODO: version 관리

    app.use('/api/v1', route_api_v1);
}
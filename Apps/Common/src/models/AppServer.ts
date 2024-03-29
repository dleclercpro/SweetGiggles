import http from 'http';
import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { Logger } from 'pino';
import { Service } from '../types/ServiceTypes';

class AppServer {
    protected service: Service;
    protected logger: Logger;

    protected app?: express.Express;
    protected server?: http.Server;

    public constructor(service: Service, logger: Logger) {
        this.service = service;
        this.logger = logger;
    }

    public async setup(router: Router) {
        this.app = express();
        this.server = http.createServer(this.app);
    
        // Enable use of cookies
        this.app.use(cookieParser());
    
        // Enable use of JSON data
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    
        // Enable HTTP response compression
        this.app.use(compression());

        // Public static files
        this.app.use('/', express.static('public'));
    
        // Define server's API endpoints
        this.app.use('/', router);
    }

    public getApp() {
        return this.app;
    }

    public getServer() {
        return this.server;
    }

    public async start() {
        if (!this.server) throw new Error('MISSING_SERVER');

        const { name, port } = this.service;

        this.server.listen(this.service.port, async () => {
            this.logger.info(`'${name}' app server listening on port: ${port}`);
        });
    }

    public async stop() {
        if (!this.server) throw new Error('MISSING_SERVER');

        return new Promise<void>((resolve, reject) => {
            this.server!.close((err) => {
                if (err) {
                    this.logger.fatal(`Could not shut down server gracefully: ${err}`);
                    reject(err);
                }

                this.logger.info(`Server shut down gracefully.`);
                resolve();
            });
        });
    }
}

export default AppServer;
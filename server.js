'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const path = require('path');

const init = async () => {

    const server = Hapi.server({
        host: 'localhost',
        port: 1234,
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'static')
            }
        }
    });

    await server.register([
        {
            plugin: require('hapi-geo-locate'),
            options: {
                enabledByDefault: true
            }
        },
        {
            plugin: Inert
        },
        {
            plugin: require('@hapi/vision')
        }
    ]);

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        path: path.join(__dirname, 'views'),
        layout: 'default'
    });

    server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('welcome.html');
        }
    },
    {
        method: 'GET',
        path: '/dynamic',
        handler: (request, h) => {
            const data = {
                name: 'Admin'
            };
            return h.view('index', data)
        }
    },
    // {
    //     method: 'POST',
    //     path: '/login',
    //     handler: (request, h) => {
    //         // console.log(request.payload.username);
    //         // console.log(request.payload.password);
    //         // return 'Hi!';
    //         // if (request.payload.username === 'admin' && request.payload.password === 'admin') {
    //         //     return 'Login Successful!';
    //         // } else {
    //         //     return 'Login Failed!';
    //         // }
    //         if (request.payload.username === 'admin' && request.payload.password === 'admin') {
    //             return h.file('logged-in.html')
    //         } else {
    //             return h.redirect('/');
    //         }
    //     }
    // },
    {
        method: 'POST',
        path: '/login',
        handler: (request, h) => {
            return h.view('index', { username: request.payload.username })
        }
    },
    {
        // example of using a hapi plugin to get location
        method: 'GET',
        path: '/location',
        handler: (request, h) => {
            if (request.location) {
                return request.location;
            } else {
                return 'Location not enabled by default!';
            }
        }
    },
    {
        method: 'GET',
        path: '/users',
        handler: (request, h) => {
            return 'Users Page!';
        }
    },
    {
        method: 'GET',
        path: '/download',
        handler: (request, h) => {
            return h.file('welcome.html', {
                mode: 'attachment',
                filename: 'welcome-download.html'
            });
        }
    },
    {
        method: 'GET',
        path: '/{any*}',
        handler: (request, h) => {
            return '404 Error! Page Not Found!';
        }
    }]);

    await server.start();
    console.log(`Server running on: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

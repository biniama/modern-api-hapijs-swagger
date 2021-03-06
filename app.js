const hapi = require('hapi');

const mongoose = require('mongoose');
mongoose.connect('mongodb://user:password1@ds151702.mlab.com:51702/modern-api');
mongoose.connection.once('open', () => {
    console.log('connected to database');
}
);

const Painting = require('./models/painting');

//Graphiql is the in-browser IDE for exploring GraphQL.
const { graphqlHapi, graphiqlHapi } =  require('apollo-server-hapi');
const schema = require('./graphql/schema');

/* swagger section */
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});

const init = async () => {

	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: 'Paintings API Documentation',
					version: Pack.version
				}
			}
		}
	]);

	await server.register({
		plugin: graphiqlHapi,
		options: {
			path: '/graphiql',
			graphiqlOptions: {
				endpointURL: '/graphql'
			},
			route: {
				cors: true
			}
		}
	});

	await server.register({
		plugin: graphqlHapi,
		options: {
			path: '/graphql',
			graphqlOptions: {
				schema
			},
			route: {
				cors: true
			}
		}
    });
    
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, reply) => {
                return "My modern api";
            }
        },
        {
            method: 'GET',
            path: '/api/v1/paintings',
            config: {
                description: 'Get all the paintings',
                tags: ['api', 'v1', 'paintings']
            },
            handler: (request, reply) => {
                return Painting.find();
            }
        },
        {
            method: 'POST',
            path: '/api/v1/paintings',
            config: {
                description: 'Add a painting',
                tags: ['api', 'v1', 'paintings']
            },
            handler: (request, reply) => {
                const { name, url, technique } = request.payload;
                const painting = new Painting({
                    name, 
                    url,
                    technique
                });

                return painting.save();
            }
        }
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

init();
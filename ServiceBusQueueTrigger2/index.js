// module.exports = async function(context, mySbMsg) {
//     context.log('JavaScript ServiceBus queue trigger function processed message', mySbMsg);
// };


const axios = require('axios');
const { getToken } = require('./auth');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
    ]
})


module.exports = async function (context, req) {
    try {

        const requestId = uuidv4();
        logger.info({ event: 'Function Start', requestId });

        logger.info({ event: 'Request data {}', requestId, req });

        context.log("REQUEST==>", req);

        const accessToken = await getToken();
        const salesforceApiUrl = 'https://dream-nosoftware-499.my.salesforce.com/services/data/v25.0/sobjects/Contact';

        const createContactResponse = await axios.post(salesforceApiUrl, req, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        context.log("Contact Created", createContactResponse.data);

        context.log("Fetch all the Contacts--------------");

        const response = await axios.get(salesforceApiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        const data = response.data;

        context.log("Data==>", data);
        //    context.res = {
        //        status: 200,
        //        body: data
        //    };
    } catch (error) {
        context.log("Data==>", error);
        context.res = {
            status: 500,
            body: "Internal Server Error"
        }
        logger.error({ event: 'API Request failed', requestId, error });
        // context.res = {
        //     status: 500,
        //     body: error.message
        // };
    } finally {
        logger.error({ event: 'Function ended', requestId });
    }
};
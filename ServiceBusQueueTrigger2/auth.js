const axios = require('axios');

// Salesforce conf
const salesforceConfig = {
    clientId: '3MVG95mg0lk4batgXsIfxmF4cCf2xt9s_4TOoW4cmSUM6DITFPZGEiwkbt5vhgmbjHfSjZVSTjbTMB.4Q4t2k',
    clientSecret: 'AC95EECDF4C5968F1E65D9D976821333ECDA02F28101B0CFF56AFC0DAF9A593D',
    refreshToken: '5Aep861sDdjizbO.v67LqnYf.ft9iRXFahTWmFnFE51_rEreGDFEfhUW25TKGNOSuGDq4e7jLcMOVcZaZLU3YRW',
    accessToken: '',
    tokenExpiration: 0,
    instanceUrl: 'https://dream-nosoftware-499.my.salesforce.com',
};


async function getToken() {
    
    if (salesforceConfig.tokenExpiration > Date.now()) {
        return salesforceConfig.accessToken;
    } else {
        try {
            const response = await axios.post(`${salesforceConfig.instanceUrl}/services/oauth2/token`, null, {
                params: {
                    grant_type: 'refresh_token',
                    client_id: salesforceConfig.clientId,
                    client_secret: salesforceConfig.clientSecret,
                    refresh_token: salesforceConfig.refreshToken,
                },
            });


            // Update access token
            salesforceConfig.accessToken = response.data.access_token;
            salesforceConfig.tokenExpiration = Date.now() + response.data.expires_in * 1000;

            return salesforceConfig.accessToken;
        } catch (error) {
            throw new Error(`Failed to refresh access token: ${error.message}`);
        }
    }
}


module.exports = { getToken };

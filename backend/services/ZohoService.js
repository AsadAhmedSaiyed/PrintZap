const axios = require('axios');
const FormData = require('form-data'); // Native in node 18+, but let's see if axios needs it or URLSearchParams
const qs = require('querystring');

class ZohoService {
    constructor() {
        this.clientId = process.env.ZOHO_CLIENT_ID;
        this.clientSecret = process.env.ZOHO_CLIENT_SECRET;
        this.refreshToken = process.env.ZOHO_REFRESH_TOKEN;
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const url = 'https://accounts.zoho.com/oauth/v2/token';
            const params = new URLSearchParams();
            params.append('refresh_token', this.refreshToken);
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            params.append('grant_type', 'refresh_token');

            const response = await axios.post(url, params);

            if (response.data.error) {
                console.error('Zoho Token Error:', response.data.error);
                throw new Error('Failed to refresh Zoho Token');
            }

            this.accessToken = response.data.access_token;
            // Zoho tokens typically last 1 hour. Set expiry to 55 mins to be safe.
            this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
            console.log('🔄 Zoho Access Token Refreshed');
            return this.accessToken;
        } catch (error) {
            console.error('Network Error refreshing Zoho Token:', error.message);
            throw error;
        }
    }

    async deleteFile(resourceId) {
        if (!resourceId) return;

        try {
            const token = await this.getAccessToken();
            // WorkDrive API for Deleting a File/Folder (Move to Trash)
            // Endpoint: PATCH https://www.zohoapis.com/workdrive/api/v1/files/{resource_id}
            // Body: { "data": { "attributes": { "status": "trash" } } }
            // Note: Check specific API docs. Usually trash is how you delete.

            const url = `https://www.zohoapis.com/workdrive/api/v1/files/${resourceId}`;
            const body = {
                data: {
                    attributes: {
                        status: "trash"
                    }
                }
            };

            await axios.patch(url, body, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/vnd.api+json'
                }
            });
            console.log(`🗑️ Deleted WorkDrive File: ${resourceId}`);
            return true;
        } catch (error) {
            console.error('Error deleting WorkDrive file:', error.response?.data || error.message);
            return false;
        }
    }
}

module.exports = new ZohoService();

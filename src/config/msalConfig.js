
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: "TU_CLIENT_ID",
        authority: "https://login.microsoftonline.com/TU_TENANT_ID",
        redirectUri: "http://localhost:3000",
    },
};

export const msalInstance = new PublicClientApplication(msalConfig);

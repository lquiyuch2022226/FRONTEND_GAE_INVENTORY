
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: "7d105d0d-94ca-4645-873d-4bd5edf190bb",
        authority: "https://login.microsoftonline.com/a00e95d9-ed09-478e-9f3a-7aa025deb516",
        redirectUri: "https://frontend-gae-inventory-rkmq.vercel.app/",
    },
};

export const msalInstance = new PublicClientApplication(msalConfig);

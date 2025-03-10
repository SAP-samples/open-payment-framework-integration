# OPF Sample Storefront

A sample non-spartacus react based code base integrated with OPF-JS-SDK library which uses OPF service for payments checkout flow.

## Getting Started

First, run the application server:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

Open [http://localhost:4200](http://localhost:4200) with your browser to see the result.

## Configure Environment

A sample environment is already configured for demo. You can start editing the environment file by modifying `src/app/constant.ts`. 
Replace the required `BASE_URL` of CCV2 and OPF that are configured to work together with other details.

## Learn More - Integrate OPF-JS-SDK

To learn more about `opf-js-sdk`, take a look at the following resources:

Setup library using the below SAP Note and documentation:

- [3548464](https://me.sap.com/notes/3548464) - Open Payment Framework: JavaScript SDK for Custom Storefronts

- [Integrate opf-js-sdk Documentation](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/72ae7fad40264d228a08dc3e9e57ebfb/9335430ccf5846d58fab7b49e57fa56b.html?locale=en-US&state=DRAFT&version=DEV) - learn about steps to integrate.

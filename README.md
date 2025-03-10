# SAP Commerce Cloud, Open Payment Framework

## Overview

This repository provides **working examples of pre-built integrations** for payment gateways and payment methods, delivered as Postman Collections and storefront setup samples. Leverage these resources within your SAP Commerce Cloud, Open Payment Framework tenant to streamline integration.

**Key Features**  
- **Freedom of Choice**: Our support for Payment Service Providers (PSPs) goes beyond the examples listed, offering a broader range of choices and integrations, ensuring freedom in selecting the payment solutions that best fit your needs.  
- **Customization**: Configure your own payment gateways to integrate with any PSP, and enable the specific payment methods (e.g., credit cards, digital wallets) they support. Additionally, we support the configuration of standalone payment methods, allowing you to incorporate unique or specialized payment options tailored to your business requirements.

**Important Notes**  
- The provided samples are **reference implementations** for select PSPs and are **not officially supported** by SAP or payment providers.  
- **Thoroughly test integrations** in your OPF tenant before deploying to production.  
- Adapt the templates or build custom integrations to meet your unique business requirements.  

---

## Before Importing  
### Environment Variables Explained  
Here’s the meaning of some key fields in the environment variables:  

- **token**: A Bearer token used to access the Open Payment Framework core. This token is generated by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).  

- **rootUrl**: The root URL of the Open Payment Framework service, e.g., `https://opf-iss-d0.api.commerce.stage.context.cloud.sap`.  

- **service**: The name of your Open Payment Framework service in a specific environment. The default value is `opf`.  

- **accountGroupId**: The ID of the payment integration you created in the Open Payment Framework Workbench.  

- **accountId**: The ID of the configuration you created under the payment integration.  

---

## Requirements  
- A licensed **SAP Commerce Cloud, open payment framework Tenant**.  
- One or more test/live merchant accounts for the Payment Gateway/Method you are importing the collection for.  

---

## Download and Installation  
1. Replace the payment account-specific secrets and variables in the environment file.  
2. Import the Postman collection with the updated environment settings into your Open Payment Framework tenant as described on the [SAP Help Portal](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/562879e4d6fd4826b5d82219e5f19412.html).  

---

## Known Issues  
No known issues at this time.  

---


## Troubleshooting  
Refer to the [Open Payment Framework Logging](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/9177e614020947c6a5ea457e1f1d29ea/beab05c2985242d396b6f454dc1b8bea.html) feature for troubleshooting.  

---

## Contributing  
You are welcome to add collections for other gateways to this repository.  

To contribute:  
1. Create a fork of the repository.  
2. Make your changes and create a **Pull Request**.  
3. The repository administrator will review and merge your changes.  

---

## License  
Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.  

This project is licensed under the **Apache Software License, version 2.0**, except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.

---

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/open-payment-framework-integration)](https://api.reuse.software/info/github.com/SAP-samples/open-payment-framework-integration)
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/open-payment-framework-integration)](https://api.reuse.software/info/github.com/SAP-samples/open-payment-framework-integration)


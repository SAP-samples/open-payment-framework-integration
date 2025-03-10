## Introduction

The Postman Collection enables a [Airwallex Hosted Page](https://developer.paypal.com/braintree/docs/start/hosted-fields) Payment Form to be used to take payments through OPF. 

The integration supports:

* Authorization of Card Payments using PCI SAQ-A Airwallex Hosted Page using the OPF "Payment Page" UX Pattern
* Deferred Capture 
* Refunds
* Reversal

## Known Issues
* Auto currency conversion should be disabled under the Account -> Payment -> [Settings](https://demo.airwallex.com/app/acquiring/settings) menu
  
![](images/airwallex-autocurrencyconversion.png)

Dynamic pay-in currencies are currently not supported by OPF. Please contact SAP if this feature is required for production use.

## Planned Backlog Items
* Recurrent Authorization


## Setup Instructions

### Overview
To import the [Aiwallex Hosted Page Postman Collection](mapping_configuration.json) this page will take you through the following steps:

a) Sign up for a Airwallex Demo Account

b) Complete onboarding the activate the Airwallex account

c) Create a payment integration in OPF workbench.

d) Set up your Airwallex Sandbox account to work with OPF.

e) Prepare the [Postman Environment](environment_configuration.json) file so the collection can be imported with all your OPF Tenant and Airwallex Demo Account unique values. 


### Create a Airwallex Account
You can sign up for a free Airwallex Demo Account at https://demo.airwallex.com/signup.

Before you can proceed Aiwallex requires an onboarding pricess to be completed that involves account verification.

![](images/airwallex-account-verification.png)

To create a test account without completeting the company onboarding you will need to contact Airwallex support.

It will not be possible to proceed otherwise.


### Creating Payment Integration
Create a new integration in the OPF workbench and set the Merchant ID. For reference, see [Creating Payment Integration](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

You can use the Account Nickname value as the Merchant ID from the [Account menu](https://demo.airwallex.com/app/account/details) 

![](images/airwallex-account-nickname.png)


### Preparing the Postman environment_configuration file

**1. Token**

Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).

Copy the value of the access_token field (it’s a JWT) and set as the ``token`` value in the environment file.

IMPORTANT: Ensure the value is prefixed with **Bearer**. e.g. ``Bearer {{token}}``.

**2. Root url**

The ``rootUrl`` is the **BASE URL** of your OPF tenant.

E.g. if your workbench/OPF cockpit url was this …

<https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench>.

The base Url would be

https://opf-iss-d0.uis.commerce.stage.context.cloud.sap.


**3. Integration ID and Configuration ID**

The ``integrationId`` and ``configurationId`` values identify the payment integration and payment configuration, which can be found in the top left of your **Configuration Details** page in the OPF workbench.

* ``integrationId`` maps to ``accountGroupId`` in postman
* ``configurationId`` maps to ``accountId`` in postman

**4. API Credentials**

The ``clientId`` and ``apiKey`` values can  be found from the [Api Keys](https://demo.airwallex.com/app/account/apiKeys) menu found under Developer.

![](images/airwallex-add-api-key.png)

You can use the Admin key for demo/sandbox testing, but restricted keys are recommended for production.

**5. Webhook Secret**

IN OPF Workbench: For your new Airwallex merchant account Navigate to **Notification General** and copy the Notification URL.

![](images/opf-get-notification-url.png)

In the Airwallex dashboard you need to navigate to Account -> Developer -> [Webhooks](https://demo.airwallex.com/app/developer/webhooks) and add a Webhook endpoint. 

i) Paste in your endpoint URL copied from OPF.

ii) Check **All Payment . Payment Attempt events**.

![](images/airwallex-webhooks2.png)

ii) Save and View the secret key and set that as the ``webhookSecret`` variable

![](images/airwallex-webhooks1.png)

### Allowlist
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``airwallex.com``

### Webhook IP Allowlist
In addition to the webhook signature, the integration also allows only [published Airwallex IP addresses](https://www.airwallex.com/docs/developer-tools__listen-for-webhook-events#whitelist-ip-addresses) from the Demo and Production environment. The list of allowed IPs was last verified on 02/12/2024.

### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables: 

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId``

#### Airwallex Specific
- ``clientId``
- ``apiKey``
- ``webhookSecret``
  
For sandbox testing, all other values can be left as defaults.  

### Airwallex Setup
More documentation regarding setup of settlement currencies and payment methods can be found [here](https://www.airwallex.com/docs/payments__get-started-with-payments__set-up-your-merchant-account). Ensure at least one payment method is activated.

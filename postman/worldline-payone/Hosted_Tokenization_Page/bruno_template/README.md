## Introduction ##
The  Bruno Collection aids in integrating [Payone Hosted Tokenization Page](https://developer.payone.com/en/integration/basic-integration-methods/hosted-tokenization-page#sendadditionaltokenizerarguments) into the Open Payment Framework (OPF).

please make sure the version of Bruno is 3.1.4 or above.

The integration supports:

* Authorization.
*  Capture 
* Refunds
* Reversal

**In summary**: to import the [Payone Hosted Tokenization page  Bruno Collection](https://github.com/SAP-samples/open-payment-framework-integration) this page will guide you through the following steps: 

a) [Create your Payone test account](https://signup.preprod.payone.com).

b) Create a Payone payment integration in OPF.

c) Get the credentials for your Payone integration.

d) Preparing  Bruno Environment Variables  so the collection can be imported with all your OPF tenant and Payone test account unique values. 

e) Validate the configuration in OPF workbench.


### Creating a Payone Account ###

You can sign up for a free Payone  test account at [Create your Payone test account](https://signup.preprod.payone.com).
Once registered, activate at least one of Payone's available card payment methods (e.g., Visa, Mastercard) through the merchant portal under Business > Payment methods.

### Creating a Payone Payment Integration ###

Create a Payone payment integration in the OPF workbench. For reference, see [Creating Payment Integration
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

For step 6. The Merchant ID is the PSP ID, You can found it in the Payone merchant portal.

![](../images/Payone_merchant_id.png)


### Get the credentials for your Payone integration ###

Once you have created you Payone test account, do the following to set it up to work with OPF:

1. Configure the payment API key/secret pair in the Merchant Portal, follow these steps:

Login to the Merchant Portal. Go to Developer > Payment API.
If you have not configured anything yet, the screen shows "No keys generated". To create both a API Key / Secret pair, click on “Add API Key”. The screen now shows both codes in the table in the “API Key ID” / “Secret API Key” line respectively

**Note**
API Secret key will only be displayed once, so make sure to copy it and store it securely. we will need it later when preparing the Bruno environment.

![](../images/Payone_apiKeys.png)


2. Webhook configuration

Login to the Merchant Portal. Go to Developer > Webhooks.
If you have not configured anything yet, the screen shows "No keys generated" / "You don’t have endpoints configured at the moment."
You have two options to set up the webhook key/secret:

a) Click on "Generate webhooks keys". The screen now shows both the "Webhooks ID" and the affiliated "Secret Webhook Key" in the table.
b) Click on "Create webhooks keys". Enter your own Webhook ID/Webhook Secret Key and click on "Confirm".

**Note**
Webhook Secret key will only be displayed once, so make sure to copy it and store it securely. we will need it later when preparing the Bruno environment.

![](../images/Payone_webhook.png)


## Preparing  Bruno Environment Variables For your  OPF

Open Bruno and import this Bruno collection file into your workspace.

![](../images/payone_bruno_import1.png)

Next, open the Environment configuration.

![](../images/payone_bruno_import2.png)

Then update the variable values according to the following instructions:

![](../images/payone_bruno_import3.png)


**1. Token**

Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).

Copy the value of the access_token field (it’s a JWT) and set as the ``token`` value in the environment file.

**IMPORTANT**: Ensure the value is prefixed with **Bearer**. e.g. ``Bearer {{token}}``.

**2. Root url**

The ``rootUrl`` is the **BASE URL** of your OPF tenant.

E.g. if your workbench/OPF cockpit url was this …<https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench>. The base Url would be https://opf-iss-d0.uis.commerce.stage.context.cloud.sap.

**3. Integration ID and Configuration ID**

The ``integrationId`` and ``configurationId`` values identify the payment integration and payment configuration, which can be found in the top left of your **Configuration Details** page in the OPF workbench.

* ``integrationId`` maps to ``accountGroupId`` in Bruno
* ``configurationId`` maps to ``accountId`` in Bruno

**4. apiKey and  apiSecret**

Fetch the stored ``apiKey and  apiSecret`` during your API key/secret pair configuration step.

**5. webhookSecret**

Fetch the stored ``secret webhook secret key`` during your Webhook configuration step.

**6. skipThreeDSAuth**

* True,3D Secure authentication will be skipped for this transaction.
* False,3D Secure authentication will not be skipped for this transaction.


### Allowlist
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``payment.payone.com`` for production
``payment.preprod.payone.com`` for test


## Summary
The environment file is now ready to import into Bruno. Make sure you have enabled the environment for this configuration, then save and run the collection:

![](../images/payone_burno_run.png)



## Validating the Configuration in OPF Workbench

   1. Log in to the OPF workbench.
   2. Click **Payment Integrations** in the left navigation bar.
   3. Navigate to **Payment Integrations** -> **(your Payone integration)** -> **Integration Details**.
   4. In the **Configuration section**, click **Show Details** to go to the configuration details page.
   5. In the **Settlement Method** section, make sure the right option is selected depending on your integration.
   6. In the **Authorization** section, click **Edit** to go to the authorization details page.
   7. In **Authorization** -> **Front-end component configuration**, make sure the Payment Form is the one corresponding to your integration.

## Introduction ##
The Postman Collection enables the integration of Worldpay for payment processing through open payment framework(OPF).


The integration supports:

* Authorization of Worldpay payments using the OPF "iFrame" UX pattern
* Deferred Capture support
* Refunds
* Reauthorization of saved payment

**In summary**: to import the [Worldpay iFrame Postman Collection](https://github.com/opf-postman/commerce-cloud-open-payment-integration/blob/main/postman/worldpay/iFrame/Worldpay%20-%20iFrame%20-%20CAPTURE_PER_SHIPMENT%20-%20OPF_Environment_Configuration.json) this page will guide you through the following steps: 

a) Create your Worldpay test account.

b) Create a Worldpay payment integration in OPF workbench.

c) Set up your Worldpay test account to work with OPF.

d) Prepare the [Postman Environment](https://github.com/opf-postman/commerce-cloud-open-payment-integration/blob/main/postman/worldpay/iFrame/Worldpay%20-%20iFrame%20-%20CAPTURE_PER_SHIPMENT%20-%20OPF_Provider_Configuration.json) file so the collection can be imported with all your OPF tenant and Worldpay test account unique values. 

e) Validate the configuration in OPF workbench.


## Creating a Worldpay Account ##
You can sign up for a free Worldpay test account at <https://secure.worldpay.com/sso/public/auth/login.html>.


## Creating a Worldpay Payment Integration 
Create a Worldpay payment integration in the OPF workbench. For reference, see [Creating Payment Integration
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).


## Setting up Your Worldpay Test Account to Work with OPF

   Once you have created you Worldpay test account, do the following to set it up to work with OPF:

1. In the left navigation panel, choose **Integration** -> **Merchant Channel** to configure the messages and content settings at corresponding sections for Test and Production purposes.
   
   a) Enable XML message for HTTP notifications.
   
   b) Enter the notification URL previously saved in the **Address** field.
   
   c) Select the events that you want to receive.
   
   d) Save the settings.

2. In the left navigation panel, choose **Integration** -> **Apple Pay** to generate Apple Pay Certificate Sign Secret (CSR) if you want to enable Apple Pay payments via web or app.
   
    For detailed instructions to configure a direct Apple Pay integration to WorldPay, see <https://developer.worldpay.com/docs/wpg/mobilewallets/applepay>.
   

3. In the left navigation panel, choose **Integration** -> **Google Pay** to generate a unique merchant ID if you want to enable Google Pay payments via web or app.

   For detailed instructions to configure a direct Google Pay integration to WorldPay, see <https://developer.worldpay.com/docs/wpg/mobilewallets/googlepay>.
   

4. In the left navigation panel, choose **Integration** -> **Configuration Details** to deactivate the **Capture Delay** option.

5. In the left navigation panel, choose **Integration**-> **Installations** to copy the installation ID.



## Preparing the Postman environment_configuration file

**1. Token**

Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).

Copy the value of the access_token field (it’s a JWT) and set as the ``token`` value in the environment file.

**IMPORTANT**: Ensure the value is prefixed with **Bearer**. e.g. ``Bearer {{token}}``.

**2. Root url**

The ``rootUrl`` is the **BASE URL** of your OPF tenant.

E.g. if your workbench/OPF cockpit url was this …<https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench>. The base Url would be https://opf-iss-d0.uis.commerce.stage.context.cloud.sap.

**3. Integration ID and Configuration ID**

The ``integrationId`` and ``configurationId`` values identify the payment integration and payment configuration, which can be found in the top left of your **Configuration Details** page in the OPF workbench.

* ``integrationId`` maps to ``accountGroupId`` in Postman
* ``configurationId`` maps to ``accountId`` in Postman

**4. merchantCode** 

You can obtain your merchant ID in the Worldpay Dashboard.


## Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

## Allowlist
Depending on your environment, add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``try.access.worldpay.com``
``access.worldpay.com``


## Editing the Postman Collection in the Postman App

   1. Import the two files at the same time to Postman.

   2. Make sure to select the environment for Worldpay.

   3. Edit the Postman environment file so the collection can be imported with all your OPF Tenant and Worldpay Test Account unique values.

| Name                                                                                 | Description                                                  
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| token                                                                                | Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html). **IMPORTANT**: Ensure the value is prefixed with Bearer. e.g. Bearer {{token}}.  |                  
| rootURL                                                                              | The ``rootUrl`` is the ``BASE URL`` of your OPF tenant.  E.g. if your workbench/OPF cockpit url was this … https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench. The base Url would be: https://opf-iss-d0.uis.commerce.stage.context.cloud.sap.|                  
| service                                                                       | The ``service`` is the name of your OPF service in specific environment. This value is ``opf`` by default. |
| accountGroupId                                                                       |Refers to the ``integrationId`` value that identifies the payment integration, which can be found in the top left of your configuration details page.|                  
|  accountId                                                                    |Refers to the``configurationId`` value that identifies the payment confguration, which can be found in the top left of your configuration details page.|                                                                          
| authentication_inbound_basic_auth_username                                           | The username for basic authentication. Go to **Account** -> **Profile** to get the value.|                  
| authentication_inbound_basic_auth_password                                           | The password for basic authentication. Go to **Account** -> **Profile** to get the value.|                  
| capturePattern                                                                       | ``CAPTURE_PER_SHIPMENT``|                  
| supportOverCapture                                                                   | ``true``|                  
| enableOverCapture                                                                    | ``true``|                  
| authorizationTimeoutDays                                                             | 7   |                                  
|merchantCode                                                                          |Your merchant ID. Go to **Account** -> **Profile** to get the value.|
|installationId                                                                        |Go to **Integration** -> **Installations** to get the value.|
       
   5. Save and run the Postman collection.


## Validating the Configuration in OPF Workbench

   1. Log in to the OPF workbench.
   2. Click **Payment Integrations** in the left navigation bar.
   3. Navigate to **Payment Integrations** -> **(your Worldpay integration)** -> **Integration Details**.
   4. In the **Configuration section**, click **Show Details** to go to the configuration details page.
   5. In the **Settlement Method** section, make sure the right option is selected depending on your integration.
   6. In the **Authorization** section, click **Edit** to go to the authorization details page.
   7. In **Authorization** -> **Front-end component configuration**, make sure the Payment Form is the one corresponding to your integration.


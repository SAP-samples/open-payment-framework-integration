## Introduction

The Postman Collection enables a [Komoju Hosted Page](https://doc.komoju.com/docs/hosted-page-overview) to be used to take payments for cards and alternative payment methods through OPF. 

The integration supports:

* Authorization of Card and APM Payments using PCI SAQ-A Komoju Hosted Page using the OPF "Payment Page" UX pattern
* Auto Capture Only
* Refunds
* Card/Alipay and Web Money integrations tested


## Planned Backlog Items
* Deferred Capture for Cards


## Setup Instructions

### Overview
To import the [Komoju Hosted Page Postman Collection](mapping_configuration.json) this page will take you through the following steps:

a) Sign up for a Komoju Account.

b) Create a payment integration in OPF Workbench.

c) Set up your Komoju account to work with OPF.

d) Prepare the [Postman Environment](environment_configuration.json) file so the collection can be imported with all your OPF tenant and Komoju account unique values. 


### Create a Komoju Account
You can sign up for a free Komoju account at https://komoju.com/en/sign_up/.

To test the integration with [test payment data](https://doc.komoju.com/docs/test-cards) you do not need to activate payments.


### Creating Payment Integration
Create a new payment integration in the OPF Workbench and set the Merchant ID. For reference, see [Creating Payment Integration](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

You can use the Account ID value as the Merchant ID. This is present in the address bar of the [Komoju Merchant Backoffice tool](https://komoju.com/merchant) 

![](images/komoju-address-bar.png)


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

The ``integrationId`` and ``configurationId`` values identify the merchant account group can be found in the top left of your **Configuration Details** page in the OPF workbench.

* ``integrationId`` maps to ``accountGroupId`` in Postman
* ``configurationId`` maps to ``accountId`` in Postman

**4. API Credentials**

The ``publiKey``, ``secretKey`` and ``authentication_outbound_basic_auth_username_export_64`` values can be found from the [Merchant Settings](https://komoju.com/merchant/settings) menu in Komoju dashboard.

![](images/komoju-keys.png)

Set the ``publicKey`` with the Publishable key (starting with pk_)
Set both the ``secretKey`` and ``authentication_outbound_basic_auth_username_export_64`` with the Secret Key (starting with sk_).

**5. Webhook Secret**

IN OPF Workbench: For your new Komoju merchant account Navigate to **Notification General** and copy the Notification URL.

![](images/opf-get-notification-url.png)

In the Komoku dashboard you need to navigate to Manage -> [Webhooks](https://komoju.com/merchant/webhooks) and Click New Webhook. 

i) Paste in your endpoint URL copied from OPF.

ii) Set a Cryptographically secure Secret Key

![](images/komoju-new-webhook.png)

iii) Enable **All Payment and Refund events**.

![](images/komoju-webhook-payment-events.png)
![](images/komoju-webhook-refund-events.png)

iv) Save the Webhook

Store the new webhook secret in the ``webhookSecret`` field in the environment file.

### Allowlist
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``komoju.com``

### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables: 

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId``

#### Komoju Specific
- ``publicKey``
- ``secretKey``
- ``authentication_outbound_basic_auth_username_export_64``
- ``webhookSecret``
  
For sandbox testing, all other values can be left as defaults.  

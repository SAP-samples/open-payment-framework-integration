## Introduction ##
The Postman Collection enables a [Stripe Payment Elements Form](https://docs.stripe.com/payments/payment-element?locale=en-GB) integration for payment processing through open payment framework(OPF). 

The integration supports:

* Authorization of  Payments using PCI SAQ-A Stripe Payments Element using the OPF "Hosted Fields" UX pattern
* Deferred Capture support
* Refunds
* Reversals
* Reauthorization of saved payment

APMs Tested
* Klarna

## Known Issues ##
* Asynchronous refunds (pending) need to be manually acknowledged in OPF

## Setup Instructions ##

### Summary ###
In summary: to import the [Postman Collection](mapping_configuration.json) this page will guide you through the following steps: 

a) Create your Stripe test account.

b) Create a Stripe payment integration in OPF workbench.

c) Set up your Stripe test account to work with OPF.

d) Prepare the [Postman Environment](environment_configuration.json) file so the collection can be imported with all your OPF Tenant and Stripe Test Account unique values. 

### Creating a Stripe Account ###
You can sign up for a free Stripe test account at https://dashboard.stripe.com/register.


### Creating a Stripe Payment Integration ###
Create a Stripe payment integration in the OPF workbench. For reference, see [Creating Payment Integration
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/20a64f954df1425391757759011e7e6b.html).

### Preparing the Postman environment_configuration file ###

**1. Token**

Get your access token by [creating an external app](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/d927d21974fe4b368e063f72733bf0fe.html) and [making authorized API calls](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/8ccca5bb539a49258e924b467ee4e1c2/40c792e66e2942209dc853a43533d78d.html).

Copy the value of the access_token field (it’s a JWT) and set as the ``token`` value in the environment file.

**IMPORTANT**: Ensure the value is prefixed with **Bearer**. e.g. ``Bearer {{token}}``.

**2. Root url**

The ``rootUrl`` is the **BASE URL** of your OPF tenant.

E.g. if your workbench/OPF cockpit url was this …

<https://opf-iss-d0.uis.commerce.stage.context.cloud.sap/opf-workbench>.

The base Url would be

https://opf-iss-d0.uis.commerce.stage.context.cloud.sap.


**3. Integration ID and Configuration ID**

The ``integrationId`` and ``configurationId`` values identify the payment integration and payment configuration, which can be found in the top left of your **Configuration Details** page in the OPF workbench.

* ``integrationId`` maps to ``accountGroupId`` in Postman
* ``configurationId`` maps to ``accountId`` in Postman

**4. Secret Key**
The Secret (or Private) Key can be obtained here in the Stripe dashboard. In test it starts with **sk_test**.

<https://dashboard.stripe.com/test/apikeys>

![](images/stripe-elements-get-secret-key.png)

Replace the ``secretKey`` variable value in the environment file with this value starting with **sk_test**.


**5. Public Key**

The public (or Publishable) key can be obtained here in the Stripe dashboard. In Test it starts with **pk_test**

<https://dashboard.stripe.com/test/apikeys>

![](images/stripe-elements-get-public-key.png)

Replace the ``publickey`` variable value in the environment file with this value starting with **pk_test**.

**6. Webhook Secret**

IN OPF Workbench: For your new Stripe payment integration, navigate to the **General Information** section of the **Integration details** tab to copy the Notification URL.

In Stripe Dashboard: Navigate to <https://dashboard.stripe.com/test/webhooks> and click **Add an Endpoint**.

i) Paste in your endpoint URL copied from OPF.

![](images/stripe-elements-paste-webook.png)

ii) For simplicity, select “All events”.

![](images/stripe-elements-select-events.png)

iii) Click **Add Endpoint**.

![](images/stripe-elements-add-endpoint.png)

iv) Click **Reveal** the get the webhook secret, it starts with **whsec**.

![](images/stripe-elements-reveal-whsecret.png)

v) In the environment file, set the ``webhookSecret`` value to the key starting with **whsec_**.

### Allowlist
Add the following domains to the domain allowlist in OPF workbench. For instructions, see [Adding Tenant-specific Domain to Allowlist
](https://help.sap.com/docs/OPEN_PAYMENT_FRAMEWORK/3580ff1b17144b8780c055bbb7c2bed3/a6836485b4494cfaad4033b4ee7a9c64.html).

``stripe.com``

### Summary

The environment file is now ready for importing into Postman together with the Mapping Configuration Collection file. Ensure you select the correct environment before running the collection.

In summary, you should have edited the following variables: 

#### Common
- ``token``
- ``rootUrl``
- ``accountGroupId``
- ``accountId``

#### Stripe Specific
- ``publicKey``
- ``secretKey``
- ``webhookSecret``
  

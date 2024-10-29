(function() {
  setupInit();
  setupLoad();
  setupAuthorize();
  setupAuthExample();

  function updateResults (element, message) {
    element.innerHTML = message;
    element.classList.add('updated');
    setTimeout(function() { 
      element.classList.remove("updated");
    }, 150); 
  }

  function setupInit () {
    var clientToken = document.getElementById("client-token"); 
    var initButton = document.getElementById("init");
    var initRequest = document.getElementById("init-request");
    var initResults = document.getElementById("init-results");
    
    if (!clientToken) console.error("Client token element not found");
    if (!initButton) console.error("Init button not found");
    if (!initRequest) console.error("Init request element not found");
    if (!initResults) console.error("Init results element not found");
    
    initButton.addEventListener("click", function(event) {      
      try {
        console.log("Client token value:", clientToken.value);
        
        if (!window.Klarna || !window.Klarna.Payments) {
          throw new Error("Klarna Payments SDK not loaded");
        }
        
        const request = {
          client_token: clientToken.value
        };
        
        // Clear previous results
        updateResults(initResults, "");
        
        updateResults(initRequest, 
          `Klarna.Payments.init({
  client_token: "${clientToken.value}"
});`);

        Klarna.Payments.init(request, function(response) {
          // If response has Buttons property but no error, it's a successful init
          if (response && response.Buttons && !response.error) {
            updateResults(initResults, "init OK");
          } else if (response && response.error) {
            // If there's an actual error property
            console.error("Init error:", response);
            updateResults(initResults, `Error: ${JSON.stringify(response, null, 2)}`);
          } else {
            // For any other response
            updateResults(initResults, "init OK");
          }
        });
      } catch (e) {
        console.error("Init error:", e);
        updateResults(initResults, `Error: ${e.message}`);
      }
    });
  };

  function setupLoad () {
    var loadPaymentMethodCategory = document.getElementById("load-payment-method-category"); 
    var loadSessionData = document.getElementById("optional-load-session-data");
    var loadButton = document.getElementById("load");
    var loadRequest = document.getElementById("load-request");
    var loadResults = document.getElementById("load-results");
    
    loadButton.addEventListener("click", function(event) {
      try {
        const sessionData = loadSessionData.value ? JSON.parse(loadSessionData.value) : undefined;
        
        // Clear previous results
        updateResults(loadResults, "");
        
        updateResults(loadRequest, 
          `Klarna.Payments.load({
  container: "#klarna-payments-container",
  payment_method_category: "${loadPaymentMethodCategory.value || ''}"
},
${sessionData ? JSON.stringify(sessionData, null, 2) : 'undefined'},
function(response) {
  // Handle the response
});`);
        
        Klarna.Payments.load(
          {
            container: '#klarna-payments-container',
            payment_method_category: loadPaymentMethodCategory.value || undefined
          },
          sessionData,
          function(data) {
            updateResults(loadResults, JSON.stringify(data, null, "  "));
          }
        );
      } catch (e) {
        updateResults(loadResults, e);
      }
    });
  };

  function setupAuthorize () {
    var authorizePaymentMethodCategory = document.getElementById("authorize-payment-method-category"); 
    var authorizeSessionData = document.getElementById("optional-authorize-session-data");
    var authorizeButton = document.getElementById("authorize");
    var authorizeRequest = document.getElementById("authorize-request");
    var authorizeResults = document.getElementById("authorize-results");
    
    authorizeButton.addEventListener("click", function(event) {      
      try {
        const sessionData = authorizeSessionData.value ? JSON.parse(authorizeSessionData.value) : undefined;
        
        // Clear previous results
        updateResults(authorizeResults, "");
        
        const methodCall = `Klarna.Payments.authorize({
    payment_method_category: "${authorizePaymentMethodCategory.value || ''}"
}, 
${JSON.stringify(sessionData, null, 2)}, 
function(res) {
    // Handle callback
});`;
        
        updateResults(authorizeRequest, methodCall);
        
        Klarna.Payments.authorize(
          {
            payment_method_category: authorizePaymentMethodCategory.value || undefined
          },
          sessionData,
          function(data) {
            updateResults(authorizeResults, JSON.stringify(data, null, "  "));
          }
        );
      } catch (e) {
        updateResults(authorizeResults, e);
      }
    });
  };

  function setupAuthExample() {
    const usExample = {
      "billing_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "t2@yahoo.com",
        "street_address": "6798-6700 Edmonton Ave",
        "postal_code": "92122",
        "city": "San Diego",
        "region": "CA",
        "phone": "2155555555",
        "country": "US"
      },
      "shipping_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "t2@yahoo.com",
        "street_address": "6798-6700 Edmonton Ave",
        "postal_code": "92122",
        "city": "San Diego",
        "region": "CA",
        "phone": "2155555555",
        "country": "US"
      },
      "purchase_country": "US",
      "purchase_currency": "USD",
      "locale": "en-US",
      "merchant_reference1": "Regular Order ID",
      "merchant_reference2": "Big Ticket Order ID",
      "order_amount": 8500,
      "order_tax_amount": 0,
      "order_lines": [
        {
          "type": "physical",
          "reference": "123456",
          "name": "Item Description",
          "image_url": "https://host/image.jpg",
          "product_url": "https://host/page",
          "quantity": 1,
          "unit_price": 9500,
          "tax_rate": 0,
          "total_amount": 9500,
          "total_discount_amount": 0,
          "total_tax_amount": 0
        },
        {
          "type": "discount",
          "name": "Discount Coupon",
          "quantity": 1,
          "unit_price": -1000,
          "tax_rate": 0,
          "total_amount": -1000,
          "total_discount_amount": 0,
          "total_tax_amount": 0
        }
      ],
      "attachment": {
        "content_type": "application/vnd.klarna.internal.emd-v2+json",
        "body": "{\"in_store_payment\":[{\"store_info\":{\"merchant_store_id\":\"Argos Tottenham Court Road\",\"store_terminal_id\":\"POS1232\",\"store_address\":{\"street_address\":\"216-217 Tottenham Ct Rd\",\"postal_code\":\"W1T 7PT\",\"city\":\"London\",\"country\":\"GB\"}}}]}"
      }
    };

    const gbExample = {
      "billing_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.co.uk",
        "street_address": "216-217 Tottenham Ct Rd",
        "postal_code": "W1T 7PT",
        "city": "London",
        "phone": "+442012345678",
        "country": "GB"
      },
      "shipping_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.co.uk",
        "street_address": "216-217 Tottenham Ct Rd",
        "postal_code": "W1T 7PT",
        "city": "London",
        "phone": "+442012345678",
        "country": "GB"
      },
      "purchase_country": "GB",
      "purchase_currency": "GBP",
      "locale": "en-GB",
      "merchant_reference1": "GB12345",
      "merchant_reference2": "GBREF89012",
      "order_amount": 8500,
      "order_tax_amount": 0,
      "order_lines": [
        {
          "type": "physical",
          "reference": "123456",
          "name": "Running Shoes",
          "quantity": 1,
          "unit_price": 9500,
          "tax_rate": 0,
          "total_amount": 9500,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        },
        {
          "type": "discount",
          "name": "Discount Coupon",
          "quantity": 1,
          "unit_price": -1000,
          "tax_rate": 0,
          "total_amount": -1000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        }
      ],
      "attachment": {
        "content_type": "application/vnd.klarna.internal.emd-v2+json",
        "body": "{\"in_store_payment\":[{\"store_info\":{\"merchant_store_id\":\"Argos Tottenham Court Road\",\"store_terminal_id\":\"POS1232\",\"store_address\":{\"street_address\":\"216-217 Tottenham Ct Rd\",\"postal_code\":\"W1T 7PT\",\"city\":\"London\",\"country\":\"GB\"}}}]}"
      }
    };

    const seExample = {
      "billing_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.se",
        "street_address": "Klarabergsgatan 50",
        "postal_code": "111 21",
        "city": "Stockholm",
        "phone": "+46701234567",
        "country": "SE"
      },
      "shipping_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.se",
        "street_address": "Klarabergsgatan 50",
        "postal_code": "111 21",
        "city": "Stockholm",
        "phone": "+46701234567",
        "country": "SE"
      },
      "purchase_country": "SE",
      "purchase_currency": "SEK",
      "locale": "sv-SE",
      "merchant_reference1": "SE12345",
      "merchant_reference2": "SEREF89012",
      "order_amount": 85000,
      "order_tax_amount": 0,
      "order_lines": [
        {
          "type": "physical",
          "reference": "123456",
          "name": "Löparskor",
          "quantity": 1,
          "unit_price": 95000,
          "tax_rate": 0,
          "total_amount": 95000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        },
        {
          "type": "discount",
          "name": "Rabattkupong",
          "quantity": 1,
          "unit_price": -10000,
          "tax_rate": 0,
          "total_amount": -10000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        }
      ],
      "attachment": {
        "content_type": "application/vnd.klarna.internal.emd-v2+json",
        "body": "{\"in_store_payment\":[{\"store_info\":{\"merchant_store_id\":\"Åhléns City Stockholm\",\"store_terminal_id\":\"POS8901\",\"store_address\":{\"street_address\":\"Klarabergsgatan 50\",\"postal_code\":\"111 21\",\"city\":\"Stockholm\",\"country\":\"SE\"}}}]}"
      }
    };

    const deExample = {
      "billing_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.de",
        "street_address": "Klarabergsgatan 50",
        "postal_code": "111 21",
        "city": "Stockholm",
        "phone": "+46701234567",
        "country": "DE"
      },
      "shipping_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.de",
        "street_address": "Klarabergsgatan 50",
        "postal_code": "111 21",
        "city": "Stockholm",
        "phone": "+46701234567",
        "country": "DE"
      },
      "purchase_country": "DE",
      "purchase_currency": "EUR",
      "locale": "de-DE",
      "merchant_reference1": "DE12345",
      "merchant_reference2": "DEREF89012",
      "order_amount": 85000,
      "order_tax_amount": 0,
      "order_lines": [
        {
          "type": "physical",
          "reference": "123456",
          "name": "Löparskor",
          "quantity": 1,
          "unit_price": 95000,
          "tax_rate": 0,
          "total_amount": 95000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        },
        {
          "type": "discount",
          "name": "Rabattkupong",
          "quantity": 1,
          "unit_price": -10000,
          "tax_rate": 0,
          "total_amount": -10000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        }
      ],
      "attachment": {
        "content_type": "application/vnd.klarna.internal.emd-v2+json",
        "body": "{\"in_store_payment\":[{\"store_info\":{\"merchant_store_id\":\"Åhléns City Stockholm\",\"store_terminal_id\":\"POS8901\",\"store_address\":{\"street_address\":\"Klarabergsgatan 50\",\"postal_code\":\"111 21\",\"city\":\"Stockholm\",\"country\":\"DE\"}}}]}"
      }
    };

    const itExample = {
      "billing_address": {
        "given_name": "Giovanni",
        "family_name": "Rossi",
        "email": "giovanni.rossi@email.it",
        "street_address": "Via del Corso 12",
        "postal_code": "00187",
        "city": "Roma",
        "phone": "+390612345678",
        "country": "IT"
      },
      "shipping_address": {
        "given_name": "Giovanni",
        "family_name": "Rossi",
        "email": "giovanni.rossi@email.it",
        "street_address": "Via del Corso 12",
        "postal_code": "00187",
        "city": "Roma",
        "phone": "+390612345678",
        "country": "IT"
      },
      "purchase_country": "IT",
      "purchase_currency": "EUR",
      "locale": "it-IT",
      "merchant_reference1": "IT12345",
      "merchant_reference2": "ITREF89012",
      "order_amount": 8500,
      "order_tax_amount": 0,
      "order_lines": [
        {
          "type": "physical",
          "reference": "123456",
          "name": "Scarpe da Corsa Nike",
          "quantity": 1,
          "unit_price": 9500,
          "tax_rate": 0,
          "total_amount": 9500,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        },
        {
          "type": "discount",
          "name": "Buono Sconto Estate",
          "quantity": 1,
          "unit_price": -1000,
          "tax_rate": 0,
          "total_amount": -1000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        }
      ],
      "attachment": {
        "content_type": "application/vnd.klarna.internal.emd-v2+json",
        "body": "{\"in_store_payment\":[{\"store_info\":{\"merchant_store_id\":\"Rinascente Roma\",\"store_terminal_id\":\"POS1234\",\"store_address\":{\"street_address\":\"Via del Corso 12\",\"postal_code\":\"00187\",\"city\":\"Roma\",\"country\":\"IT\"}}}]}"
      }
    };

    const esExample = {
      "billing_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.es",
        "street_address": "Klarabergsgatan 50",
        "postal_code": "111 21",
        "city": "Stockholm",
        "phone": "+46701234567",
        "country": "ES"
      },
      "shipping_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.es",
        "street_address": "Klarabergsgatan 50",
        "postal_code": "111 21",
        "city": "Stockholm",
        "phone": "+46701234567",
        "country": "ES"
      },
      "purchase_country": "ES",
      "purchase_currency": "EUR",
      "locale": "es-ES",
      "merchant_reference1": "ES12345",
      "merchant_reference2": "ESREF89012",
      "order_amount": 85000,
      "order_tax_amount": 0,
      "order_lines": [
        {
          "type": "physical",
          "reference": "123456",
          "name": "Löparskor",
          "quantity": 1,
          "unit_price": 95000,
          "tax_rate": 0,
          "total_amount": 95000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        },
        {
          "type": "discount",
          "name": "Rabattkupong",
          "quantity": 1,
          "unit_price": -10000,
          "tax_rate": 0,
          "total_amount": -10000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        }
      ],
      "attachment": {
        "content_type": "application/vnd.klarna.internal.emd-v2+json",
        "body": "{\"in_store_payment\":[{\"store_info\":{\"merchant_store_id\":\"Åhléns City Stockholm\",\"store_terminal_id\":\"POS8901\",\"store_address\":{\"street_address\":\"Klarabergsgatan 50\",\"postal_code\":\"111 21\",\"city\":\"Stockholm\",\"country\":\"ES\"}}}]}"
      }
    };

    const frExample = {
      "billing_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.fr",
        "street_address": "Klarabergsgatan 50",
        "postal_code": "111 21",
        "city": "Stockholm",
        "phone": "+46701234567",
        "country": "FR"
      },
      "shipping_address": {
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@email.fr",
        "street_address": "Klarabergsgatan 50",
        "postal_code": "111 21",
        "city": "Stockholm",
        "phone": "+46701234567",
        "country": "FR"
      },
      "purchase_country": "FR",
      "purchase_currency": "EUR",
      "locale": "fr-FR",
      "merchant_reference1": "FR12345",
      "merchant_reference2": "FRREF89012",
      "order_amount": 85000,
      "order_tax_amount": 0,
      "order_lines": [
        {
          "type": "physical",
          "reference": "123456",
          "name": "Löparskor",
          "quantity": 1,
          "unit_price": 95000,
          "tax_rate": 0,
          "total_amount": 95000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        },
        {
          "type": "discount",
          "name": "Rabattkupong",
          "quantity": 1,
          "unit_price": -10000,
          "tax_rate": 0,
          "total_amount": -10000,
          "total_tax_amount": 0,
          "total_discount_amount": 0
        }
      ],
      "attachment": {
        "content_type": "application/vnd.klarna.internal.emd-v2+json",
        "body": "{\"in_store_payment\":[{\"store_info\":{\"merchant_store_id\":\"Åhléns City Stockholm\",\"store_terminal_id\":\"POS8901\",\"store_address\":{\"street_address\":\"Klarabergsgatan 50\",\"postal_code\":\"111 21\",\"city\":\"Stockholm\",\"country\":\"FR\"}}}]}"
      }
    };

    const examples = {
      IT: itExample,
      US: usExample,
      GB: gbExample,
      SE: seExample,
      DE: deExample,
      ES: esExample,
      FR: frExample
    };

    const authDataExampleElement = document.getElementById("auth-data-example");
    const buttons = document.querySelectorAll('.example-button');

    if (!authDataExampleElement) {
      console.error("Auth data example element not found");
      return;
    }

    if (!buttons.length) {
      console.error("No example buttons found");
      return;
    }

    // Show initial example (IT)
    authDataExampleElement.innerHTML = JSON.stringify(examples.IT, null, "  ");

    // Add click handlers for buttons
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const country = button.dataset.country;
        if (examples[country]) {
          // Update active button
          buttons.forEach(b => b.classList.remove('active'));
          button.classList.add('active');
          // Show selected example
          authDataExampleElement.innerHTML = JSON.stringify(examples[country], null, "  ");
          updateLineNumbers(); // Add this line to update line numbers when changing examples
        }
      });
    });

    // Initial line numbers
    updateLineNumbers();
  }

  // Add this new function for line numbers
  function updateLineNumbers() {
    const example = document.getElementById('auth-data-example');
    const lineNumbers = document.querySelector('.line-numbers');
    if (example && lineNumbers) {
      const lines = example.textContent.split('\n');
      const maxLength = lines.length.toString().length;
      lineNumbers.innerHTML = lines
        .map((_, i) => (i + 1).toString().padStart(maxLength, ' '))
        .join('\n');
    }
  }

  // Add this for the copy button functionality
  document.getElementById('copyButton').addEventListener('click', function() {
    const exampleText = document.getElementById('auth-data-example').textContent;
    navigator.clipboard.writeText(exampleText)
      .then(() => {
        this.textContent = 'Copied!';
        setTimeout(() => {
          this.textContent = 'Copy';
        }, 1500);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  });

})();

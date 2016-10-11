Beermoney Balances
-----------

This is a chrome extension to automatically read balances from beermoney sites in order to save having to visit multiple sites to check on your balances.

To add a missing site
=====

1. Create a file "js/x.js" where x is the name of beermoney site. Keep the filename alphanumeric. This file should read the balance from the site and call one of the methods in main.js to save the balance.
2. Create a new content script entry in manifest.json. The entry should only run on when visiting the beermoney site and should import jQuery and main.js.
3. Create an entry in data/meta.json. The key should be the same as "x" from step 1. All fields are currently required.

Meta.json field explanation
====

* <b>conversion:</b> The conversion rate from the sites points into USD.  
* <b>url:</b>  A URL where the balance can be seen. This will be the URL the extension opens when the refresh button is pressed
* <b>name:</b> A prettier version of the site name which allows for non alphanumeric characters. Not currently used
* <b>fractions:</b> Whether the sites points allow fractions. This is for display formatting only

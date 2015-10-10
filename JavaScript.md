# Introduction #

The file "`js/salopp-xxx.js"` (where _xxx_ stands for the version number) contains the JavaScript implementation of the _Salopp_ protocol.

This implementation depends on the [jQuery](http://jquery.com/) library. Please make sure to load it before calling any _Salopp_ function.

# The _Salopp_ namespace #

## Salopp.getAPI() ##

Creates the API object which is required for all other functions.

#### Parameters: ####
  * **`url`** – address of the [announcement file](AnnouncementFile.md)
  * **`name`** – name of the API to load. If the announcement file contains multiple APIs with this name, the one with the highest version number will be loaded.
  * **`options`** – object containing additional settings and callbacks

#### Typical options: ####
  * **`version`** (_int_) – only load the API if its version is at least this value (default: `0.0`)
  * **`success`** (_function_) – specifies a callback function that will be called when the API was successfully loaded. The actual API object is then passed as a parameter (default: `null`)
  * **`error`** (_function_) – specifies a callback function that will be called when the API could not be loaded (default: `null`)

#### Example: ####
```
var gChatAPI = null;
Salopp.getAPI("http://salopp.googlecode.com/git/xml/chat_example.xml", "chatserver",
  { 'version' : 1.0,
    'success' : function(api) {
      gChatAPI = api;
    },
    'error' : function(errno, e) {
      if (typeof(e) === 'undefined') {
        alert("error: " + errno);
      } else {
        alert("An exception occurred in the script. Error name: " + e.name + ". Error message: " + e.message);
      }
    }
  }
);
```
In this example, the reference to the API is stored in the global variable `gChatAPI` to make it available outside of the scope of this snippet.

#### Notes: ####
  * The `getAPI()` function loads and parses the announcement file asynchronously, i.e. the program flow continues before the result is retrieved. For this reason you should always specify at lease the `success` callback to retrieve the API object.
  * The [announcement file](AnnouncementFile.md) may contain multiple API definitions, including multiple definitions with the same name, as long as each has a different version number.

# The _Salopp.API_ object #

The _API_ object contains all functions and properties that are required to call methods in a specific API.

#### Properties (read only): ####

  * **`name`** – the name of the API definition, as defined in the announcement file (string).
  * **`version`** – the version of the API definition, as defined in the announcement file (float).
  * **`description`** – the API description, as defined in the announcement file (string).
  * **`functions`** – array of function definitions that are part of this API (array of functions).

#### Functions: ####

  * **`call(name, params)`** – call an API function by name with the specified parameters.



# Introduction #

Add your content here.

# Simple Data Types #

The following simple data types are allowed for use by Salopp. These are used e.g. for function parameter definitions, which can not contain any complex data.

  * **`int`** – Natural numbers
  * **`float`** – Floating point numbers
  * **`str`** – String data
  * **`bool`** – Boolean data (`"true"`, `"yes"` and `"1"` are all considered _true_ values, any other data evaluates to _false_)

Please note that there is no length/precision specified for the first three data types.

# Complex Data Types #

Since web services can not return simple data types, all return values must be enclosed in a structured format (`xml` or `json`, depending on the `format` attribute).

The most generic `Struct` data type can hold any well-formed XML or JSON data structure.

  * **`Struct`** – unspecified data structure.

In situations where no return value is necessary, it is possible to declare a `Void` data type:

  * **`Void`** – No value.

Please note that `Void` is the default data type that is assumed if no `<returns … >` tag is specified; i.e. omitting this tag declares a function to have a `Void` return value.

For situations where a simple data type is wanted, the following automatically un-boxing data types can be used:

## Automaticly Unboxed Data Types ##

The following pre-defined data types (all derived from **Struct**) are transparently _unboxed_ when they are received from a function call:

  * **`Integer`** – unboxed to `int`
  * **`Float`** – unboxed to `float`
  * **`String`** – unboxed to `str`
  * **`Boolean`** – unboxed to `bool`
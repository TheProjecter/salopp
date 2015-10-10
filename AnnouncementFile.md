# Introduction #

The Announcement file is the heart of the Salopp system. It is an XML file which definies the APIs and function calls that are available on the server.

The following example is a valid Salopp announcement file:
```
<?xml version="1.0" encoding="UTF-8"?>
<salopp version="0.2">
  <apidef name="my-chat" version="1.0">
  
    <function name="login" href="login.jsp" method="post">
      <param name="username" />
      <param name="pwHash" />
      <returns type="String" />
    </function>

    <function name="check" href="check.jsp">
      <param name="token" />
      <returns type="Struct" format="json" />
    </function>

    <function name="logout" href="logout.jsp">
      <param name="token" />
    </function>
  </apidef>
</salopp>
```
Please note that in this example, all optional tags and attributes were omitted. Please see the following explanation for details:

# `<salopp>` #

The XML root element for all Salopp announcement files. It should always contain a `version` attribute which defines the version of this specification it follows (only `"0.2"` is currently allowed).

The root element may only contain (one or many) `<apidef>` elements:

```
<!ELEMENT salopp (apidef+)>
<!ATTLIST salopp version CDATA #FIXED "0.2">
```

# `<apidef>` #

This element defines a set of functions (the actual API). Multiple APIs can be specified in one file, each specified by different names and/or version attributes.

If more than one `<apidef>` with the requested name exist, the one with the highest version number will normally be returned – unless the client specifies a specific version number.

```
<!ELEMENT apidef (function*)>
<!ATTLIST apidef
                 name CDATA #REQUIRED
                 version CDATA #IMPLIED
                 desc CDATA #IMPLIED
                 href CDATA #IMPLIED
>
```

The optional `desc` (description) attribute allows to add a short, human readable, description to the API which may be used by an interactive API explorer, automated documentation generation or similar tools.

The hrefs of all functions (see below) are always considered relative to the url by which the xml file was loaded. The optional `href` attribute allows to override the base href. It works similar to the HTML "<base href=..." specification.

The `<apidef>` element may contain one or many `<function>` definitions:

# `<function>` #

For each (remote) function call that is associated with the API, there must be one function definition.

```
<!ELEMENT function (param*, returns?)>
<!ATTLIST function
                   name CDATA #REQUIRED
                   href CDATA #REQUIRED
                   method ( get | GET | post | POST ) "get"
                   desc CDATA #IMPLIED
>
```

The `name` attribute specifies the name by which the function can be called (call-by-name).

The `href` attribute specifies the URI of the remote script that should be called for this method.

The `method` attribute specifies how the parameters (see below) are passed to the server. Default is "get". The lower-case variants are generally recommended.

The (optional) `desc` field may contain a short descriptive text explaining the function.

The `<function>` element may contain multiple `<param>` elements and a maximum of _one_ `<returns>` element.

# `<param>` #

This element defines a parameter for a function call.

```
<!ELEMENT param EMPTY>
<!ATTLIST param
                name CDATA #REQUIRED
                type ( int | str | float | bool ) "str"
                required ( required | optional ) "required"
                desc CDATA #IMPLIED
>
```

The `name` attribute specifies both, by which name the parameter is addressed in code and the name by which the data is passed to the server.

The `type` attribute specifies the type of data. This can be any **simple data type** (see [DataTypes](DataTypes.md)). Default (in case the attribute is omitted) is `str`.

The `required` attributes specifies whether or not the parameter is required. Default is `required`. If you specify `optional`, no error will be thrown if it has not been specified (which means in turn that if you "forget" a required attribute, there _will_ be an error!)

The (optional) `desc` field may contain a short descriptive text explaining the parameter.

The `<param>` element is always empty, i.e. it may not contain any other elements.

# `<returns>` #

This element defines the return value(s) from a function call.

```
<!ELEMENT returns EMPTY>
<!ATTLIST returns
                  type ( Struct | Void | String | Integer | Float | Boolean ) "Struct"
                  format ( xml | json | binary ) "xml"
                  mime CDATA #IMPLIED
>
```

The `type` attribute specifies the type of the return data. This can be any **complex data type** (see [DataTypes](DataTypes.md)). Default (in case the attribute is omitted) is `Struct`.

The `format` attribute specifies the format in which the data is provided. Valid values are `xml`, `json` and `binary`. Default is `xml`.

The `mime` attribute allows to specify a mime type that is expected to be returned. This defaults to `"application/xml"` if `format` is set to `xml` and `"application/json"` if it is `json`, therefore specifying it is probably useful only for `binary` formats.

Note: If the `<returns>` element is omitted, the function is assumed to have a `Void` (i.e. none) return value. If a `<returns>` element is added, but no `type` specified, then `Struct` (=the most general data type) is the default type.
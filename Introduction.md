# Introduction #

**Salopp** is a very simple and lightweight method to announce (and call) web APIs. It is based on XML and/or JSON and was designed to be used for a web-chat system but it is flexible enough to be used for almost any kind of web-API.

<blockquote><i>Salopp</i> stands for "<u>S</u>imple <u>a</u>nd <u>l</u>ightweight rem<u>o</u>te <u>p</u>rocedure call <u>p</u>rotocoll.<br>
It is also a German coloquialism, meaning as much as <i>casual</i> or <i>sloppy</i>.</blockquote>

## What is it good for? ##

When interfacing with multiple web servers that provide similar services in different implementations, Salopp can help by introducing an aditional abstraction layer that hides some of the implementation details.

It is also useful to provide a unique and persistent entry point to web services that may be accessed via different URIs (e.g. IP addresses) or that may be migrated at some point.

# Example #

How Salopp works is best explained with a simple example. The following is an announcement file for a simple web API (a chat server):

```
<?xml version="1.0" encoding="UTF-8"?>
<salopp version="0.2">
	<apidef name="my-chat" version="1.0">

		<function name="login" href="login.jsp" method="post">
			<param name="username" type="str" />
			<param name="pwHash" type="str" />
			<returns type="String" />
		</function>

		<function name="check" href="check.jsp">
			<param name="token" type="str"/>
			<returns type="Struct" format="json" />
		</function>

		<function name="logout" href="logout.jsp">
			<param name="token" type="str"/>
		</function>

	</apidef>
</salopp>
```

Please see the detailed explanations of the [announcement file format](AnnouncementFile.md) for details.

Calling the web API (for example in JavaScript) is then as easy as this:Salopp.GetAPI("http://yourserver.org/api/announcement.xml", "my-chat", {
   success: function(api) {
      var token = api.call('login', {"username": "yourusername", "pwHash": "YOURPWHASH"});
   }
});```
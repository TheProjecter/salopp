/* Salopp - Simple and lightweight remOte procedure call protocoll */
/* licensed under the GNU GPL v3 */
/* Version: 0.1 */
/* requires the jQuery library */

Salopp = {

	/* library version */
	version: 0.1,

	/* get new root API object */
	getAPI:	function(url, name, options) {

		var settings = $.extend( {
		  'version'		: 0.0,
		  'success'		: null,
		  'error'		: null
		}, options);

		/* prepare the callbacks */
		var successCallback = $.Callbacks("once");
		if (typeof(settings.success) == 'function') {
			successCallback.add(settings.success);
		};
		var errorCallback = $.Callbacks("once");
		if (typeof(settings.error) == 'function') {
			errorCallback.add(settings.error);
		};

		/* check the parameters */
		if ((typeof(url) !== 'string') || (url == '')) {
			errorCallback.fire(3);
		};

		/* load the api definition */
		$.get(url, function(xml) {
			try {
				/* select all apis that match the criteria */
				var sl = $(xml).find('salopp').first();
				var apis = new Array()
				$(sl).find('apidef').each(function() {
					if ((typeof(settings.name) == "undefined") || ($(this).attr('name') == settings.name)) {
						if ((typeof(settings.version) == "undefined") || (parseFloat($(this).attr('version')) >= settings.version)) {
							apis.push(this);
						};
					};
				});
				/* find the best api from the selection */
				var api = null;
				var apiver = -1;
				jQuery.each(apis, function() {
					var thisver = parseFloat($(this).attr('version'));
					if ((apiver == 0) || (thisver > apiver)) {
						api = this;
						apiver = thisver;
					};
				});
				/* parse the api, if found */
				if (api != null) {
					var sapi = new Salopp.API(api);
					if (sapi.valid) {
						successCallback.fire(sapi);
					} else {
						errorCallback.fire(2);
					};
				} else {
					errorCallback.fire(1);
				};
			} catch (e) {
				errorCallback.fire(0, e);
			}
		});
	} /* getAPI */ ,

	prettyPrint: function(api) {

		var str='';

		for(var p in api){
			var type = typeof api[p];
			if (type == 'string') {
				str+= "<li>" + p + '="<tt>' + api[p]+'</tt>"' + ' [' + type + '],</li>';
			} else if (type == 'number') {
				str+= "<li>" + p + '=<tt>' + api[p]+'</tt>' + ' [' + type + ']</li>';
			} else if (type == 'boolean') {
				str+= "<li>" + p + '=<i>' + (api[p] ? "true" : "false") + '</i>' + ' [' + type + ']</li>';
			} else if ((type == 'object') || (type == 'function')) {
				str+= "<li>" + p + ' {<ul>' + Salopp.prettyPrint(api[p]) + '</ul>}</li>';
			} else {
				str += "<li>" + p + " [" + type + "]</li>";
			}
		}
		return str;

	} /* prettyPrint */ ,
	
	parseBool: function(str) {
		return ((str === "true") || (str === "yes") || (parseInt(str) == 1));
	}
	
}; /* Salopp */

Salopp.API = function(apidef) {
	this.name = $(apidef).attr('name');
	this.version = parseFloat($(apidef).attr('version'));
	this.description = $(apidef).attr('desc');
	var functions = new Array();

	$(apidef).find('function').each(function() {
		var func = new Salopp.API.Function(this);
		if (func.valid) {
			functions.push(func);
		}
	});
	this.functions = functions;

	/* check for validity: */
	this.valid = ((this.name != '')&& (this.version > 0) && (this.functions.length > 0));			

	/* retrieve a function by name */
	this.getFunctions = function(name) {
		var funcs = new Array();
		for(var num in this.functions){
			var func = this.functions[num];
			if (func.name == name) {
				funcs.push(func);
			}
		};
		return funcs;
	}

	/* call any member function */
	this.call = function(name, params) {

		// find suitable functions by name:
		var funcs = new Array();
		for(var num in functions){
			var func = functions[num];
			if (func.name == name) {
				funcs.push(func);
			}
		};
		alert(funcs.length);
	};

}; /* Salopp.API */

Salopp.API.Function = function(fun) {

	this.href = $(fun).attr('href');
	this.name = $(fun).attr('name');
	this.description = $(fun).attr('desc');
	var method = $(fun).attr('method');
	if (method in {"post":"", "POST":""}) {
		method = 'post';
	} else {
		method = 'get';
	}
	this.method = method;

	// find the parameters:
	var params = new Array()
	$(fun).find('param').each(function() {
		var name = $(this).attr('name');
		var type = $(this).attr('type');
		var required = $(this).attr('required');
		if (required != "optional") { required = "required"; }
		if (!(type in {"int":"", "str":"", "float":"", "bool":""})) {
			type = "str";
		}
		params[name] = {"name": name, "type": type, "required": required};
	});
	this.parameters = params;

	// find the return value:
	var rval = new Array();
	var ret = $(fun).find('returns').first() ;
	var rtype = $(ret).attr('type');
	if (rtype in {"Integer":"", "String":"", "Float":"", "Boolean":"", "Struct":"", "Void":""}) {
		rval['type'] = rtype;
	} else {
		rval['type'] = "Void";
	}
	var rformat = $(ret).attr('format');
	if (rformat in {"xml":"", "json":""}) {
		rval['format'] = rformat;
	} else {
		rval['format'] = "xml";
	}
	this.returns = rval;

	/* check for validity */
	this.valid = true;

	// call this function:
	this.call = function(params, settings) {

		// get a refernce to the parent object:
		var func = this;
		var returns = func.returns;

		// keep a reference to the success callback:
		var successCallback = null;
		if (typeof(settings.success) != "undefined") {
			successCallback = settings.success;
		};

		// the following settings are required:
		var ajs = {
			url      : this.href,
			cache    : false,
			dataType : this.returns.format,
			type     : this.method,
			data     : params,
		};
		jQuery.extend(ajs, settings);

		// replace success callback:
		ajs.success = function(result) {

			var v = null;

			if (ajs.dataType == "json") {
			
				alert(result.toSource);

			} else {

				var t = $(result).text();
				switch (this.returns) {
					case "String":
						v = trim(t);
						break;
					case "Integer":
						v = parseInt(t);
						break;
					case "Float":
						v = parseFloat(t);
						break;
					case "Boolean":
						v = Salopp.parseBoolean(trim(t));
						break;
					default:
						v = t;
				}
			}
			if (successCallback !== null) {
				successCallback(v);
			}
		}

		jQuery.ajax(ajs);
	}

}; /* Salopp.API.Function */
		

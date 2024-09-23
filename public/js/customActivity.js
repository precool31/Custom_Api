var connection = new Postmonger.Session();
var payload = {};

$(window).ready(onRender);

connection.on('initActivity', initialize);
connection.on('clickedNext', save);

function onRender() {
  connection.trigger('ready');
   connection.trigger('requestTokens');
   connection.trigger('requestEndpoints');
}

function initialize(data) {

  if (data) {
    payload = data;
  }

  connection.trigger('requestSchema');
  connection.on('requestedSchema', function (data) {

    // add entry source attributes as inArgs
    const schema = data['schema'];

    for (var i = 0, l = schema.length; i < l; i++) {
        var inArg = {};
        let attr = schema[i].key;
        let keyIndex = attr.lastIndexOf('.') + 1;
        inArg[attr.substring(keyIndex)] = '{{' + attr + '}}';
        payload['arguments'].execute.inArguments.push(inArg);
    }
  });

  let argArr = payload['arguments'].execute.inArguments;

}

function save() {

  /* the following code is optional, but provides an example of 
     how to append additional key/value pair(s) as inArguments, 
     for example, a form field value from the custom activity html */

  var fieldVal = document.getElementById('externalEndpointUrl').value;
  var keyObj = { externalEndpointUrl : fieldVal };
  payload['arguments'].execute.inArguments.push(keyObj);

  

  payload.metaData.isConfigured = true;
  connection.trigger('updateActivity', payload);

}

﻿// global websocket, used to communicate from/to Stream Deck software
// as well as some info about our plugin, as sent by Stream Deck software 
var websocket = null,
  uuid = null,
  inInfo = null,
  actionInfo = {},
  settingsModel = {
	  Counter: 0,
	  Increase: 1
  };

function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inUUID;
  actionInfo = JSON.parse(inActionInfo);
  inInfo = JSON.parse(inInfo);
  websocket = new WebSocket('ws://localhost:' + inPort);

  //initialize values
	if (actionInfo.payload.settings.settingsModel) {
		settingsModel.Counter = actionInfo.payload.settings.settingsModel.Counter;
		settingsModel.Increase = actionInfo.payload.settings.settingsModel.Increase;
  }
	
	document.getElementById('txtCounterValue').value = settingsModel.Counter;
	document.getElementById('txtIncreaseValue').value = settingsModel.Increase;

  websocket.onopen = function () {
	var json = { event: inRegisterEvent, uuid: inUUID };
	// register property inspector to Stream Deck
	websocket.send(JSON.stringify(json));

  };

  websocket.onmessage = function (evt) {
	// Received message from Stream Deck
	var jsonObj = JSON.parse(evt.data);
	var sdEvent = jsonObj['event'];
	switch (sdEvent) {
	  case "didReceiveSettings":
		if (jsonObj.payload.settings.settingsModel.Counter) {
		  settingsModel.Counter = jsonObj.payload.settings.settingsModel.Counter;
		  document.getElementById('txtCounterValue').value = settingsModel.Counter;
		}

			if (jsonObj.payload.settings.settingsModel.Increase) {
				settingsModel.Increase = jsonObj.payload.settings.settingsModel.Increase;
				document.getElementById('txtIncreaseValue').value = settingsModel.Increase;
		}
		break;
	  default:
		break;
	}
  };
}

const setSettings = (value, param) => {
  if (websocket) {
	settingsModel[param] = value;
	var json = {
	  "event": "setSettings",
	  "context": uuid,
	  "payload": {
		"settingsModel": settingsModel
	  }
	};
	websocket.send(JSON.stringify(json));
  }
};


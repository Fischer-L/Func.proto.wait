/*******************************************************************************************
 * Previewbox
 *
 * Copyright (C) 2013 Fischer Liu | MIT license | https://github.com/Fischer-L/previewbox
 *******************************************************************************************/
if (!Function.prototype.wait) {
	/*	Arg:
			> cond = the condition function, would be called per period of ms to check whether should run the eaiting function or not.
			         Its returned value will instruct the waiting action and shall follow below:
					 if "run", the condition is satisfied and the waiting function would be run;
					 if "anyway", disregarding the condition and just run the waiting function;
					 if "stop", stop waiting and checking the condition and the waiting function would not be run;
					 if sth else, keep waiting and checking the condition.
			> [config] = the config obj, the settings include : {
							> [args] = the args to pass in the waiting function
							> [that] = Used as the this obj when calling the waiting function. If ommited, would be the funciton itself
							> [latency] = the time between each checking; in ms; the min is 1.
							> [anywayTiming] = the time(ms) after which run the waiting function anyway.
							> [stopTiming] = the time(ms) after which stop waiting(the waiting function would not be run). If stopTiming equals to anywayTiming, would take anywayTiming first.
						 }			
		Return:
			@ Begin waiting: true
			@ NG: false
	*/
	Function.prototype.wait = function (cond, config) {
		if (typeof cond == "function") {
			var gap,
				self,
				action,
				minTiming = 1, // 1 ms
				minLatency = 1; // 1 ms
				
			
			if (!(config instanceof Object)) {
				config = {};				
			}
			
			self = arguments[2] || this;			
			
			// Set up the configs
			config.args = (config.args instanceof Array) ? config.args : [];
			config.that = (config.that instanceof Object) ? config.that : self;
			config.latency = (typeof config.latency == "number" && config.latency >= minLatency) ? Math.floor(config.latency) : minLatency;
			config.anywayTiming = (typeof config.anywayTiming == "number" && config.anywayTiming >= minTiming) ? Math.floor(config.anywayTiming) : undefined;
			config.stopTiming = (typeof config.stopTiming == "number" && config.stopTiming >= minTiming) ? Math.floor(config.stopTiming) : undefined;
			if (!config._fallback) {
				if (typeof config.anywayTiming != "number"
					&& typeof config.stopTiming != "number"
				) {
				
					config._fallback = "keep_waiting";
					
				} else if (
					typeof config.anywayTiming == "number"
					&& typeof config.stopTiming != "number"
				) {
				
					config._fallback = "anyway";
					config._timing = config.anywayTiming;
					
				} else if (
					typeof config.anywayTiming != "number"
					&& typeof config.stopTiming == "number"
				) {
				
					config._fallback = "stop";
					config._timing = config.stopTiming;
					
				} else {
				
					if (config.anywayTiming <= config.stopTiming) {
					
						config._fallback = "anyway";
						config._timing = config.anywayTiming;
						
					} else {
					
						config._fallback = "stop";
						config._timing = config.stopTiming;
						
					}
				}
			}
			if (!config._startMS) {
				config._startMS = (new Date()).getTime(); // The ms the waiting operation starts
			}
			
			// Check the timing condition
			if (config._fallback != "keep_waiting") {
				gap = Math.abs((new Date()).getTime() - config._startMS);
				if (gap > config._timing) { // Time to do the fallback action ?
					action = config._fallback;
				}
			}
			
			if (!action) {
				action = cond();
			}
			
			switch (action) {
				case "run": case "anyway":
					self.apply(config.that, config.args);
				break;
				case "stop":
					// Do nothing to stop...
				break;
				default:
					setTimeout(function () { self.wait(cond, config, self); }, config.latency);
				break;
			}
			
			return true;
		}
		return false;
	}	
}

## Wait to run function until some condition holds:

Fucniton.prototype.wait is a simple extension on the Function.prototype chain.

Its use case could be that you want to run the function, say_hello, on the web page loads to say hello to your user.

However, before runing the say_hello, you have to wait until some condition holds, say, loading some scripts or resources.

What's more. You don't want to block the rest of codes while waiting and/or you want to run the say_hello anyway after a period of time disregarding the condition for fallback.

A simple call to Fucniton.prototype.wait could help this situation.


## Example

```javascript
var username = undefined;
var say_hello = function () {
	var guest = username || "Friend";
	alert("Hello " + guest + "!");
}
// We want to say hello to user but don't want to make this hello block the other codes so ...
say_hello.wait(
	function () {
	// This condition function would be invoked every 10 ms to check the existence of the username
		if (typeof username == "string") {
			return "run";
		} else {
			return;
		}
	}, {
		latency : 10, // Let's check whether getting the username every 10 ms.
		anywayTiming : 2000, // Say hello anyway after 2 secs.
	}
);
// Start fetching the username and do other works.
```
Here is a demo => http://jsfiddle.net/Fischer/aHcnb/


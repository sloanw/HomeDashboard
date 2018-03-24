function $http(url) {
    var main = {
        request: function (method, url, args) {
            var promise = new Promise(function (resolve, reject) {
                var httpRequest = new XMLHttpRequest();
                args = args || {};
                var count = 0;
                for (var i in args) {
                    if (count) {
                        url += "&";
                    } else {
                        url += "?";
                    }

                    url += encodeURIComponent(i) + '=' + encodeURIComponent(args[i]);
                }
                httpRequest.open(method, url);
                httpRequest.send();

                httpRequest.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(this.response);
                    } else {
                        reject(this.statusText);
                    }
                };

                httpRequest.onerror = function (err) {
                    reject(this.statusText || "network error");
                };
            });
            return promise;
        }
    };

    return {
        'get': function (args) {
            return main.request('GET', url, args);
        },
        'post': function (args) {
            return main.request('POST', url, args);
        }
    }
}
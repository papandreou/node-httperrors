(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('createerror'));
    } else if (typeof define === 'function' && define.amd) {
        define(['createError'], factory);
    } else {
        root.httpErrors = factory(root.createError);
    }
}(this, function (createError) {
    // Copied from /lib/_http_server.js (node.js@2900f07):
    var httpErrorNameByStatusCode = {
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Time-out',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Request Entity Too Large',
        414: 'Request-URI Too Large',
        415: 'Unsupported Media Type',
        416: 'Requested Range Not Satisfiable',
        417: 'Expectation Failed',
        418: 'I\'m a teapot', // RFC 2324
        422: 'Unprocessable Entity', // RFC 4918
        423: 'Locked', // RFC 4918
        424: 'Failed Dependency', // RFC 4918
        425: 'Unordered Collection', // RFC 4918
        426: 'Upgrade Required', // RFC 2817
        428: 'Precondition Required', // RFC 6585
        429: 'Too Many Requests', // RFC 6585
        431: 'Request Header Fields Too Large', // RFC 6585
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Time-out',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates', // RFC 2295
        507: 'Insufficient Storage', // RFC 4918
        509: 'Bandwidth Limit Exceeded',
        510: 'Not Extended', // RFC 2774
        511: 'Network Authentication Required' // RFC 6585
    };

    var httpErrors = {};

    /// Map the error codes/names, as defined in Node's [http
    /// module](http://nodejs.org/docs/latest/api/http.html).
    Object.keys(httpErrorNameByStatusCode).forEach(function (statusCode) {
        statusCode = +statusCode; // turn into a number
        var httpErrorName = httpErrorNameByStatusCode[statusCode];

        // Only include 4xx and 5xx
        if (statusCode < 400) {
            return;
        }

        // Invent a type by camel casing the usual message and removing
        // non-alphabetical chars
        var name = httpErrorName.replace(/ ([a-z])/gi, function ($0, $1) {
            return $1.toUpperCase();
        }).replace(/[^a-z]/gi, '');

        // Add the error to the exported object and alias it as `statusCode`
        // allows for new httpErrors[res.statusCode] in a http proxying setting
        httpErrors[name] = httpErrors[statusCode] = createError({
            statusCode: statusCode,
            name: name
        });
    });

    return httpErrors;
}));

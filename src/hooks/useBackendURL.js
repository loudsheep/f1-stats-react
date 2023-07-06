import { useState, useEffect } from 'react';

const backendServerProtocol = "http://";
const backendServerAddress = "localhost";
const backendServerPort = "5000";
const backendRoutePrefix = "";

const parse = (str, ...vars) => {
    let i = 0;

    return str.replace(/%s/g, () => vars[i++]);
}

const constructURL = (urlFormat, ...params) => {
    let url = "";
    url += backendServerProtocol;
    url += backendServerAddress;
    if (backendServerPort != null) {
        url += ":" + backendServerPort;
    }
    url += backendRoutePrefix;

    url += parse(urlFormat, ...params);

    return url;
};

const useBackendURL = (routeName, ...params) => {
    const [url, setUrl] = useState("/");

    useEffect(() => {
        let tmp = "";

        switch (routeName) {
            case 'lap-leaders':
                tmp = constructURL("/lap-leaders");
                break;
            case 'schedule':
                tmp = constructURL("/schedule");
                break;
            case 'winners':
                tmp = constructURL("/winners");
                break;
            case 'sessions':
                tmp = constructURL("/sessions?year=%s", ...params);
                break;
            case 'heatmap':
                tmp = constructURL("/heatmap?year=%s&category=%s", ...params);
                break;
            case 'results':
                tmp = constructURL("/results?year=%s&event=%s&session=%s", ...params);
                break;
            case 'laps':
                tmp = constructURL("/laps?year=%s&event=%s&session=%s&driver=%s", ...params);
                break;
            case 'telemetry':
                tmp = constructURL("/telemetry?year=%s&event=%s&session=%s&driver=%s&lap=%s", ...params);
                break;
        }

        setUrl(tmp);

    }, [routeName, params]);

    return [ url ];
};

export default useBackendURL;
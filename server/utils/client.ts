const fetch = async <T>(target: string, params?: any): Promise<T> => {
    const [method, path] = target.split(" ");

    let url = `${location.origin}${path}`;
    if (method === "GET") {
        url += `?${new URLSearchParams(params)}`;
    }

    const headers = {};
    if (sessionStorage.auth) {
        const auth = JSON.parse(sessionStorage.auth);
        Reflect.set(headers, "token", auth.token);
    }

    const payload = method === "POST" ? JSON.stringify(params) : undefined;

    const response = await window.fetch(url, {
        method,
        headers,
        body: payload,
    });

    return response.json();
};

export { fetch };

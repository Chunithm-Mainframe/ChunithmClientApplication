interface Service {
    /**
    * Sets the request URL for the OAuth service (required).
    * @param url The URL given by the OAuth service provider for obtaining a request token.
    */
    setRequestTokenUrl(url: string): Service;

    /**
    * Sets the URL for the OAuth authorization service (required).
    * @param url The URL given by the OAuth service provider for authorizing a token.
    */
    setAuthorizationUrl(url: string): Service;

    /**
    * Sets the URL to get an OAuth access token from (required).
    * @param url The URL given by the OAuth service provider for obtaining an access token.
    */
    setAccessTokenUrl(url: string): Service;

    /**
    * Sets the parameter location in OAuth protocol requests (optional). The default parameter location is 'auth-header'.
    * @param location The parameter location for the OAuth request. Allowed values are 'post-body', 'uri-query' and 'auth-header'.
    */
    setParamLocation(location: 'post-body' | 'uri-query' | 'auth-header'): Service;

    /**
    * Sets the HTTP method used to complete the OAuth protocol (optional). The default method is 'get'.
    * @param method The method to be used with this service. Allowed values are 'get' and 'post'.
    */
    setMethod(method: 'get' | 'post'): Service;

    /**
    * Sets the OAuth realm parameter to be used with this service (optional).
    * @param realm The realm to be used with this service.
    */
    setRealm(realm: string): Service;

    /**
    * Sets the OAuth signature method to use. 'HMAC-SHA1' is the default.
    * @param signatureMethod The OAuth signature method. Allowed values are 'HMAC-SHA1', 'RSA-SHA1' and 'PLAINTEXT'.
    */
    setSignatureMethod(signatureMethod: 'HMAC-SHA1' | 'RSA-SHA1' | 'PLAINTEXT'): Service;

    /**
    * Sets the specific OAuth version to use. The default is '1.0a'.
    * @param oauthVersion The OAuth version. Allowed values are '1.0a' and '1.0'.
    */
    setOAuthVersion(oauthVersion: string): Service;

    /**
    * Sets the ID of the script that contains the authorization callback function (required).
    * The script ID can be found in the Script Editor UI nder "File > Project properties".
    * @param scriptId The ID of the script containing the callback function.
    * @deprecated The script ID is now be determined automatically.
    */
    setScriptId(scriptId: string): Service;

    /**
    * Sets the name of the authorization callback function (required).
    * This is the function that will be called when the user completes the authorization flow on the service provider's website.
    * The callback accepts a request parameter, which should be passed to this service's <code>handleCallback()</code> method to complete the process.
    * @param callbackFunctionName The name of the callback function.
    */
    setCallbackFunction(callbackFunctionName: string): Service;

    /**
    * Sets the consumer key, which is provided when you register with an OAuth service (required).
    * @param consumerKey The consumer key provided by the OAuth service provider.
    */
    setConsumerKey(consumerKey: string): Service;

    /**
    * Sets the consumer secret, which is provided when you register with an OAuth service (required).
    * @param consumerSecret The consumer secret provided by the OAuth service provider.
    */
    setConsumerSecret(consumerSecret: string): Service;

    /**
    * Sets the property store to use when persisting credentials (optional).
    * In most cases this should be user properties, but document or script properties may be appropriate if you want to share access across users.
    * If not set tokens will be stored in memory only.
    * @param propertyStore The property store to use when persisting credentials.
    */
    setPropertyStore(propertyStore: GoogleAppsScript.Properties.Properties): Service;

    /**
    * Sets the cache to use when persisting credentials (optional).
    * Using a cache will reduce the need to read from the property store and may increase performance.
    * In most cases this should be a private cache, but a public cache may be appropriate if you want to share access across users.
    * @param cache The cache to use when persisting credentials.
    */
    setCache(cache: GoogleAppsScript.Cache.Cache): Service;

    /**
    * Sets the access token and token secret to use (optional).
    * For use with APIs that support a 1-legged flow where no user interaction is required.
    * @param token The access token.
    * @param secret The token secret.
    */
    setAccessToken(token: string, secret: string): Service;

    /**
    * Starts the authorization process.
    * A new token will be generated and the authorization URL for that token will be returned.
    * Have the user visit this URL and approve the authorization request.
    * The user will then be redirected back to your application using the script ID and callback function name specified, so that the flow may continue.
    * @returns The authorization URL for a new token.
    */
    authorize(): string;

    /**
    * Completes the OAuth1 flow using the request data passed in to the callback function.
    * @param callbackRequest The request data recieved from the callback function.
    * @return True if authorization was granted, false if it was denied.
    */
    handleCallback(callbackRequest: { parameter: { oauth_token: string; oauth_verifier: string; } }): boolean;

    /**
    * Determines if the service has access (has been authorized).
    * @return true if the user has access to the service, false otherwise.
    */
    hasAccess(): boolean;

    /**
    * Fetches a URL using the OAuth1 credentials of the service. Use this method
    * the same way you would use `UrlFetchApp.fetch()`.
    * @param url The URL to fetch.
    * @param params The request parameters. See the corresponding method in `UrlFetchApp`.
    * @returns The response.
    */
    fetch(url: string, params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): GoogleAppsScript.URL_Fetch.HTTPResponse;

    /**
    * Resets the service, removing access and requiring the service to be re-authorized.
    */
    reset(): void;
}
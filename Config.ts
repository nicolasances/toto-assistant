export type ApiName = 'auth' | 'whispering';
export interface ApiEndpoint { name: ApiName, endpoint: string }
 
const ApiEndpoints = new Map<ApiName, string>();
ApiEndpoints.set("auth", String(process.env.NEXT_PUBLIC_AUTH_API_ENDPOINT))
ApiEndpoints.set("whispering", String(process.env.NEXT_PUBLIC_WHISPERING_API_ENDPOINT))

export function endpoint(api: ApiName) {
    return ApiEndpoints.get(api)
}

export const APP_VERSION = "1.0.0"

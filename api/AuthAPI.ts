import { TotoAPI, cid } from './TotoAPI';

/**
 * API to access the /auth/ Toto API
 */
export class AuthAPI {

  /**
   * Get a Toto token from a Google token
   */
  async getTotoToken(googleToken: string) {

    return new TotoAPI().fetch('auth', `/token`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'x-correlation-id': cid(),
        'x-client': "totoAssistant",
        'Authorization': `Bearer ${googleToken}`
      }
    }, false, true).then((response) => response.json());

  }

  /**
   * Verify a Toto token
   */
  async verifyToken(totoToken: string) {

    return new TotoAPI().fetch('auth', `/verify`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'x-correlation-id': cid(),
        'x-client': "totoAssistant",
        'Authorization': `Bearer ${totoToken}`
      }
    }, false, true).then((response) => response.json());

  }

}

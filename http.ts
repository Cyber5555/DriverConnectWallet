import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

export class Http {
  static async get<T>(
    url: string,
    headers?: AxiosRequestConfig['headers'],
  ): Promise<AxiosResponse<T>> {
    try {
      return await Http.request<T>(url, 'GET', headers);
    } catch (e) {
      throw e;
    }
  }

  static async post<T>(
    url: string,
    headers?: AxiosRequestConfig['headers'],
    data?: any, // Send data in the request body
  ): Promise<AxiosResponse<T>> {
    try {
      return await Http.request<T>(url, 'POST', headers, data);
    } catch (e) {
      throw e;
    }
  }

  static async delete<T>(
    url: string,
    headers?: AxiosRequestConfig['headers'],
  ): Promise<AxiosResponse<T>> {
    try {
      return await Http.request<T>(url, 'DELETE', headers);
    } catch (e) {
      throw e;
    }
  }

  static async patch<T>(
    url: string,
    headers?: AxiosRequestConfig['headers'],
    data?: any,
  ): Promise<AxiosResponse<T>> {
    try {
      return await Http.request<T>(url, 'PATCH', headers, data);
    } catch (e) {
      throw e;
    }
  }

  static async put<T>(
    url: string,
    headers?: AxiosRequestConfig['headers'],
    data?: any,
  ): Promise<AxiosResponse<T>> {
    try {
      return await Http.request<T>(url, 'PUT', headers, data);
    } catch (e) {
      throw e;
    }
  }

  private static async request<T>(
    url: string,
    method: AxiosRequestConfig['method'] = 'GET',
    headers?: AxiosRequestConfig['headers'],
    data?: any,
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method,
      headers,
      data,
    };

    const response = await axios(url, config);
    return response;
  }
}

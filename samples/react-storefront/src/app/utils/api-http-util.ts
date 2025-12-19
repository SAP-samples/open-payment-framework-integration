import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

export enum CallType {
  OPF = 'opf',
  COMMERCE_CLOUD = 'ccv2',
}

export class ApiHttpUtil {
  private axiosInstance: AxiosInstance;

  constructor(type: CallType, headers?: any) {
    this.axiosInstance = axios.create({
      baseURL:
        type == CallType.OPF
          ? process.env.OPF_BASE_URL_STOREFRONT || ''
          : process.env.CCV2_BASE_URL || '',
      headers: headers,
    });

    // Add request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // modify the request config here if needed
        return config;
      },
      (error: AxiosError) => {
        // Handle request error
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
      },
      (error: AxiosError) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Handle specific error statuses here
        if (error.response) {
          switch (error.response.status) {
            case HttpStatusCode.BadRequest:
              console.log('Bad Request - perhaps payload is invalid?');
              break;
            case HttpStatusCode.Unauthorized:
              console.log(
                'Unauthorized access - perhaps you need to log in?'
              );
              break;
            case HttpStatusCode.Forbidden:
              console.log(
                'Forbidden - you do not have permission to access this resource.'
              );
              break;
            case HttpStatusCode.NotFound:
              console.log('Resource not found.');
              break;
            case HttpStatusCode.InternalServerError:
              console.log('Internal server error.');
              break;
            default:
              console.log('An error occurred:' + error.message);
          }
        }
        return Promise.reject(error.response?.data);
      }
    );
  }

  get<T>(url: string): Promise<T> {
    return this.axiosInstance.get<T>(url).then((response) => response.data);
  }

  post<T>(
    url: string,
    data?: any
  ): Promise<T> {
    return this.axiosInstance.post<T>(url, data).then((response) => response.data);
  }

  put<T>(
    url: string,
    data: any,
  ): Promise<T> {
    return this.axiosInstance.put<T>(url, data).then((response) => response.data);
  }

  delete<T>(url: string): Promise<T> {
    return this.axiosInstance.delete<T>(url).then((response) => response.data);
  }
}

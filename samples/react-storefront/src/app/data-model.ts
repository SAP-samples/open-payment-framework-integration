export interface OpfKeyValueMap {
  key: string;
  value: string;
}

export interface OpfPaymentVerificationPayload {
  responseMap: Array<OpfKeyValueMap>;
}

export enum OpfPaymentVerificationResult {
  AUTHORIZED = 'AUTHORIZED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED',
}

export interface OpfPaymentVerificationResponse {
  result: string;
}
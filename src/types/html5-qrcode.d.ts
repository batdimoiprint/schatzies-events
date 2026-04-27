declare module 'html5-qrcode' {
  export type QrCodeSuccessCallback = (
    decodedText: string,
    decodedResult: unknown
  ) => void | Promise<void>;
  export type QrCodeErrorCallback = (errorMessage: string, error: unknown) => void;

  export class Html5QrcodeScanner {
    constructor(
      elementId: string,
      config?: {
        fps?: number;
        qrbox?: { width: number; height: number };
        aspectRatio?: number;
        disableFlip?: boolean;
      },
      verbose?: boolean
    );

    render(successCallback: QrCodeSuccessCallback, errorCallback?: QrCodeErrorCallback): void;
    clear(): Promise<void>;
    pause(shouldPauseVideo?: boolean): void;
    resume(): void;
    getState(): number;
  }
}

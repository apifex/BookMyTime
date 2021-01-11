declare global {
    namespace NodeJS {
        interface ProcessEnv {
          CREDENTIALS_PATH: string;
          TOKEN_PATH: string,
          MAIL_ADDRESS: string,
          PORT?: string,
        }
      }
}

export {}
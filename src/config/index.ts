interface ConfigData {
  [ key: string ]: any
}

const config: ConfigData = {
  AZAY_GATEWAY_URL: process.env.AZAY_GATEWAY_URL,
  REQUEST_TOKEN_URL: process.env.REQUEST_TOKEN_URL,
  DELETE_SIGN_AZD_URL: 'document/delete/signature',
  TOKEN_PIN_URL_SLACK: process.env.TOKEN_PIN_URL_SLACK,
  BACKEND_APPMAN_URL: process.env.BACKEND_APPMAN_URL,
  CIRCLECI_API: 'https://circleci.com/api/v2',
  CIRCLECI_TOKEN: process.env.CIRCLECI_TOKEN,
}

export default config
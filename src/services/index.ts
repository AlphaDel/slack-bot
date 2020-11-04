import axios from 'axios'

interface ServiceData {
  url: string,
  data: object,
}

const requestAPI = async ({ url, data }: ServiceData): Promise<any> => {
  const { data: response } = await axios.post(
    url,
    data,
    {
      headers: {
        'Content-type': 'application/json',
      },
    },
  )
  return response
}

export default requestAPI
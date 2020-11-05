import axios from 'axios'
import { AzayRequestTokenData, AzayDeleteSignData } from '../types/azay'
import { CircleCiData } from '../types/circleci'

interface ServiceData {
  url: string,
  data?: AzayRequestTokenData | CircleCiData | AzayDeleteSignData,
}

const RequestAPI = async ({ url, data }: ServiceData): Promise<any> => {
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

const GetJobIdWithName = async ({ url, data }: ServiceData): Promise<any> => {
   const { data: response } = await axios.get(
    url,
    {
      headers: {
        Accept: 'application/json',
        'Circle-Token': process.env.CIRCLECI_TOKEN,
      },
    },
  )
  const jobs: any[] = response.items
  const { id = '' }: { id?: string } = jobs.find((job) => job.name === (<CircleCiData>data).jobName) || null
  return id
}

const ApproveJobWithId = async ({ url }: ServiceData): Promise<any> => {
  const { status, data: response } = await axios.post(
    url,
    undefined,
    {
      headers: {
        Accept: 'application/json',
        'Circle-Token': process.env.CIRCLECI_TOKEN,
      },
      validateStatus: () => true,
    },
  )
  if (status !== 202) {
    throw new Error(`Error: ${response.message}`)
  }
}

export {
  RequestAPI,
  GetJobIdWithName,
  ApproveJobWithId,
}
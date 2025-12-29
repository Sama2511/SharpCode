import { createServerFn } from '@tanstack/react-start'
import 'dotenv/config'
import OpenAI from 'openai'

export const getQuestion = createServerFn().handler(async () => {
  const client = new OpenAI()
  const response = await client.responses.create({
    model: 'gpt-5.2',
    input: [
      {
        role: 'user',
        content:
          'Generate one coding challenge for a intermediate programmer, its should be 2 lines of description no more, language javascript ',
      },
    ],
  })
  console.log(response.output_text)
})

import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'

export const getQuestion = createServerFn()
  .inputValidator(
    (data: { language: string; topic: string; difficulty: string }) => data,
  )
  .handler(async ({ data }) => {
    const { language, topic, difficulty } = data
    const client = new OpenAI()
    const response = await client.responses.create({
      model: 'gpt-5.2',
      input: [
        {
          role: 'user',
          content: `Generate one coding challenge for a ${difficulty} programmer in ${language}. Topic: ${topic}. Keep it to 2 lines of description max.`,
        },
      ],
    })
    return response.output_text
  })

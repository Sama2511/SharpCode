import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'

export const getHint = createServerFn()
  .inputValidator(
    (data: { question: string; code: string }) => data,
  )
  .handler(async ({ data }) => {
    const { question, code } = data
    const client = new OpenAI()
    const response = await client.responses.create({
      model: 'gpt-5.2',
      input: [
        {
          role: 'user',
          content: `You are a coding tutor. Given the challenge and the user's current code, provide a short helpful hint that guides them in the right direction without giving away the solution. Keep it to 1-2 sentences. Never include code in your hint.

Challenge: ${question}
Current code: ${code}`,
        },
      ],
    })
    return response.output_text
  })

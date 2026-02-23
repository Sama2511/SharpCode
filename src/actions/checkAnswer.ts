import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'

export const checkAnswer = createServerFn()
  .inputValidator(
    (data: { question: string; code: string; output: string }) => data,
  )
  .handler(async ({ data }) => {
    const { question, code, output } = data
    const client = new OpenAI()
    const response = await client.responses.create({
      model: 'gpt-5.2',
      input: [
        {
          role: 'user',
          content: `You are a coding challenge evaluator. Focus on whether the code logic correctly solves the challenge. Ignore minor formatting differences like extra spaces, quotes around strings, trailing newlines, or console.log vs return. If the core logic is correct, mark it as Correct. Respond in this exact format: "Correct — [one sentence hint]" or "Wrong — [one sentence hint]". Always start with exactly "Correct" or "Wrong" followed by " — ". When wrong, give a vague directional hint that points the user in the right direction without revealing the solution. Never include code or the exact answer in the hint.

Challenge: ${question}
Code: ${code}
Output: ${output}`,
        },
      ],
    })
    return response.output_text
  })

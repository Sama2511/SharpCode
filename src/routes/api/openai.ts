import 'dotenv/config'
import OpenAI from 'openai'

const client = new OpenAI()

const response = await client.responses.create({
  model: 'gpt-5.2',
  input: [
    {
      role: 'user',
      content: 'Generate a coding challenge for a beginner programmer.',
    },
  ],
})
console.log(response.output_text)

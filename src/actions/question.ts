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
          role: 'system',
          content: `You are an expert programming challenge designer used in a coding challenge platform.

You generate unique, engaging, well-structured coding challenges.

Always follow the requested output format exactly.

Never include solutions or hints.

Avoid common problems like Fibonacci, factorial, palindrome checking, or prime number checking.

The problem should feel like a real-world scenario and require logical thinking.`,
        },
        {
          role: 'user',
          content: `Generate ONE coding challenge with the following parameters:

Language: ${language}
Topic: ${topic}
Difficulty: ${difficulty}

Difficulty guidelines:

Easy → basic loops, conditions, simple arrays/strings, beginner logic.
Medium → combining concepts, arrays/maps/sets, moderate algorithms.
Hard → complex logic, optimization, tricky edge cases.

The challenge must be solvable in:
Easy: 5–10 minutes
Medium: 15–25 minutes
Hard: 30–45 minutes

Return the challenge strictly in this format:

Title:

Difficulty: ${difficulty}

Topic: ${topic}

Problem Description:

Input Format:

Output Format:

Constraints:

Example:
Input:
Output:
Explanation:

Edge Cases:
- 
- 
-

Rules:
- Generate ONLY ONE challenge
- Do NOT include the solution
- Do NOT include hints
- Return only the formatted challenge`,
        },
      ],
    })

    return response.output_text
  })

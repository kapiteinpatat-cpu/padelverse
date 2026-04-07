'use server';
/**
 * @fileOverview AI-powered highlight suggestion flow for padel match videos.
 *
 * - suggestHighlights - A function that suggests potential highlight moments from a match video.
 * - HighlightSuggestionsInput - The input type for the suggestHighlights function.
 * - HighlightSuggestionsOutput - The return type for the suggestHighlights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightSuggestionsInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a padel match, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  tags: z.array(z.string()).describe('An array of tags to identify highlight moments, e.g., smash, lob, winner.'),
});
export type HighlightSuggestionsInput = z.infer<typeof HighlightSuggestionsInputSchema>;

const HighlightSuggestionsOutputSchema = z.object({
  suggestedMoments: z.array(
    z.object({
      timestamp: z.number().describe('The timestamp of the suggested highlight moment in seconds.'),
      reason: z.string().describe('The reason why this moment is suggested as a highlight.'),
    })
  ).describe('An array of suggested highlight moments with timestamps and reasons.'),
});
export type HighlightSuggestionsOutput = z.infer<typeof HighlightSuggestionsOutputSchema>;

export async function suggestHighlights(input: HighlightSuggestionsInput): Promise<HighlightSuggestionsOutput> {
  return suggestHighlightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightSuggestionsPrompt',
  input: {schema: HighlightSuggestionsInputSchema},
  output: {schema: HighlightSuggestionsOutputSchema},
  prompt: `You are an AI assistant specialized in identifying key highlight moments from padel match videos.

You will analyze the video and identify moments that are likely to be highlights based on the provided tags.

Return an array of suggested highlight moments with timestamps (in seconds) and reasons for the suggestion.

Video: {{media url=videoDataUri}}
Tags: {{{tags}}}

Format your response as a JSON object conforming to the HighlightSuggestionsOutputSchema.
`,
});

const suggestHighlightsFlow = ai.defineFlow(
  {
    name: 'suggestHighlightsFlow',
    inputSchema: HighlightSuggestionsInputSchema,
    outputSchema: HighlightSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
